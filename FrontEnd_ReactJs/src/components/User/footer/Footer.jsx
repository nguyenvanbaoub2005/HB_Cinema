
import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Brand + Contact */}
        <div className="footer-section about">
          <div className="footer-brand">
            <span className="brand-hb">HB</span>
            <span className="brand-cinema">Cinema</span>
          </div>
          <p className="footer-tagline">
            Your premium destination for movies, live events, and unforgettable cinematic experiences.
          </p>
          <div className="footer-contact-item">
            <span className="contact-icon">📍</span>
            <span>No. 8 Hoang Van Thai, Son Tra, Da Nang City</span>
          </div>
          <div className="footer-contact-item">
            <span className="contact-icon">📞</span>
            <span>1900 00900 876 (1,000 VND/min)</span>
          </div>
          <div className="footer-contact-item">
            <span className="contact-icon">✉️</span>
            <span>support@hbcinema.vn</span>
          </div>
          <div className="footer-contact-item">
            <span className="contact-icon">🕐</span>
            <span>8:00 AM – 10:00 PM daily</span>
          </div>
        </div>

        {/* Browse */}
        <div className="footer-section quick-links">
          <h3>Browse</h3>
          <ul>
            <li><a href="#">Now Showing</a></li>
            <li><a href="#">Coming Soon</a></li>
            <li><a href="#">Top Rated</a></li>
            <li><a href="#">Promotions</a></li>
            <li><a href="#">Events</a></li>
          </ul>
        </div>

        {/* Help */}
        <div className="footer-section policies">
          <h3>Help</h3>
          <ul>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Refund Policy</a></li>
            <li><a href="#">Accessibility</a></li>
            <li><a href="#">Account & Billing</a></li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-section social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-link">
              <FaFacebook className="social-icon" />
              <span>Facebook</span>
            </a>
            <a href="#" className="social-link">
              <FaInstagram className="social-icon" />
              <span>Instagram</span>
            </a>
            <a href="#" className="social-link">
              <FaTwitter className="social-icon" />
              <span>Twitter / X</span>
            </a>
            <a href="#" className="social-link">
              <FaYoutube className="social-icon" />
              <span>YouTube</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2025 HBCinema. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
