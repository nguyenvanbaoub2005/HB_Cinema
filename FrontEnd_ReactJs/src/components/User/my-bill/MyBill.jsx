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

  return (
    <div className="bill-container">
      <h2 className="bill-title">{title}</h2>
      {bills.map((bill) => {
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
