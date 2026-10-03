package com.baobeodev.identity_service.dto.request;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
  @Size(min = 3, message = "USERNAME_INVALID")
  String username;

  @Size(min = 8, message = "PASSWORD_INVALID")
  String password;

  String firstName;
  String lastName;
  String email;
  String phoneNumber;
  String address;
  LocalDate dob;

  public @Size(min = 3, message = "USERNAME_INVALID") String getUsername() {
    return username;
  }

  public @Size(min = 8, message = "PASSWORD_INVALID") String getPassword() {
    return password;
  }
}
