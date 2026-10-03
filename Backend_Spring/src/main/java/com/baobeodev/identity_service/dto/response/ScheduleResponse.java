package com.baobeodev.identity_service.dto.response;

import com.baobeodev.identity_service.entity.Room;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleResponse {
  int id;
  LocalDateTime startDateTime;
  double price;
  String movieName;
  String branchName;
  Room room;
}
