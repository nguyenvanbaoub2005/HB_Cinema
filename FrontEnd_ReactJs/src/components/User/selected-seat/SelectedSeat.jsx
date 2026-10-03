import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSeat, getSeatBySchedule } from "../../../api/apiSeat";
import "./selectedSeat.css";
import { createTicket } from "../../../api/apiTicket";
import BillModal from "../modal-bill/BillModal";
import Loading from "../loading/Loading";
import { goToVNPay } from "../../../api/apiVNPay";
import { useNotificationModal } from "../notificationModal/NotificationModal";
import { setBookingDataStorage } from "../../../api/dataBookingStorage";

const SelectedSeat = () => {
  const { id } = useParams();
  const [scheduleInfo, setScheduleInfo] = useState([]);
  const navigate = useNavigate();
  const [urlVNPay, setUrlVNPay] = useState([]);
  const [seats, setSeats] = useState([]);
  const [combos, setCombos] = useState([
    { name: "Popcorn Sweet - Pepsi", price: 4 },
    { name: "Popcorn Sweet - Coca", price: 4 },
    { name: "Couple Sweet - Crush", price: 6 },
  ]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [isBillModal, setIsBillModal] = useState(false);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scheduleId = id;
  const { openModal, ModalComponent } = useNotificationModal();

  useEffect(() => {
    fetchSeat();
    fetchScheduleInfo();
  }, [id]);

  const fetchSeat = async () => {
    try {
      setError(null);
      const data = await getSeat(id);
      setSeats(data.result);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchScheduleInfo = async () => {
    try {
      setError(null);
      const data = await getSeatBySchedule(id);
      console.log(data);
      setScheduleInfo(data.result[0]);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.log("noooooo");
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.booked) return;

    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };
  const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const totalPrice = useMemo(() => {
    const seatsTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const combosTotal = selectedCombos.reduce(
      (sum, combo) => sum + combo.price * combo.quantity,
      0
    );
    return seatsTotal + combosTotal;
  }, [selectedSeats, selectedCombos]);

  const getSeatClassName = (seat) => {
    const baseClasses = ["seat-button"];
    baseClasses.push(
      seat.seatType === "Couple" ? "seat-couple" : "seat-single"
    );

    if (seat.booked) {
      baseClasses.push("seat-booked");
    } else if (selectedSeats.find((s) => s.id === seat.id)) {
      baseClasses.push("seat-selected");
    } else if (seat.seatType === "Couple") {
      baseClasses.push("seat-couple");
    } else if (seat.seatType === "VIP") {
      baseClasses.push("seat-vip");
    } else {
      baseClasses.push("seat-standard");
    }

    return baseClasses.join(" ");
  };

  // Tạo dữ liệu yêu cầu đặt vé
  const generateTicketRequests = () => {
    return selectedSeats.map((seat) => ({
      name: seat.name,
      seatId: seat.id,
      scheduleId: scheduleId, // Sử dụng scheduleId ở đây
      price: seat.price,
    }));
  };

  // Tạo dữ liệu về các combo đã chọn
  const generateComboData = () => {
    return selectedCombos.map((combo) => ({
      name: combo.name,
      price: combo.price * combo.quantity,
    }));
  };

  // Xử lý đặt vé
  const handleBookTickets = async () => {
    setLoading(true);
    const ticketRequests = generateTicketRequests();
    const combosData = generateComboData();
    const bookingData = {
      ticketRequests,
      combos: combosData,
      totalPriceSeat: seatsTotal,
      totalPrice: totalPrice,
    };
    const bookingDataNew = {
      seats: ticketRequests,
      combos: combosData,
      // DateTime: scheduleInfo.
      // totalPriceSeat: seatsTotal,
      totalPrice: totalPrice,
    };

    setBookingDataStorage(bookingData);
    console.log("Dữ liệu đặt vé:", bookingData);
    try {
      setError(null);
      const dataVNPay = await goToVNPay(totalPrice * 25000);
      setUrlVNPay(dataVNPay.data.paymentUrl);
      setLoading(false);
      setSelectedSeats([]);
      setBill(bookingDataNew);
      setIsBillModal(true);
    } catch (error) {
      setError(error.message);
      openModal({ type: "error", title: "Error", message: error.message });
    } finally {
      setLoading(false);
      fetchSeat();
    }
  };

  const handleGoToVNPay = () => {
    window.open(urlVNPay, "_blank"); // Open the external link in a new tab
  };

  if (loading) {
    return <Loading text="Processing..." />;
  }

  return (
    <div className="container row seat-container">
      <ModalComponent />
      <div className="col-xl-6">
        <div className="screen">
          <div className="screen-display">Screen</div>
        </div>

        <div className="seats-grid">
          {seats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat)}
              disabled={seat.booked}
              className={getSeatClassName(seat)}
            >
              <span className="seat-name">{seat.name}</span>
              <span className="seat-price">${seat.price}</span>
            </button>
          ))}
        </div>

        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-color seat-standard"></div>
            <span>Standard Seat</span>
          </div>
          <div className="legend-item">
            <div className="legend-color seat-vip"></div>
            <span>VIP Seat</span>
          </div>
          <div className="legend-item">
            <div className="legend-color seat-couple"></div>
            <span>Couple Seat</span>
          </div>
          <div className="legend-item">
            <div className="legend-color seat-booked"></div>
            <span>Booked</span>
          </div>
          <div className="legend-item">
            <div className="legend-color seat-selected"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
      <div className="space col-xl-1"></div>
      <div className="col-xl-5">
        <div className="combo-container">
          <h3 className="font-medium mb-4">Select Combo</h3>
          <div className="combo-grid">
            {combos.map((combo, index) => (
              <div key={index} className="combo-item">
                <div className="combo-image">
                  {/* Placeholder for image */}
                  <img
                    src={`/images/combo-${index + 1}.png`}
                    alt={combo.name}
                    className="combo-img"
                  />
                </div>
                <div className="combo-info">
                  <span className="combo-name">{combo.name}</span>
                  <span className="combo-price">
                    {combo.price.toLocaleString()}$
                  </span>
                </div>
                <div className="combo-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => {
                      setSelectedCombos((prev) => {
                        const existing = prev.find(
                          (c) => c.name === combo.name
                        );
                        if (existing && existing.quantity > 0) {
                          return prev
                            .map((c) =>
                              c.name === combo.name
                                ? { ...c, quantity: c.quantity - 1 }
                                : c
                            )
                            .filter((c) => c.quantity > 0);
                        }
                        return prev;
                      });
                    }}
                  >
                    -
                  </button>
                  <span className="quantity-display">
                    {selectedCombos.find((c) => c.name === combo.name)
                      ?.quantity || 0}
                  </span>
                  <button
                    className="quantity-btn"
                    onClick={() => {
                      setSelectedCombos((prev) => {
                        const existing = prev.find(
                          (c) => c.name === combo.name
                        );
                        if (existing) {
                          return prev.map((c) =>
                            c.name === combo.name
                              ? { ...c, quantity: c.quantity + 1 }
                              : c
                          );
                        }
                        return [...prev, { ...combo, quantity: 1 }];
                      });
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="summary-container">
          <div className="summary-content">
            <div>
              <h3 className="font-medium">Selected Seat:</h3>
              <p className="text-sm">
                {selectedSeats.length > 0
                  ? selectedSeats.map((seat) => seat.name).join(", ")
                  : "Not selected seat"}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">Total Price:</p>
              <p className="text-lg font-bold">${totalPrice}</p>
            </div>
          </div>
          <button
            className="book-button"
            disabled={selectedSeats.length === 0}
            onClick={handleBookTickets}
          >
            Book Tickets
          </button>
        </div>
      </div>
      {isBillModal && (
        <BillModal
          bill={bill} // Truyền dữ liệu hóa đơn
          title={"Payment Details"}
          btn={"Pay with VNPay"}
          onClose={() => setIsBillModal(false)}
          goVNPay={handleGoToVNPay} // Đóng modal khi bấm nút Đóng
        />
      )}
    </div>
  );
};

export default SelectedSeat;
