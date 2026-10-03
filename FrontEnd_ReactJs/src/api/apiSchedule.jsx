import { request, requestPrivate } from "./request";

//Lấy lịch chiếu của 1 phim
export const getMovieSchedule = async (id) => {
  try {
    const reponse = await request.get(`/schedule/movies/${id}`);
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to get schedule by movie"
    );
  }
};

//Lấy tất cả lịch chiếu
export const getAllSchedule = async () => {
  try {
    const reponse = await requestPrivate.get("/schedule");
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to get all schedule"
    );
  }
};

//Thêm lịch chiếu 
export const addSchedule = async (schedule) => {
  try {
    const response = await requestPrivate.post(`/schedule`, schedule);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add schedule");
  }
};

//Sửa lịch chiếu 
export const updateSchedule = async (id, schedule) => {
  try {
    await requestPrivate.put(`/schedule/${id}`, schedule);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update schedule");
  }
}

//Xóa lịch chiếu
export const deleteSchedule = async (id) => {
  try {
    await requestPrivate.delete(`/schedule/${id}`);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete schedule");
  }
}

//Thêm lịch chiếu theo phim
export const addScheduleByMovie = async (id, schedule) => {
  try {
    const response = await requestPrivate.post(
      `/schedule/movies/${id}`,
      schedule
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add schedule");
  }
};
