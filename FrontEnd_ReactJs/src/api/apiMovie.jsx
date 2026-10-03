import { request, requestPrivate } from "./request";

// Lấy danh dách tất cả phim
export const getAllMovie = async () => {
  try {
    const response = await request.get("/movies");
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get all movie");
  }
};

// Lấy thông tin chi tiết phim
export const getMovieById = async (id) => {
  try {
    const reponse = await request.get(`/movies/${id}`);
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to get details movie"
    );
  }
};

// Thêm phim mới
export const addMovie = async (movie) => {
  try {
    const reponse = await requestPrivate.post("/movies", movie);
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add movie");
  }
};

// Cập nhật thông tin phim
export const updateMovie = async (id, movie) => {
  try {
    const reponse = await requestPrivate.put(`/movies/${id}`, movie);
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update movie");
  }
}

// Xoá phim
export const deleteMovie =async (id) => {
  try {
    await requestPrivate.delete(`/movies/${id}`);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete movie");
  }
}