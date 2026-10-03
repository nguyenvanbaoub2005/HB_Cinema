package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.response.BillResponse;
import com.baobeodev.identity_service.entity.*;
import com.baobeodev.identity_service.exception.AppException;
import com.baobeodev.identity_service.exception.ErrorCode;
import com.baobeodev.identity_service.mapper.BillMapper;
import com.baobeodev.identity_service.repository.BillRepository;
import com.baobeodev.identity_service.repository.ComboRepository;
import com.baobeodev.identity_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j // cho ghi log
public class BillService {
  private final ComboRepository comboRepository;
  BillRepository billRepository;
  BillMapper billMapper;
  UserRepository userRepository;
  private final ScheduleSeatService scheduleSeatService;

  public BillResponse createBillForCurrentUser() {
    // Lấy thông tin người dùng hiện tại từ SecurityContext
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    // Tạo hóa đơn mới
    Bill bill = new Bill();
    bill.setUser(user);
    bill.setCreatedTime(LocalDateTime.now());
    // Lưu hóa đơn và trả về BillResponse
    Bill savedBill = billRepository.save(bill);
    log.info("User in Bill: " + savedBill.getUser().getEmail()); // Kiểm tra User trong Bill

    return billMapper.toBillResponse(savedBill);
  }

  public List<BillResponse> getAllBillsForCurrentUser() {
    var context = SecurityContextHolder.getContext();
    String username = context.getAuthentication().getName();
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    List<Bill> bills = billRepository.findByUser_Username(username);
    log.info(" " + bills);
    return bills.stream().map(billMapper::toBillResponse).collect(Collectors.toList());
  }

  @PreAuthorize("hasRole('ADMIN')")
  public List<BillResponse> getAllBillsByUser(String idUser) {
    User user =
        userRepository
            .findById(idUser)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    List<Bill> bills = billRepository.findByUser_Id(idUser);
    return bills.stream().map(billMapper::toBillResponse).collect(Collectors.toList());
  }

  @PreAuthorize("hasRole('ADMIN')")
  public List<BillResponse> getBills() {
    log.info("In method get Bills");
    return billRepository.findAll().stream().map(billMapper::toBillResponse).toList();
  }

  @Transactional
  public void addCombosToBill(Integer billId, List<Combo> combos) {
    // Tìm Bill
    Bill bill =
        billRepository.findById(billId).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    // Gán Combo cho Bill
    combos.forEach(
        combo -> {
          combo.setBill(bill); // Gán combo vào Bill
          comboRepository.save(combo); // Lưu combo vào DB
        });
  }
}
