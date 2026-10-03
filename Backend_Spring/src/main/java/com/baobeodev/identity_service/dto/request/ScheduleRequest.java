package com.baobeodev.identity_service.dto.request;

import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleRequest {
  LocalDateTime startDateTime; // Thay vì có 2 trường startDate và startTime
  double price;
  int movieId;
  int branchId;
  int roomId;
}
