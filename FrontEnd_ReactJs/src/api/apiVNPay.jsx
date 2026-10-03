import { requestPrivate } from "./request";

// Chuyển đến trang VNPay
export const goToVNPay = async (amount) => {
  try {
    const reponse = await requestPrivate.get(
      `/payment/vn-pay?amount=${amount}&bankcode=NCB`
    );
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to go VNPay");
  }
};

// gọi lại sau khi thanh toán thành công
export const verifyPayment = async (query) => {
  try {
    const reponse = await requestPrivate.get(
      `/payment/vn-pay-callback?${query}`
    );
    return reponse.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to PayMent");
  }
};

