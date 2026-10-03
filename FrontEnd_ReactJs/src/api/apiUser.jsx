import { requestPrivate } from "./request"; // Sử dụng request với Interceptor đã cấu hình

// Lấy thông tin người dùng hiện tại
export const getMyInfo = async () => {
  try {
    const response = await requestPrivate.get("/users/myInfo");
    return response.data;
  } catch (error) {
    console.error("Error fetching my info:", error);
    throw error;
  }
};

// Lấy danh sách tất cả người dùng
export const getAllUser = async () => {
  try {
    const response = await requestPrivate.get("/users");
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get Users");
  }
};

// Thêm người dùng mới
export const addUser = async (user) => {
  try {
    const response = await requestPrivate.post("/users", user);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add user");
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (id, user) => {
  try {
    const response = await requestPrivate.put(`/users/${id}`, user);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// Xóa người dùng
export const deleteUser = async (id) => {
  try {
    await requestPrivate.delete(`/users/${id}`);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

// đổi mật khẩu
export const changePassword = async (id, newPassword) => {
  try {
    const response = await requestPrivate.put(`/users/${id}/change-password`, newPassword);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to change pass");
  }
};