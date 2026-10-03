import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../../../api/apiMovie";
import {
  FaStar,
  FaLanguage,
  FaCalendarAlt,
  FaClock,
  FaPlayCircle,
} from "react-icons/fa";
import "./moviedetail.css";
import poster from "../../../assets/images/poster.png";
import YouTubeModal from "../youtube-modal/YouTubeModal";
import { MovieContext } from "../../../context/MovieProvider";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState(""); // State để lưu URL video

  const { handleTrailer } = useContext(MovieContext);


  const handleOpenModal = (url) => {
    setVideoUrl(url); // Cập nhật videoUrl khi mở modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  // Nếu không có id từ URL, tạo ID ngẫu nhiên
  const movieId = id || Math.floor(Math.random() * 10); // Giả sử có 1000 phim để random
  useEffect(() => {
    fetchMovieDetail();
  }, [movieId]);

  const fetchMovieDetail = async () => {
    try {
      const data = await getMovieById(movieId);
      setMovie(data.result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!movie) {
    return <div className="error-message">Movie information not found.</div>;
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-wrapper">
        <div className="movie-detail-image">
          <img className="movie-poster" src={movie.image} alt={movie.title} />
        </div>
        <div className="movie-detail-content">
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-info-grid">
            <div className="movie-info-item">
              <FaCalendarAlt className="movie-info-icon" />
              <span>
                Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
              </span>
            </div>
            <div className="movie-info-item">
              <FaLanguage className="movie-info-icon" />
              <span>Language: {movie.language}</span>
            </div>
            <div className="movie-info-item">
              <FaStar className="movie-info-icon" />
              <span className="movie-rating">{movie.rating}</span>
            </div>
            <div className="movie-info-item">
              <FaClock className="movie-info-icon" />
              <span>Duration: {movie.duration} mins</span>
            </div>
          </div>
          <div className="movie-overview">
            <h2 className="overview-title">Overview</h2>
            <p>{movie.overView}</p>
          </div>
          <div className="movie-actions">
            <button onClick={() => handleTrailer(movie.trailer)}
              href={movie.trailer}
              className="trailer-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaPlayCircle className="trailer-icon" />
              Watch Trailer
            </button>
          </div>
        </div>
        <div className="movie-advertisement">
          <img
            src={poster}
            alt="advertisement"
            className="advertisement-image"
          />
          <h3 className="ad-title">30% Off Movie Tickets This Week!</h3>
        </div>
      </div>
      <YouTubeModal
        videoUrl={videoUrl}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MovieDetail;
