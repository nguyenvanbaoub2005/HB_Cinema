import React, { useState } from "react";
import './modal.css';

const AddMovie = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    releaseDate: "",
    duration: "",
    overView: "",
    rating: "",
    trailer: "",
    language: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container movie-modal">
        <h2 className="modal-header">Add New Movie</h2>
        <div className="grid-cols-2 movie-modal-grid">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="input-field col-span-2"
          />
          <textarea
            name="overView"
            placeholder="Overview"
            value={formData.overView}
            onChange={handleChange}
            className="input-field movie-modal-textarea"
          />
          <input
            type="text"
            name="language"
            placeholder="Language"
            value={formData.language}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="datetime-local"
            name="releaseDate"
            placeholder="Release Date"
            value={formData.releaseDate}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="trailer"
            placeholder="Trailer URL"
            value={formData.trailer}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="modal-actions">
          <button className="button-base button-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button-base button-save"
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;