package com.baobeodev.identity_service.mapper;

import com.baobeodev.identity_service.dto.request.MovieCreationRequest;
import com.baobeodev.identity_service.dto.request.MovieUpdateRequest;
import com.baobeodev.identity_service.dto.response.MovieResponse;
import com.baobeodev.identity_service.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovieMapper {
  //    @Mapping(source = "overView", target = "overView")
  Movie toMovie(MovieCreationRequest request);

  Movie updateMovie(@MappingTarget Movie movie, MovieUpdateRequest request);

  MovieResponse toMovieResponse(Movie movie);
}
