package com.baobeodev.identity_service.configuration;

import com.baobeodev.identity_service.entity.Permission;
import com.baobeodev.identity_service.entity.Role;
import com.baobeodev.identity_service.entity.User;
import com.baobeodev.identity_service.repository.PermissionRepository;
import com.baobeodev.identity_service.repository.RoleRepository;
import com.baobeodev.identity_service.repository.UserRepository;
import com.baobeodev.identity_service.service.PermissionService;
import java.util.HashSet;
import java.util.Set;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
  PasswordEncoder passwordEncoder;
  RoleRepository roleRepository;

  @Bean
  ApplicationRunner applicationRunner(
      UserRepository userRepository,
      PermissionService permissionService,
      PermissionRepository permissionRepository) {
    return args -> {
      // Tạo một Admin khi trong database chưa có admin
      if (userRepository.findByUsername("admin").isEmpty()) {
        // Kiểm tra và tạo role ADMIN nếu chưa tồn tại
        Set<Permission> permissions = new HashSet<>(permissionRepository.findAll());
        Role adminRole =
            roleRepository
                .findByName("ADMIN")
                .orElseGet(
                    () ->
                        roleRepository.save(
                            new Role("ADMIN", "Administrator role with full access", permissions)));

        // Khởi tạo user admin với role ADMIN
        User user =
            User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin"))
                .roles(new HashSet<>(Set.of(adminRole))) // Gán role vào user
                .build();

        userRepository.save(user);
        log.warn(
            "admin user has been created with default password 'admin', please change password.");
      }
    };
  }
}
