import { requestPrivate } from "./request";

//Lấy bill của 1 user bằng token
export const getMyBill = async () => {
  try {
    const reponse = await requestPrivate.get("/bills/my-bills");
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get My Bill");
  }
};

export const getAllBill = async () => {
  try {
    const reponse = await requestPrivate.get("/bills");
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get All Bill");
  }
};

export const getBillById = async (id) => {
  try {
    const reponse = await requestPrivate.get(`/bills/user/${id}`);
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get user Bill");
  }
};
