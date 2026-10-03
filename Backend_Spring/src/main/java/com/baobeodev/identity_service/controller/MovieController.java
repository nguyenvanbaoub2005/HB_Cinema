package com.baobeodev.identity_service.controller;

import com.baobeodev.identity_service.dto.request.ApiResponse;
import com.baobeodev.identity_service.dto.request.MovieCreationRequest;
import com.baobeodev.identity_service.dto.request.MovieUpdateRequest;
import com.baobeodev.identity_service.dto.response.MovieResponse;
import com.baobeodev.identity_service.service.MovieService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MovieController {
  @Autowired MovieService movieService;

  @PostMapping
  ApiResponse<MovieResponse> createMovie(@RequestBody @Valid MovieCreationRequest request) {
    return ApiResponse.<MovieResponse>builder()
        .result(movieService.createMovie(request))
        .message("Add movie successfully")
        .build();
  }

  @GetMapping("/{movieId}")
  ApiResponse<MovieResponse> getMovie(@PathVariable("movieId") int movieId) {
    MovieResponse movieResponse = movieService.getMovieById(movieId);
    // Trả về ApiResponse chứa dữ liệu của người dùng
    return ApiResponse.<MovieResponse>builder()
        .result(movieResponse)
        .message("Get moviebyId successfully")
        .build();
  }

  @GetMapping
  public ApiResponse<List<MovieResponse>> getAllMovies() {
    List<MovieResponse> movies = movieService.getMovies();
    return ApiResponse.<List<MovieResponse>>builder()
        .result(movies)
        .message("Get movie successfully") // Sử dụng biến đã lưu
        .build();
  }

  @PutMapping("/{movieId}")
  public ApiResponse<MovieResponse> updateMovie(
      @PathVariable("movieId") int idMovie, @RequestBody MovieUpdateRequest request) {
    MovieResponse updatedMovie = movieService.updateMovie(idMovie, request);
    return ApiResponse.<MovieResponse>builder()
        .result(updatedMovie)
        .message("Movie updated successfully")
        .build();
  }

  @DeleteMapping("/{movieId}")
  String deleteMovie(@PathVariable("movieId") int movieId) {
    movieService.deleteMovie(movieId);
    return "Movie has been deleted";
  }
}
