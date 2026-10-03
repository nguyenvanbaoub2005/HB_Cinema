import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/User/banner/Banner";
import MovieList from "../../components/User/movie-list/MovieList";
import Footer from "../../components/User/footer/Footer";
import { getAllMovie } from "../../api/apiMovie";
import Blog from "../../components/User/blog/Blog";
import Loading from "../../components/User/loading/Loading";

const Home = () => {
  const [movie, setMovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllMovie();
  }, []);

  const fetchAllMovie = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const data = await getAllMovie();
      const movie = data.result;
      setMovie(movie);
    } catch (error) {
      console.log(error);
      setError(error); // Lưu lỗi
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
        An error occurred while loading the movie.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Banner />
      </div>
      <div>
        <MovieList
          title={"Now Showing"}
          data={movie}
          onMovieClick={handleMovieClick}
        />
      </div>
      <Blog />
      <Footer />
    </div>
  );
};

export default Home;
