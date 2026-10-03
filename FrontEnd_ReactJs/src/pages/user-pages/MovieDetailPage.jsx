import React, { useEffect, useState } from "react";
import Footer from "../../components/User/footer/Footer";
import MovieSchedule from "../../components/User/movie-schedule/MovieSchedule";
import MovieDetail from "../../components/User/movie-details/MovieDetail";
import MovieCard from "../../components/User/movie-card/MovieCard";
import { getAllMovie } from "../../api/apiMovie";
import Blog from "../../components/User/blog/Blog";
import Loading from "../../components/User/loading/Loading";
import { useNavigate } from "react-router-dom";


const MovieDetailPage = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Thêm state loading

  useEffect(() => {
    fetchAllMovie();
  }, []);

  const fetchAllMovie = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const data = await getAllMovie();
      setMovie(data.result);
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

  // Nếu đang loading, hiển thị Loading
  if (loading) {
    return <Loading fullScreen={true} text="Loading movie..." />;
  }

  // Nếu xảy ra lỗi, hiển thị thông báo lỗi
  if (error) {
    return <div className="text-center text-red-500">An error occurred: {error}</div>;
  }

  return (
    <div>
      <MovieDetail />
      <div className="row">
        <div className="col-xl-8">
          <MovieSchedule />
          <Blog />
        </div>
        <div className="col-xl-4">
          <MovieCard movie={movie} onMovieClick={handleMovieClick} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetailPage;
