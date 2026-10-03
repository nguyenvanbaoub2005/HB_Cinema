import React, { useContext } from "react";
import './banner.css'
import IconRating from "../../../assets/images/rating.png";
import IconRatingHalf from "../../../assets/images/rating-half.png";
import ImgTemp from "../../../assets/images/venom.png";
import Iconplay from "../../../assets/images/play-button.png";
import { NavLink } from "react-router-dom";
import { MovieContext } from "../../../context/MovieProvider";

const Banner = () => {
  const { handleTrailer } = useContext(MovieContext);
  return (
    <div className="banner">
      <div className="banner-overlay" />
      <div className="banner-content">
        <div className="banner-text-section">
          <div>
            <div className="banner-badge">Now Showing</div>
            <h1 className="banner-title">
              Venom: <span>The Last Dance</span>
            </h1>
            <div className="banner-meta">
              <span className="banner-meta-item">⏱ 139 min</span>
              <span className="banner-meta-item">🎬 Action</span>
              <span className="banner-meta-item">🌐 English</span>
            </div>
            <div className="banner-ratings">
              <img src={IconRating} alt="rating" />
              <img src={IconRating} alt="rating" />
              <img src={IconRating} alt="rating" />
              <img src={IconRating} alt="rating" />
              <img src={IconRatingHalf} alt="rating" />
            </div>
            <p className="banner-description">
              Eddie and Venom are caught in a multi-web in the follow-up to 2021's Venom: Let There Be Carnage. The God of Symbiotes, Knull, seeks a mysterious artefact called Codex (which Venom holds) to destroy the universe.
            </p>
            <div className="banner-buttons">
              <NavLink to="/movies/2">
                <button className="button-details">ℹ Details</button>
              </NavLink>
              <NavLink to="/movies/2">
                <button className="button-buy">🎟 Get Ticket</button>
              </NavLink>
            </div>
          </div>
        </div>
        <div className="banner-image-section" onClick={() => handleTrailer(912649)}>
          <div className="banner-image-container">
            <img src={ImgTemp} alt="Venom: The Last Dance" className="banner-image" />
            <div className="banner-image-overlay">
              <img src={Iconplay} alt="play" className="play-icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="banner-scroll-hint">Scroll</div>
    </div>
  );
};

export default Banner;
