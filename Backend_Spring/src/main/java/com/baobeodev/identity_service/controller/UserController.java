package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.request.PasswordChangeRequest;
import com.baobeodev.identity_service.dto.request.UserCreationRequest;
import com.baobeodev.identity_service.dto.request.UserUpdateRequest;
import com.baobeodev.identity_service.dto.response.UserResponse;
import com.baobeodev.identity_service.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {

  UserService userService;

  @PostMapping
  ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
    return ApiResponse.<UserResponse>builder().result(userService.createUser(request)).build();
  }

  @GetMapping
  ApiResponse<List<UserResponse>> getUser() {
    return ApiResponse.<List<UserResponse>>builder().result(userService.getUsers()).build();
  }

  @GetMapping("/{userId}")
  ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId) {
    UserResponse userResponse = userService.getUser(userId);
    // Trả về ApiResponse chứa dữ liệu của người dùng
    return ApiResponse.<UserResponse>builder()
        .result(userResponse)
        .message("GetUser successfully")
        .build();
  }

  @GetMapping("/myInfo")
  ApiResponse<UserResponse> getMyInfo() {
    UserResponse userResponse = userService.getMyInfo();
    return ApiResponse.<UserResponse>builder().result(userResponse).build();
  }

  @PutMapping("/{userId}")
  ApiResponse<UserResponse> updateUser(
      @PathVariable @Valid String userId, @RequestBody @Valid UserUpdateRequest request) {
    UserResponse userResponse = userService.updateUser(userId, request);
    // Trả về ApiResponse chứa dữ liệu của người dùng
    return ApiResponse.<UserResponse>builder()
        .result(userResponse)
        .message("Update successfully")
        .build();
  }

  @DeleteMapping("/{userId}")
  ApiResponse<String> deleteUser(@PathVariable String userId) {
    userService.deleteUser(userId);
    return ApiResponse.<String>builder().result("User has been deleted").build();
  }

  @PutMapping("/{userId}/change-password")
  public ApiResponse<String> changePassword(
      @PathVariable @Valid String userId,
      @RequestBody @Valid PasswordChangeRequest passwordChangeRequest) {
    try {
      userService.changePasswordForUser(userId, passwordChangeRequest);
      return ApiResponse.<String>builder().result("Password changed successfully").build();
    } catch (RuntimeException ex) {
      return ApiResponse.<String>builder().message(ex.getMessage()).build();
    }
  }
}
