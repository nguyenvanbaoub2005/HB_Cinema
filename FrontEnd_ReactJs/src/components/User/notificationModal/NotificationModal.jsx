import React, { useState } from 'react';
import { X } from 'lucide-react';

// Các màu sắc tương ứng với từng loại thông báo
const typeStyles = {
  success: {
    background: 'bg-green-50',
    border: 'border-green-500',
    icon: 'text-green-500',
    title: 'text-green-800',
    message: 'text-green-700',
  },
  error: {
    background: 'bg-red-50',
    border: 'border-red-500',
    icon: 'text-red-500',
    title: 'text-red-800',
    message: 'text-red-700',
  },
  warning: {
    background: 'bg-yellow-50',
    border: 'border-yellow-500',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
  },
  info: {
    background: 'bg-blue-50',
    border: 'border-blue-500',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-700',
  },
};

const NotificationModal = ({ isOpen, onClose, type = 'info', title, message }) => {
  // Nếu modal không được mở, không render gì cả
  if (!isOpen) return null;

  // Lấy styles dựa trên loại thông báo
  const styles = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-96 p-6 rounded-lg border-l-4 ${styles.background} ${styles.border} shadow-lg transform transition-all duration-300 ease-in-out`}
      >
        {/* Nút đóng */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        {/* Tiêu đề */}
        <h2 className={`text-xl font-semibold mb-2 ${styles.title}`}>{title}</h2>

        {/* Nội dung thông báo */}
        <p className={`text-base ${styles.message}`}>{message}</p>
      </div>
    </div>
  );
};

// Hook để quản lý trạng thái modal
export const useNotificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    type: 'info',
    title: '',
    message: '',
  });

  const openModal = (props) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const ModalComponent = () => (
    <NotificationModal isOpen={isOpen} onClose={closeModal} {...modalProps} />
  );

  return { openModal, closeModal, ModalComponent };
};

export default NotificationModal;
