import React, { useContext } from "react";
import PropTypes from "prop-types";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./movielist.css";
import { FaStar } from "react-icons/fa";
import { MovieContext } from "../../../context/MovieProvider";
import { NavLink } from "react-router-dom";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 10,
  },
  desktopMax: {
    breakpoint: { max: 3000, min: 1250 },
    items: 6,
  },
  desktopMid: {
    breakpoint: { max: 1250, min: 1200 },
    items: 5,
  },
  desktopMin: {
    breakpoint: { max: 1200, min: 980 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 980, min: 765 },
    items: 3,
  },
  tabletMin: {
    breakpoint: { max: 765, min: 560 },
    items: 2,
  },
  mobileMin: {
    breakpoint: { max: 560, min: 0 },
    items: 2,
  },
};

const MovieList = ({ title, data, onMovieClick }) => {
  const { handleTrailer } = useContext(MovieContext);

  return (
    <div className="movie-list-section">
      <div className="section-header">
        <h2 className="title">
          {title}
          {data && <span className="title-count">{data.length}</span>}
        </h2>
        <NavLink to="/movie" className="see-all-btn">
          See All →
        </NavLink>
      </div>
      <Carousel
        responsive={responsive}
        className="carousel"
        infinite={false}
        removeArrowOnDeviceType={["mobileMin"]}
      >
        {data &&
          data.length > 0 &&
          data.map((movie) => (
            <div key={movie.id} className="card">
              <div
                className="card-image-wrapper"
                onClick={() => handleTrailer(movie.trailer)}
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="card-image"
                  loading="lazy"
                />
                <div className="card-play-overlay">
                  <div className="card-play-icon">▶</div>
                </div>
                <div className="card-rating-badge">
                  <FaStar size={10} />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              </div>
              <div
                className="card-title"
                onClick={() => onMovieClick(movie.id)}
              >
                <p className="card-name">{movie.title}</p>
                <div className="rating">
                  <FaStar size={11} />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
      </Carousel>
    </div>
  );
};

MovieList.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
  onMovieClick: PropTypes.func.isRequired,
};
export default MovieList;
