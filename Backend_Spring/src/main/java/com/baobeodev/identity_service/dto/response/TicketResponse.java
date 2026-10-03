package com.baobeodev.identity_service.dto.response;

import com.baobeodev.identity_service.entity.Schedule;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketResponse {
  int id; // ID của vé
  String qrImageURL; // Link ảnh QR
  String seatName; // Tên ghế
  double price;
  Schedule scheduleDetails;
  //     private List<ComboResponse> combos;
  // Chi tiết lịch chiếu
  // Getters và Setters
}
