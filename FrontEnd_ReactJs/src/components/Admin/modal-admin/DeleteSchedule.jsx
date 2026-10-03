import React from 'react';
import './modal.css';

const DeleteSchedule = ({ isOpen, onClose, schedule, onDeleteSchedule }) => {
    if (!isOpen || !schedule) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
            <h2 className="modal-header">Delete Schedule</h2>
                <p className="text-center mb-4">Are you sure you want to delete this schedule?</p>
                <div className="modal-actions">
                    
                    <button 
                        className="button-base button-cancel" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="button-base button-delete" 
                        onClick={onDeleteSchedule}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSchedule;