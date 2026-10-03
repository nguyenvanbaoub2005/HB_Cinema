package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.request.PasswordChangeRequest;
import com.baobeodev.identity_service.dto.request.UserCreationRequest;
import com.baobeodev.identity_service.dto.request.UserUpdateRequest;
import com.baobeodev.identity_service.dto.response.UserResponse;
import com.baobeodev.identity_service.entity.Permission;
import com.baobeodev.identity_service.entity.Role;
import com.baobeodev.identity_service.entity.User;
import com.baobeodev.identity_service.exception.AppException;
import com.baobeodev.identity_service.exception.ErrorCode;
import com.baobeodev.identity_service.mapper.UserMapper;
import com.baobeodev.identity_service.repository.PermissionRepository;
import com.baobeodev.identity_service.repository.RoleRepository;
import com.baobeodev.identity_service.repository.UserRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
// tạo biến final
public class UserService {
  UserRepository userRepository;
  UserMapper userMapper;
  PasswordEncoder passwordEncoder;
  RoleRepository roleRepository;
  PermissionRepository permissionRepository;

  public UserResponse createUser(UserCreationRequest request) {
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new AppException(ErrorCode.USER_EXISTED);
    }
    User user = userMapper.toUser(request);
    user.setPassword(passwordEncoder.encode((user.getPassword())));
    List<Permission> allPermissions =
        permissionRepository.findAll(); // Lấy toàn bộ danh sách quyền từ cơ sở dữ liệu
    Set<Permission> permissions = new HashSet<>(allPermissions); // Chuyển danh sách quyền sang Set
    Role userRole =
        roleRepository
            .findByName("USER")
            .orElseGet(
                () ->
                    roleRepository.save(
                        new Role("USER", "The current user is RoleUser", permissions)));
    user.setRoles(Set.of(userRole));
    user = userRepository.save(user);
    return userMapper.toUserResponse(user);
  }

  public UserResponse getMyInfo() {
    var context = SecurityContextHolder.getContext();
    String name = context.getAuthentication().getName(); // Lấy tên người dùng hiện tại
    User user =
        userRepository
            .findByUsername(name)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    log.info("Fetching user info for: {}", name); // Nếu không tìm thấy user
    return userMapper.toUserResponse(user);
  }

  public UserResponse updateUser(String userId, UserUpdateRequest request) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    userMapper.updateUser(user, request);
    // Kiểm tra và cập nhật mật khẩu (nếu được cung cấp)
    //        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
    //            user.setPassword(passwordEncoder.encode(request.getPassword()));
    //        }
    var roles = roleRepository.findAllById(request.getRoles());
    user.setRoles(new HashSet<>(roles));
    return userMapper.toUserResponse(userRepository.save(user));
  }

  @PreAuthorize("hasRole('ADMIN')")
  public void deleteUser(String userId) {
    userRepository.deleteById(userId);
  }

  @PreAuthorize("hasRole('ADMIN')")
  public List<UserResponse> getUsers() {
    log.info("In method get Users");
    return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
  }

  @PreAuthorize("hasRole('ADMIN')")
  public UserResponse getUser(String id) {
    log.info("In method get User by Id");
    return userMapper.toUserResponse(
        userRepository.findById(id).orElseThrow(() -> new RuntimeException()));
  }

  public void changePasswordForUser(String userId, PasswordChangeRequest passwordChangeRequest) {
    var user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    // Xác thực mật khẩu hiện tại
    if (!passwordEncoder.matches(passwordChangeRequest.getCurrentPassword(), user.getPassword())) {
      throw new RuntimeException("Current password is incorrect");
    }
    // Kiểm tra xem mật khẩu mới có giống mật khẩu hiện tại không
    if (passwordEncoder.matches(passwordChangeRequest.getNewPassword(), user.getPassword())) {
      throw new RuntimeException("New password must be different from the current password");
    }
    user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
    userRepository.save(user);
  }
}
