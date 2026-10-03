package com.baobeodev.identity_service.repository;

import com.baobeodev.identity_service.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Integer> {
  boolean existsByTitle(String title);
}
