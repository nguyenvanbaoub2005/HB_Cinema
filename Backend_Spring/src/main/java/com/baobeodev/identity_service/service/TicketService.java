package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.request.TicketRequest;
import com.baobeodev.identity_service.dto.response.BillResponse;
import com.baobeodev.identity_service.dto.response.ComboResponse;
import com.baobeodev.identity_service.dto.response.TicketAggregateResponse;
import com.baobeodev.identity_service.dto.response.TicketResponse;
import com.baobeodev.identity_service.entity.*;
import com.baobeodev.identity_service.exception.AppException;
import com.baobeodev.identity_service.exception.ErrorCode;
import com.baobeodev.identity_service.mapper.BillMapper;
import com.baobeodev.identity_service.mapper.TicketMapper;
import com.baobeodev.identity_service.repository.*;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j // cho ghi log
public class TicketService {
  TicketRepository ticketRepository;
  BillRepository billRepository;
  TicketMapper ticketMapper;
  BillService billService;
  BillMapper billMapper;
  ScheduleSeatService scheduleSeatService;
  EmailService emailService;

  public List<TicketResponse> getAllTickets() {
    return ticketRepository.findAll().stream().map(ticketMapper::toTicketResponse).toList();
  }

  public List<TicketResponse> getTicketsByBillId(Integer billId) {
    List<Ticket> tickets = ticketRepository.findByBill_Id(billId);
    return tickets.stream().map(ticketMapper::toTicketResponse).collect(Collectors.toList());
  }

  @Transactional
  public TicketAggregateResponse createTickets(
      Integer billId, List<TicketRequest> ticketRequests, List<Combo> combos) {
    // Kiểm tra và tạo mới Bill nếu chưa tồn tại
    Bill bill = getOrCreateBill(billId);
    // Thêm Combo vào Bill và lưu vào database
    billService.addCombosToBill(bill.getId(), combos);
    double totalTicketPrice = 0.0;
    double totalComboPrice = 0.0;

    // Xử lý các yêu cầu tạo vé
    List<TicketResponse> ticketResponses = new ArrayList<>();
    List<String> qrImageUrls = new ArrayList<>();
    List<ComboResponse> comboResponses = null;
    for (TicketRequest ticketRequest : ticketRequests) {
      // Kiểm tra trạng thái ghế trong lịch chiếu và đặt ghế
      ScheduleSeat scheduleSeat =
          scheduleSeatService.bookSeatForSchedule(
              ticketRequest.getScheduleId(), ticketRequest.getSeatId());
      // Tạo mới Ticket và gắn các thông tin cần thiết
      Ticket ticket = new Ticket();
      ticket.setBill(bill); // Gắn bill vào ticket
      ticket.setSeat(scheduleSeat.getSeat());
      ticket.setSchedule(scheduleSeat.getSchedule());

      // Tính giá vé và cộng dồn vào tổng
      double ticketPrice = scheduleSeat.getSeat().getPrice();
      totalTicketPrice += ticketPrice;

      // Tạo QR code cho vé
      String qrCodeText = generateQRCodeText(ticket);
      String qrImageUrl = generateQRCodeImage(qrCodeText);
      ticket.setQrImageURL(qrImageUrl);
      qrImageUrls.add(qrImageUrl);
      // Lưu vé vào database
      ticketRepository.save(ticket);
      comboResponses =
          combos.stream()
              .map(
                  combo -> {
                    // map truc tiep k qua dto
                    ComboResponse response = new ComboResponse();
                    response.setName(combo.getName());
                    response.setPrice(combo.getPrice());
                    return response;
                  })
              .toList();
      // Chuyển Ticket thành TicketResponse
      TicketResponse ticketResponse = ticketMapper.toTicketResponse(ticket);

      ticketResponses.add(ticketResponse);
    }
    // Tính tổng giá trị của Combo
    totalComboPrice = combos.stream().mapToDouble(Combo::getPrice).sum();

    // Tính tổng tiền (vé + combo)
    double totalAmount = totalTicketPrice + totalComboPrice;
    // lấy meo từ JWT
    String userEmail = getEmailUser();
    log.info("Send To " + userEmail);
    try {
      String emailSubject = "Thông tin vé xem phim của bạn";
      String emailBody =
          buildEmailBody(
              ticketResponses,
              totalTicketPrice,
              combos,
              totalComboPrice,
              totalAmount,
              qrImageUrls); // Tạo nội dung email
      emailService.sendEmailWithQRCode(userEmail, emailSubject, emailBody, qrImageUrls);
    } catch (Exception e) {
      log.error("Lỗi khi gửi email (bỏ qua để tiếp tục luồng mua vé): ", e);
    }
    return TicketAggregateResponse.builder()
        .totalTickets(ticketResponses.size())
        .totalPrice(totalTicketPrice)
        .totalComboPrice(totalComboPrice)
        .totalAmount(totalAmount)
        .tickets(ticketResponses)
        .combos(comboResponses)
        .bill(bill)
        .build();
  }

