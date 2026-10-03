import React, { useState } from 'react';
import './moviegrid.css';

const MovieGrid = ({ movies, onMovieClick }) => {
  const moviesPerPage = 9; // Số phim mỗi trang
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  // Xử lý phân trang
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Lấy các phim của trang hiện tại
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  return (
    <div className="movie-grid">
      <h2 className="movie-grid-heading">Movies for you</h2>
      <div className="movie-grid-list">
        {currentMovies.map((movie) => (
          <div key={movie.id} className="movie-grid-card" onClick={() => onMovieClick(movie.id)}>
            <img src={movie.image} alt={movie.title} className="movie-grid-image" />
            <div className="movie-grid-info">
              <h3 className="movie-grid-title">{movie.title}</h3>
              <p className="movie-grid-duration">{movie.duration} min</p>
              <p className="movie-grid-overview">{movie.overView}</p>
            </div>
            <div className="movie-grid-rating">{movie.rating.toFixed(1)}</div>

          </div>
        ))}
      </div>

      <div className="movie-grid-pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index + 1)}
            className={`movie-grid-page-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
