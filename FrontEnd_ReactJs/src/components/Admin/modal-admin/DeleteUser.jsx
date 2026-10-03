import './modal.css';

const DeleteUser = ({ onClose, onConfirm }) => (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2 className="modal-header">Delete User</h2>
      <p className="text-center mb-4">Are you sure you want to delete this user?</p>
      <div className="modal-actions">
        <button className="button-base button-cancel" onClick={onClose}>
          Cancel
        </button>
        <button
          className="button-base button-delete"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteUser;