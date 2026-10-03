// Khai báo khóa trong localStorage dưới dạng chuỗi
const bookingDataKey = 'bookingData'; // Sử dụng một chuỗi làm khóa

export const setBookingDataStorage = (data) => {
    // Chuyển đổi đối tượng dữ liệu thành chuỗi JSON trước khi lưu
    localStorage.setItem(bookingDataKey, JSON.stringify(data));
};

export const getBookingDataStorage = () => {
    // Lấy dữ liệu từ localStorage và chuyển đổi từ chuỗi JSON thành đối tượng
    const data = localStorage.getItem(bookingDataKey);
    return data ? JSON.parse(data) : null; // Nếu không có dữ liệu, trả về null
};

export const removeBookingDataStorage = () => {
    // Xóa dữ liệu khỏi localStorage
    localStorage.removeItem(bookingDataKey);
};
