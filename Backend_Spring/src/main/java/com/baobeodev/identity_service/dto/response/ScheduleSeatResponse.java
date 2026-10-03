package com.baobeodev.identity_service.dto.response;

import com.baobeodev.identity_service.entity.Seat;
import lombok.*;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleSeatResponse {
  Integer id;
  Seat seat;
  boolean booked;
}
