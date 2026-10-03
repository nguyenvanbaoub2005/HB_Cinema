import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./header.css";
import { NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../../../api/localStorage";

const Header = ({ data, onLogout }) => {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-avatar-wrapper")) {
        setShowUserInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserInfo = () => setShowUserInfo((prev) => !prev);
  const avatar = data?.username ? data.username.charAt(0).toUpperCase() : "";

  const handleLogin = () => {
    removeToken();
    navigate("/login");
  };

  const handleLogout = () => {
    removeToken();
    setShowUserInfo(false);
    onLogout();
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    setShowUserInfo(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className={`header ${scrolled ? "scrolled" : ""}`}>
        <NavLink to="/" className="logo">
          <span className="logo-hb">HB</span>
          <span className="logo-cinema">Cinema</span>
        </NavLink>

        <input type="checkbox" id="check" />
        <label htmlFor="check" className="icon">
          <i className="bx bx-menu" id="menu-icon"></i>
          <i className="bx bx-x" id="close-icon"></i>
        </label>

        <nav className="navbar">
          <ul className="menu">
            <NavLink to="/" style={{ "--i": 0 }}>Home</NavLink>
            <NavLink to="/movie" style={{ "--i": 1 }}>Movie</NavLink>
            <NavLink to="/toprate" style={{ "--i": 2 }}>Top Rate</NavLink>
          </ul>
        </nav>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search__input"
            />
            <button type="submit" className="search-button">
              <i className="bx bx-search"></i>
            </button>
          </form>
        </div>

        {/* User Section */}
        <div className="user-section">
          {data ? (
            <div className="user-avatar-wrapper">
              <button className="user-avatar" onClick={toggleUserInfo} id="user-avatar-btn">
                {avatar}
              </button>

              {showUserInfo && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="username">{data.username}</p>
                    <p className="email">{data.email || data.phoneNumber}</p>
                  </div>
                  <button className="dropdown-item" onClick={handleProfile}>
                    <i className="bx bx-user"></i>
                    Profile
                  </button>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <i className="bx bx-log-out"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login__btn" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>
      </div>
    </>
  );
};

Header.propTypes = {
  data: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
};

export default Header;