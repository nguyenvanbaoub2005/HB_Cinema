import { useState } from "react";
import './modal.css';

const ChangePassword = ({ title, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",

    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // Kiểm tra xác nhận mật khẩu
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New password and confirm password must match.");
            return;
        }
        // Nếu không có lỗi, gọi onSave để thay đổi mật khẩu
        onSave(formData);
        console.log(formData)
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container-seat">
                <h2 className="modal-header">{title}</h2>
                <div className="grid-cols-1">
                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current Password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="input-field"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="modal-actions">
                    <button className="button-base button-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="button-base button-save"
                        onClick={handleSubmit} // Gọi handleSubmit khi nhấn Save
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
