package com.baobeodev.identity_service.dto.response;

import com.baobeodev.identity_service.entity.Bill;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketAggregateResponse {
  int totalTickets; // Tổng số vé
  double totalPrice;
  double totalComboPrice;
  double totalAmount;
  List<TicketResponse> tickets;
  List<ComboResponse> combos;
  Bill bill;
}
