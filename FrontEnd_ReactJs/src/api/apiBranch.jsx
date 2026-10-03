import { request } from "./request";

export const getAllBranch = async () => {
  try {
    const response = await request.get("/branch");
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add schedule");
  }
};
