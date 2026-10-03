package com.baobeodev.identity_service.service;

import com.baobeodev.identity_service.dto.request.MovieCreationRequest;
import com.baobeodev.identity_service.dto.request.MovieUpdateRequest;
import com.baobeodev.identity_service.dto.response.MovieResponse;
import com.baobeodev.identity_service.entity.Movie;
import com.baobeodev.identity_service.exception.AppException;
import com.baobeodev.identity_service.exception.ErrorCode;
import com.baobeodev.identity_service.mapper.MovieMapper;
import com.baobeodev.identity_service.repository.MovieRepository;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
// taoj cóntructor final
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j // cho ghi log
public class MovieService {
  MovieRepository movieRepository;
  MovieMapper movieMapper;

  @PreAuthorize("hasRole('ADMIN')")
  public MovieResponse createMovie(MovieCreationRequest request) {
    if (movieRepository.existsByTitle(request.getTitle())) {
      throw new AppException(ErrorCode.MOVIE_EXISTED);
    }
    Movie movie = movieMapper.toMovie(request);
    movie = movieRepository.save(movie);
    return movieMapper.toMovieResponse(movie);
  }

  public MovieResponse getMovieById(int id) {
    return movieMapper.toMovieResponse(
        movieRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.MOVIE_EXISTED)));
  }

  public List<MovieResponse> getMovies() {
    log.info("In method get Movies");
    return movieRepository.findAll().stream().map(movieMapper::toMovieResponse).toList();
  }

  @PreAuthorize("hasRole('ADMIN')")
  public MovieResponse updateMovie(int id, MovieUpdateRequest request) {
    Movie movie =
        movieRepository.findById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
    movieMapper.updateMovie(movie, request);
    return movieMapper.toMovieResponse(movieRepository.save(movie));
  }

  @PreAuthorize("hasRole('ADMIN')")
  public void deleteMovie(int id) {
    movieRepository.deleteById(id);
  }
}
