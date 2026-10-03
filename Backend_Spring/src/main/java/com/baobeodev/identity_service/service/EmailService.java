package com.baobeodev.identity_service.service;

import jakarta.activation.DataSource;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import java.util.Base64;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

  private final JavaMailSender mailSender;

  public void sendEmailWithQRCode(
      String to, String subject, String body, List<String> qrBase64Images)
      throws MessagingException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);

    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(body, true); // HTML format

    // Xử lý từng chuỗi QR dạng Base64
    for (int i = 0; i < qrBase64Images.size(); i++) {
      String base64Image = qrBase64Images.get(i);

      // Loại bỏ header "data:image/png;base64,"
      String[] parts = base64Image.split(",");
      if (parts.length != 2) {
        throw new IllegalArgumentException("Base64 QR code không hợp lệ");
      }

      // Decode Base64 thành byte[]
      byte[] imageBytes = Base64.getDecoder().decode(parts[1]);

      // Tạo DataSource cho hình ảnh
      DataSource imageSource = new ByteArrayDataSource(imageBytes, "image/png");

      // Thêm hình ảnh vào email
      helper.addInline("qrImage_" + i, imageSource);
    }

    mailSender.send(message);
  }
}
