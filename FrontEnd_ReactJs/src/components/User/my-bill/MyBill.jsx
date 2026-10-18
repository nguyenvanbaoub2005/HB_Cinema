import React from "react";
import { CheckCircleIcon } from "lucide-react";
import "./my-bill.css";

const MyBill = ({ title, bills, onBillClick, loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(bills) || bills.length === 0) {
    return <div>No bill!</div>;
  }

  // Sắp xếp bill mới nhất lên đầu (theo createdTime hoặc id giảm dần)
  const sortedBills = [...bills].sort((a, b) => {
    const timeA = a.createdTime ? new Date(a.createdTime).getTime() : 0;
    const timeB = b.createdTime ? new Date(b.createdTime).getTime() : 0;
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    return (b.id || 0) - (a.id || 0);
  });

  return (
    <div className="bill-container">
      <h2 className="bill-title">{title}</h2>
      {sortedBills.map((bill) => {
        const createdAt = bill.createdTime ? new Date(bill.createdTime) : null;
        const formattedDate = createdAt
          ? createdAt.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : "—";
        const formattedTime = createdAt
          ? createdAt.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—";

        return (
          <div
            key={bill.id}
            className="bill-receipt"
            onClick={() => onBillClick(bill.id)}
          >
            <div className="bill-receipt-id">
              <div className="bill-receipt-id-label">Ticket ID</div>
              <div className="bill-receipt-id-number">
                #{bill.id.toString().padStart(6, "0")}
              </div>
            </div>
            <div className="bill-theater-info">
              <div className="bill-theater-label">Theater</div>
              <div className="bill-theater-name">HB CINEMA</div>
            </div>
            <div className="bill-date-time-info">
              <div className="bill-date-time-container">
                <div className="bill-date-column">
                  <div className="bill-date-time-label">Date</div>
                  <div className="bill-date-time-value">{formattedDate}</div>
                </div>
                <div className="bill-time-column">
                  <div className="bill-date-time-label">Time</div>
                  <div className="bill-date-time-value">{formattedTime}</div>
                </div>
              </div>
            </div>
            <div className="bill-payment-status">
              <div className="bill-paid-status">
                <CheckCircleIcon className="bill-paid-icon" />
                Successfully
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBill;
