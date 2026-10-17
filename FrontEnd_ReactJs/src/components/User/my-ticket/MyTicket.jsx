import React from "react";
import "./my-ticket.css";
import { useNavigate, useParams } from "react-router-dom";

const Ticket = ({ ticket, loading }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="ticket-list" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        <p>Đang tải chi tiết vé...</p>
      </div>
    );
  }

  if (!Array.isArray(ticket) || ticket.length === 0) {
    return (
      <div className="ticket-list" style={{ padding: "40px 20px", textAlign: "center", color: "#666" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
          Không tìm thấy vé cho đơn hàng #{id}
        </h3>
        <p style={{ fontSize: "14px", color: "#888", marginBottom: "20px" }}>
          Đơn hàng này chưa có vé được chốt hoặc đã phát sinh lỗi khi xác nhận thanh toán.
        </p>
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "8px 20px",
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Quay lại danh sách hóa đơn
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      <div style={{ marginBottom: "16px" }}>
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "6px 14px",
            backgroundColor: "#f3f4f6",
            color: "#374151",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ← Quay lại danh sách hóa đơn
        </button>
      </div>
      {ticket.map((t, index) => {
        const { qrImageURL, seatName, scheduleDetails = {} } = t;

        const {
          startDateTime,
          movie = {},
          branch = {},
          room = {},
        } = scheduleDetails;

        const formattedDate = startDateTime
          ? new Date(startDateTime).toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "N/A";

        const formattedTime = startDateTime
          ? new Date(startDateTime).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A";

        return (
          <div key={t.id || index} className="ticket-container">
            <div className="ticket-left">
              <p className="movie-ticket-info">{formattedDate}</p>
              <p className="movie-ticket-info">
                Time: <strong>{formattedTime}</strong>
              </p>
              <p className="movie-ticket-info">
                Seat: <strong>{seatName}</strong>
              </p>
              <p className="movie-ticket-info">
                Room: <strong>{room?.name || "N/A"}</strong> | Branch:{" "}
                <strong>{branch?.name || "N/A"}</strong>
              </p>
            </div>
            <div className="ticket-right">
              <h2 className="movie-ticket-title">{movie?.title || "Vé xem phim"}</h2>
              {qrImageURL ? (
                <img
                  src={qrImageURL}
                  alt={`QR Code for ticket ${t.id || index}`}
                  className="qr-code"
                />
              ) : (
                <div style={{ fontSize: "12px", color: "#888" }}>Chưa có mã QR</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Ticket;
