package com.baobeodev.identity_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ComboResponse {
  private String name; // Tên combo đồ ăn
  private double price; // Giá combo đồ ăn
}
