import { request, requestPrivate } from "./request";
import { withCache, invalidateCache } from "./cache";

const CACHE_KEYS = {
  ALL_MOVIES: "movies:all",
  MOVIE_BY_ID: (id) => `movies:${id}`,
};

// Lấy danh sách tất cả phim - cache 2 phút
export const getAllMovie = async () => {
  return withCache(CACHE_KEYS.ALL_MOVIES, async () => {
    const response = await request.get("/movies");
    return response.data;
  }, 2 * 60 * 1000); // 2 phút
};

// Lấy thông tin chi tiết phim - cache 5 phút
export const getMovieById = async (id) => {
  return withCache(CACHE_KEYS.MOVIE_BY_ID(id), async () => {
    const response = await request.get(`/movies/${id}`);
    return response.data;
  }, 5 * 60 * 1000); // 5 phút
};

// Thêm phim mới - xóa cache sau khi thêm
export const addMovie = async (movie) => {
  try {
    const response = await requestPrivate.post("/movies", movie);
    invalidateCache(CACHE_KEYS.ALL_MOVIES);
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add movie");
  }
};

// Cập nhật thông tin phim - xóa cache sau khi sửa
export const updateMovie = async (id, movie) => {
  try {
    const response = await requestPrivate.put(`/movies/${id}`, movie);
    invalidateCache(CACHE_KEYS.ALL_MOVIES);
    invalidateCache(CACHE_KEYS.MOVIE_BY_ID(id));
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update movie");
  }
};

// Xóa phim - xóa cache sau khi xóa
export const deleteMovie = async (id) => {
  try {
    await requestPrivate.delete(`/movies/${id}`);
    invalidateCache(CACHE_KEYS.ALL_MOVIES);
    invalidateCache(CACHE_KEYS.MOVIE_BY_ID(id));
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete movie");
  }
};