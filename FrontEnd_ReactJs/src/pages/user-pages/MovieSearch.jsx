import React, { useEffect, useState } from "react";
import Footer from "../../components/User/footer/Footer";
import MovieCard from "../../components/User/movie-card/MovieCard";
import { getAllMovie } from "../../api/apiMovie";
import MovieGrid from "../../components/User/movie-grid/MovieGrid";
import MovieList from "../../components/User/movie-list/MovieList";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/User/loading/Loading";


const MovieSearch = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm state loading
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    fetchAllMovie();
  }, []);

  useEffect(() => {
    if (query) {
      // Lọc phim theo query
      const results = movie.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(results);
    } else {
      setFilteredMovies(movie); // Nếu không có query, hiển thị tất cả phim
    }
  }, [query, movie]);

  const fetchAllMovie = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const data = await getAllMovie();
      setMovie(data.result);
      setFilteredMovies(data.result); // Set phim ban đầu
      console.log(data.result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleMovieClick = (id) => {
    navigate(`/movies/${id}`);
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return <Loading fullScreen={true} text="Loading movie..." />;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        An error occurred: {error}
      </div>
    );
  }

  // Hiển thị thông báo nếu không có phim
  if (filteredMovies.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No movies found
      </div>
    );
  }

  return (
    <div>
      <MovieList
        title={"Search results"}
        data={filteredMovies}
        onMovieClick={handleMovieClick}
      />
      <div className="row">
        <div className="col-xl-8">
          <MovieGrid movies={filteredMovies} />
        </div>
        <div className="col-xl-4">
          <MovieCard title={"Now watching"} movie={filteredMovies} />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MovieSearch;