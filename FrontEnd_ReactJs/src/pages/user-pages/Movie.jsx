import React, { useEffect, useState } from "react";
import Footer from "../../components/User/footer/Footer";
import MovieDetail from "../../components/User/movie-details/MovieDetail";
import MovieCard from "../../components/User/movie-card/MovieCard";
import { getAllMovie } from "../../api/apiMovie";
import MovieGrid from "../../components/User/movie-grid/MovieGrid";
import { useNavigate } from "react-router-dom";
import MovieList from "../../components/User/movie-list/MovieList";

// Hàm để xáo trộn mảng
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Movie = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllMovie();
  }, []);

  const fetchAllMovie = async () => {
    try {
      const data = await getAllMovie();
      const shuffledMovies = shuffleArray(data.result);  // Xáo trộn danh sách phim
      setMovie(shuffledMovies);
      console.log(shuffledMovies);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMovieClick = (id) => {
    navigate(`/movies/${id}`);
  };

  // Chia bộ phim thành 2 phần để hiển thị trong 2 component khác nhau
  const halfIndex = Math.ceil(movie.length / 2);
  const firstHalfMovies = movie.slice(0, halfIndex);
  const secondHalfMovies = movie.slice(halfIndex);

  return (
    <div>
      <MovieList
        title={"Most prominent in 2024"}
        data={firstHalfMovies}
        onMovieClick={handleMovieClick}
      />
      <div className="row">
        <div className="col-xl-8">
          <MovieGrid movies={secondHalfMovies} onMovieClick={handleMovieClick} />
        </div>
        <div className="col-xl-4">
          <MovieCard title={"Now watching"} movie={firstHalfMovies} onMovieClick={handleMovieClick} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Movie;
