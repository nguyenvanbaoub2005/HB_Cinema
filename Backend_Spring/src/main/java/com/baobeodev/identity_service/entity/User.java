package com.baobeodev.identity_service.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Entity
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(
      name = "username",
      unique = true,
      columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
  String username;

  String password;
  String firstName;
  String lastName;
  String email;
  String phoneNumber;
  String address;
  LocalDate dob;
  @ManyToMany Set<Role> roles;
}
