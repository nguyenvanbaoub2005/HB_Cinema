package com.baobeodev.identity_service.dto.request;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.Date;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieCreationRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  int id;

  String title;
  String image;
  Date releaseDate;
  String duration;
  String overView;
  Float rating;
  String trailer;
  String language;
}
