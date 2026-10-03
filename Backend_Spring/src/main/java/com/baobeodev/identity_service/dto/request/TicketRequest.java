package com.baobeodev.identity_service.dto.request;

import com.baobeodev.identity_service.entity.Combo;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketRequest {
  int seatId; // ID ghế
  int scheduleId; // ID lịch chiếu
  String qrImageURL; // Link ảnh QR
  List<Combo> combos; // Danh sách các combo đồ ăn
}
