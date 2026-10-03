import { useState } from "react";
import './modal.css';

const EditSeat = ({ title, seat, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: seat?.name || "",
    price: seat?.price || "",
    seatType: seat?.seatType || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log("Updated formData:", formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container-seat">
        <h2 className="modal-header">{title}</h2>
        <div className="grid-cols-1">
          <input
            type="text"
            name="name"
            placeholder="Seat Name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="price"
            placeholder="Price Seat"
            value={formData.price}
            onChange={handleChange}
            className="input-field"
          />
           <select
            name="seatType"
            value={formData.seatType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Standard">Standard</option>
            <option value="VIP">VIP</option>
            <option value="Couple">Couple</option>
          </select>
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

export default EditSeat;
