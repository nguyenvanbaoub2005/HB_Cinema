import React, { useContext, useState } from "react";
import "./top-movie.css";

import { MovieContext } from "../../../context/MovieProvider";

const TopMovie = ({ movie, onMovieClick }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { handleTrailer } = useContext(MovieContext);


  const moviesPerPage = 7; // Số lượng phim hiển thị trên một trang

  // Sắp xếp phim theo rating giảm dần
  const sortedMovies = [...movie].sort((a, b) => b.rating - a.rating);

  // Tính toán phim hiển thị trong trang hiện tại
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Chuyển trang
  const totalPages = Math.ceil(movie.length / moviesPerPage);
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="top-movie-list">
      {/* Thêm tiêu đề Top Rating */}
      <h1 className="top-movie-heading">Top rated movies</h1>

      {currentMovies.map((movie) => (
        <div className="top-movie-card" key={movie.id} >
          {/* Rating ở góc phải */}
          <div className="top-movie-rating" >{movie.rating.toFixed(1)} </div>
          <img src={movie.image} alt={movie.title} className="top-movie-image" onClick={() => onMovieClick(movie.id)} />
          <div className="top-movie-info">
            <h2 className="top-movie-title" onClick={() => onMovieClick(movie.id)}>{movie.title}</h2>
            <p className="top-movie-duration" onClick={() => onMovieClick(movie.id)}>
              ⏱ {Math.floor(movie.duration / 60)} hours {movie.duration % 60} minutes
            </p>
            <p className="top-movie-overview" onClick={() => onMovieClick(movie.id)}>{movie.overView}</p>
            <p>
              <strong>Language:</strong> {movie.language}
            </p>
            <p>
              <strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}
            </p>
            <a onClick={() => handleTrailer(movie.trailer)}
              className="top-movie-trailer"
            >
              Watch Trailer
            </a>
          </div>
        </div>
      ))}
      <div className="top-movie-pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="top-movie-page-button"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`top-movie-page-button ${currentPage === index + 1 ? "top-movie-page-active" : ""
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="top-movie-page-button"
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default TopMovie;
