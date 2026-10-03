import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getSeat, getSeatBySchedule } from "../../../api/apiSeat";
import { createTicket } from "../../../api/apiTicket";
import { goToVNPay } from "../../../api/apiVNPay";
import { getBookingDataStorage, setBookingDataStorage } from "../../../api/dataBookingStorage";
import "./selected-seat-sell.css";
import { useNotificationModal } from "../../User/notificationModal/NotificationModal";
import Loading from "../../User/loading/Loading";
import BillModal from "../../User/modal-bill/BillModal";


const SelectedSeatSell = () => {
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
      console.log(data)
      setScheduleInfo(data.result[0]);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.log("noooooo")
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
    const baseClasses = ["sell-seat-button"];
    baseClasses.push(
      seat.seatType === "Couple" ? "sell-seat-couple" : "sell-seat-single"
    );

    if (seat.booked) {
      baseClasses.push("sell-seat-booked");
    } else if (selectedSeats.find((s) => s.id === seat.id)) {
      baseClasses.push("sell-seat-selected");
    } else if (seat.seatType === "Couple") {
      baseClasses.push("sell-seat-couple");
    } else if (seat.seatType === "VIP") {
      baseClasses.push("sell-seat-vip");
    } else {
      baseClasses.push("sell-seat-standard");
    }

    return baseClasses.join(" ");
  };

  // Tạo dữ liệu yêu cầu đặt vé
  const generateTicketRequests = () => {
    return selectedSeats.map((seat) => ({
      name: seat.name,
      seatId: seat.id,
      scheduleId: scheduleId, // Sử dụng scheduleId ở đây
      price: seat.price
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

  const handleCreateTicket = () => {
        try {
          setError(null);
          const dataBooking = getBookingDataStorage();
          const data = createTicket(dataBooking);
          setLoading(false);
          setIsBillModal(false)
          openModal({ type: "success", title: "Successfully", message: "Ticket created successfully, please print ticket for customer" });
        } catch (error) {
          setIsBillModal(false)
          setError(error.message);
          openModal({ type: "error", title: "Error", message: error.message });
        } finally {
          setLoading(false);
          fetchSeat();
        }
  };

  if (loading) {
    return <Loading text="Processing..." />;
  }

  return (
    <div className="sell-container row seat-container">
      <ModalComponent />
      <div className="sell-col-xl-6">
        <div className="sell-screen">
          <div className="sell-screen-display">Screen</div>
        </div>

        <div className="sell-seats-grid">
          {seats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => handleSeatClick(seat)}
              disabled={seat.booked}
              className={getSeatClassName(seat)}
            >
              <span className="sell-seat-name">{seat.name}</span>
              <span className="sell-seat-price">${seat.price}</span>
            </button>
          ))}
        </div>

        <div className="sell-seat-legend">
          <div className="sell-legend-item">
            <div className="sell-legend-color seat-standard"></div>
            <span>Standard Seat</span>
          </div>
          <div className="sell-legend-item">
            <div className="sell-legend-color seat-vip"></div>
            <span>VIP Seat</span>
          </div>
          <div className="sell-legend-item">
            <div className="sell-legend-color seat-couple"></div>
            <span>Couple Seat</span>
          </div>
          <div className="sell-legend-item">
            <div className="sell-legend-color seat-booked"></div>
            <span>Booked</span>
          </div>
          <div className="sell-legend-item">
            <div className="sell-legend-color seat-selected"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
      <div className="sell-space col-xl-1"></div>
      <div className="sell-col-xl-5">
        <div className="sell-combo-container">
          <h3 className="sell-font-medium mb-4">Select Combo</h3>
          <div className="sell-combo-grid">
            {combos.map((combo, index) => (
              <div key={index} className="sell-combo-item">
                <div className="sell-combo-image">
                  {/* Placeholder for image */}
                  <img
                    src={`/images/combo-${index + 1}.png`}
                    alt={combo.name}
                    className="sell-combo-img"
                  />
                </div>
                <div className="sell-combo-info">
                  <span className="sell-combo-name">{combo.name}</span>
                  <span className="sell-combo-price">
                    {combo.price.toLocaleString()}$
                  </span>
                </div>
                <div className="sell-combo-controls">
                  <button
                    className="sell-quantity-btn"
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
                  <span className="sell-quantity-display">
                    {selectedCombos.find((c) => c.name === combo.name)
                      ?.quantity || 0}
                  </span>
                  <button
                    className="sell-quantity-btn"
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
        <div className="sell-summary-container">
          <div className="sell-summary-content">
            <div>
              <h3 className="sell-font-medium">Selected Seat:</h3>
              <p className="sell-text-sm">
                {selectedSeats.length > 0
                  ? selectedSeats.map((seat) => seat.name).join(", ")
                  : "Not selected seat"}
              </p>
            </div>
            <div className="sell-text-right">
              <p className="sell-font-medium">Total Price:</p>
              <p className="sell-text-lg font-bold">${totalPrice}</p>
            </div>
          </div>
          <button
            className="sell-book-button"
            disabled={selectedSeats.length === 0}
            onClick={handleBookTickets}
          >
            Book Tickets
          </button>
        </div>
      </div>
      {isBillModal && (
        <BillModal
        title={"Collect money from customers"}
        btn={"Money collected"}
          bill={bill} // Truyền dữ liệu hóa đơn
          onClose={() => setIsBillModal(false)}
          goVNPay={handleCreateTicket} // Đóng modal khi bấm nút Đóng
        />
      )}
    </div>
  );
};

export default SelectedSeatSell;
