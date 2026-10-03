package com.baobeodev.identity_service.dto.request;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
  @Size(min = 3, message = "USERNAME_INVALID")
  String username;

  //    @Size(min = 8, message = "PASSWORD_INVALID")
  //    String password;
  String firstName;
  String lastName;
  String email;
  String phoneNumber;
  String address;
  LocalDate dob;
  List<String> roles;
}
