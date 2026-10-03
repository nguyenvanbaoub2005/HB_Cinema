import React, { useState } from "react";
import "./modal.css";

const AddScheduleByMovie = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    roomId: "",
    branchId: "",
    startDateTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Add New Schedule For Movie</h2>
        <div className="grid-cols-2">
          <input
            type="text"
            name="roomId"
            placeholder="Room"
            value={formData.roomId}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="branchId"
            placeholder="Branch"
            value={formData.branchId}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="datetime-local"
            name="startDateTime"
            placeholder="Start Date"
            value={formData.startDateTime}
            onChange={handleChange}
            className="input-field col-span-2"
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

export default AddScheduleByMovie;
