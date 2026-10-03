package com.baobeodev.identity_service.dto.request;

import java.util.Date;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieUpdateRequest {
  String title;
  String image;
  Date releaseDate;
  String duration;
  String overView;
  Float rating;
  String trailer;
  String language;
}
