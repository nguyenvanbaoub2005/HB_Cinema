import { useEffect, useState } from "react";
import './profile.css';

const Profile = ({ title, profile, onSave, onChangePass }) => {
  const [formData, setFormData] = useState(profile);

  // Đồng bộ formData với profile khi profile thay đổi
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <h2 className="profile-header">{title}</h2>
        <div className="profile-input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username || ""}
            onChange={handleChange}
            className="profile-input"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob || ""}
            onChange={handleChange}
            className="profile-input"
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName || ""}
            onChange={handleChange}
            className="profile-input"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName || ""}
            onChange={handleChange}
            className="profile-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={handleChange}
            className="profile-input"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            className="profile-input"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address || ""}
            onChange={handleChange}
            className="profile-input  profile-input-full"
          />
        </div>
        <div className="profile-actions">
          <button
            className="profile-button profile-button-save"
            onClick={() => onSave(formData)}
          >
            Save changes
          </button>
          <button
            className="profile-button profile-button-cancel"
            onClick={onChangePass}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
