import React from "react";
import { FaTimes } from "react-icons/fa";

const YouTubeModal = ({ videoUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-4 rounded-lg w-4/5 sm:w-3/4 lg:w-1/2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-2xl"
        >
          <FaTimes />
        </button>
        <div className="relative w-full" style={{ height: "65vh" }}>
          <iframe
            width="100%"
            height="100%"
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};
 
export default YouTubeModal