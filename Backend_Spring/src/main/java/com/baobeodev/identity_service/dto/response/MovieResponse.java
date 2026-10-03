package com.baobeodev.identity_service.dto.response;

import java.util.Date;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieResponse {
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
