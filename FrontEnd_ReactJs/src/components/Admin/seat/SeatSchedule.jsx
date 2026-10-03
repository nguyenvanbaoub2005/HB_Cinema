import React, { useEffect, useState } from 'react'
import { useNotificationModal } from '../../User/notificationModal/NotificationModal';
import { useParams } from 'react-router-dom';
import { getSeat } from '../../../api/apiSeat';
import './seat.css'
import Loading from '../../User/loading/Loading';

const SeatSchedule = () => {
      const { id } = useParams();
      const [seats, setSeats] = useState([]);
       const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const { openModal, ModalComponent } = useNotificationModal();

        useEffect(() => {
          fetchSeat();
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

        const getSeatClassName = (seat) => {
            const baseClasses = ["seat-button-admin"];
            baseClasses.push(
              seat.seatType === "Couple" ? "seat-couple-admin" : "seat-single-admin"
            );
        
            if (seat.booked) {
              baseClasses.push("seat-booked-admin");
            } else if (seat.seatType === "Couple") {
              baseClasses.push("seat-couple-admin");
            } else if (seat.seatType === "VIP") {
              baseClasses.push("seat-vip-admin");
            } else {
              baseClasses.push("seat-standard-admin");
            }
        
            return baseClasses.join(" ");
          };

                if (loading) return <Loading text="Loading seat list..."/>
                if (error) return <div className="error">Error: {error}</div>;
  return (
    <div className="container row seat-container-admin">
    <ModalComponent />
    <div>
      <div className="seats-grid-admin">
        {seats.map((seat) => (
          <button
            key={seat.id}
            disabled={seat.booked}
            className={getSeatClassName(seat)}
          >
            <span className="seat-name-admin">{seat.name}</span>
            <span className="seat-price-admin">${seat.price}</span>
          </button>
        ))}
      </div>

      <div className="seat-legend-admin">
        <div className="legend-item-admin">
          <div className="legend-color-admin seat-standard-admin"></div>
          <span>Standard Seat</span>
        </div>
        <div className="legend-item-admin">
          <div className="legend-color-admin seat-vip-admin"></div>
          <span>VIP Seat</span>
        </div>
        <div className="legend-item-admin">
          <div className="legend-color-admin seat-couple-admin"></div>
          <span>Couple Seat</span>
        </div>
        <div className="legend-item-admin">
          <div className="legend-color-admin seat-booked-admin"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
    
  </div>
  )
}

export default SeatSchedule
