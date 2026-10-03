import PropTypes from "prop-types";
import "./loading.css";

const Loading = ({
  size = "medium",
  text = "Đang tải...",
  className = "",
  fullScreen = false,
}) => {
  return (
    <div className={`loading-wrapper ${fullScreen ? "loading-fullscreen" : ""} ${className}`}>
      <div className="loading-inner">
        <div className="loading-cinema">
          <div className="loading-ring"></div>
          <div className="loading-ring loading-ring--2"></div>
          <div className="loading-film">🎬</div>
        </div>
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  text: PropTypes.string,
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default Loading;