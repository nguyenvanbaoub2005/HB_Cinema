package com.baobeodev.identity_service.dto.request;

// Nhập đối tượng Branch
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomRequest {
  int id; // Nếu bạn muốn cho phép cập nhật, nếu không có thể loại bỏ trường này
  String name;
  int capacity;
  double totalArea;
  String imgURL; // URL cho hình ảnh của phòng
  int branchId; // Thay vì ID, sử dụng đối tượng Branch
}
