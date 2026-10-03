package com.baobeodev.identity_service.dto.response;

import com.baobeodev.identity_service.entity.Ticket;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillResponse {
  int id;
  LocalDateTime createdTime;
  Ticket ticket;
}