  private String buildEmailBody(
      List<TicketResponse> ticketResponses,
      double totalTicketPrice,
      List<Combo> combos,
      double totalComboPrice,
      double totalAmount,
      List<String> qrImageIds) {
    String ticketsInfo =
        ticketResponses.stream()
            .map(
                ticket ->
                    "<tr>"
                        + "<td style='padding: 8px; border: 1px solid #ddd;'>"
                        + ticket.getSeatName()
                        + "</td>"
                        + "<td style='padding: 8px; border: 1px solid #ddd;'>"
                        + ticket.getScheduleDetails().getMovie().getTitle()
                        + "</td>"
                        + "<td style='padding: 8px; border: 1px solid #ddd;'>"
                        + ticket.getScheduleDetails().getBranch().getName()
                        + "</td>"
                        + "<td style='padding: 8px; border: 1px solid #ddd;'>"
                        + ticket.getScheduleDetails().getRoom().getName()
                        + "</td>"
                        + "<td style='padding: 8px; border: 1px solid #ddd; color: green;'><strong>"
                        + ticket.getPrice()
                        + " VND</strong></td>"
                        + "</tr>")
            .collect(Collectors.joining());

    String combosInfo =
        combos.stream()
            .map(
                combo ->
                    "<tr>"
                        + "<td style='padding: 8px; border: 1px solid #ddd;'>"
                        + combo.getName()
                        + "</td>"
                        + "<td style='padding: 8px; border: 1px solid #ddd;'>"
                        + combo.getPrice()
                        + " VND</td>"
                        + "</tr>")
            .collect(Collectors.joining());

    String qrImages =
        qrImageIds.stream()
            .map(id -> "<img src='cid:" + id + "' style='margin: 10px; ' />")
            .collect(Collectors.joining());

    return "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>"
        + "<h2 style='color: orange; text-align: center;'>HB cám ơn bạn đã đặt vé!</h2>"
        + "<h4 style='color: #555;'>Thông tin vé:</h4>"
        + "<table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>"
        + "<thead>"
        + "<tr style='background-color: #f2f2f2;'>"
        + "<th style='padding: 8px; border: 1px solid #ddd;'>Seat</th>"
        + "<th style='padding: 8px; border: 1px solid #ddd;'>Movie</th>"
        + "<th style='padding: 8px; border: 1px solid #ddd;'>Branch</th>"
        + "<th style='padding: 8px; border: 1px solid #ddd;'>Room</th>"
        + "<th style='padding: 8px; border: 1px solid #ddd;'>Price</th>"
        + "</tr>"
        + "</thead>"
        + "<tbody>"
        + ticketsInfo
        + "</tbody>"
        + "</table>"
        + "<h4 style='color: #555;'>Thông tin combo:</h4>"
        + "<table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>"
        + "<thead>"
        + "<tr style='background-color: #f2f2f2;'>"
        + "<th style='padding: 8px; border: 1px solid #ddd;'>Combo</th>"
        + "<th style='padding: 8px; border: 1px solid #ddd;'>Price</th>"
        + "</tr>"
        + "</thead>"
        + "<tbody>"
        + combosInfo
        + "</tbody>"
        + "</table>"
        + "<p style='font-size: 16px;'><strong>Tổng tiền vé:</strong> "
        + totalTicketPrice
        + " $</p>"
        + "<p style='font-size: 16px;'><strong>Tổng tiền combo:</strong> "
        + totalComboPrice
        + " $</p>"
        + "<p style='font-size: 18px; color: green;'><strong>Tổng cộng:</strong> "
        + totalAmount
        + " $</p>"
        + "<h4 style='color: #555;'>Mã QR:</h4>"
        + "<div style='text-align: center;'>"
        + qrImages
        + "</div>"
        + "</div>";
  }

  public String getEmailUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Jwt jwt = (Jwt) authentication.getPrincipal();
    String userEmail = jwt.getClaim("email");
    return userEmail;
  }

  public String getUsernameFromJwt() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication instanceof JwtAuthenticationToken) {
      Jwt jwt = (Jwt) authentication.getPrincipal();
      return jwt.getClaim("sub"); // Lấy thông tin từ claim "sub"
    }
    return null;
  }

  private Bill getOrCreateBill(Integer billId) {
    if (billId != null) {
      return billRepository
          .findById(billId)
          .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
    BillResponse billResponse = billService.createBillForCurrentUser();
    return billMapper.toEntity(billResponse);
  }

  private String generateQRCodeText(Ticket ticket) {
    // Lấy thông tin từ đối tượng Ticket
    String startDateTime = ticket.getSchedule().getStartDateTime().toString(); // Thời gian bắt đầu
    String movieTitle = ticket.getSchedule().getMovie().getTitle(); // Tên phim
    String seatName = ticket.getSeat().getName(); // Tên ghế
    String branchName = ticket.getSchedule().getBranch().getName(); // Tên chi nhánh
    String roomName = ticket.getSchedule().getRoom().getName(); // Tên phòng
    String timeBuyTicket = ticket.getBill().getCreatedTime().toString(); // ngày mua
    return """
        MOVIE: %s
        START TIME: %s
        BRANCH: %s
        ROOM: %s
        SEAT: %s
        TIME CREATE: %s
        """
        .formatted(movieTitle, startDateTime, branchName, roomName, seatName, timeBuyTicket);
  }

  private String generateQRCodeImage(String text) {
    try {
      QRCodeWriter qrCodeWriter = new QRCodeWriter();
      Map<EncodeHintType, Object> hintMap = new HashMap<>();
      hintMap.put(EncodeHintType.MARGIN, 1); // Tùy chỉnh

      // Tạo QR code với kích thước 250x250 px
      BufferedImage qrCodeImage =
          MatrixToImageWriter.toBufferedImage(
              qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 250, 250, hintMap));
      // Chuyển đổi hình ảnh thành base64 để sử dụng làm URL hình ảnh
      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      ImageIO.write(qrCodeImage, "PNG", byteArrayOutputStream);
      byte[] imageBytes = byteArrayOutputStream.toByteArray();
      return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    } catch (WriterException | IOException e) {
      throw new RuntimeException("Error generating QR Code", e);
    }
  }
}
