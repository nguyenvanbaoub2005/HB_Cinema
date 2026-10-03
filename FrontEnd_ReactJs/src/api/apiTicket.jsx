import { requestPrivate } from "./request";

//Lấy tất cả vé
export const getAllTicket = async () => {
  try {
    const reponse = await requestPrivate.get(`/tickets`);
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to get ticket");
  }
};


// Tạo vé mới(người dùng nhấn nút mua)
export const createTicket = async (ticket) => {
  try {
    console.log("Request create ticket", ticket);
    const reponse = await requestPrivate.post("/tickets", ticket);
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create ticket");
  }
};

// Lấy thông tin vé theo id bill
export const getTicketByBill = async (id) => {
  try {
    const reponse = await requestPrivate.get(`/tickets/bill/${id}`);
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create ticket");
  }
};
