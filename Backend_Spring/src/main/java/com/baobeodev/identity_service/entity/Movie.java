package com.baobeodev.identity_service.entity;

import jakarta.persistence.*;
import java.util.Date;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@Entity
public class Movie {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  int id; // Đổi từ Long thành Integer

  String title;
  String image;
  Date releaseDate;
  String duration;

  @Column(name = "over_view", length = 1500)
  String overView;

  Float rating;
  String trailer;
  String language;

  // Các getter và setter nếu cần
}
