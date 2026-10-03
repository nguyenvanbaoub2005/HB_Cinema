import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./bill-modal.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { Landmark } from "lucide-react";

const BillModal = ({ bill, onClose, goVNPay, title, btn }) => {
  const navigate = useNavigate();
  if (!bill) return null;

  const { totalPrice, seats, combos } = bill;

  return (
    <div className="bill-modal-overlay">
      <div className="bill-modal">
        <div className="bill-modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        <div className="bill-modal-content">
          <div className="section">
            <h3>Selected Seat</h3>
            <div className="items-list">
              {seats.map((seat, index) => (
                <div key={index} className="item">
                  <span className="item-name">Seat {seat.name}</span>
                  <span className="item-price">${seat.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Selected Combo</h3>
            <div className="items-list">
              {combos.map((combo, index) => (
                <div key={index} className="item">
                  <span className="item-name">{combo.name}</span>
                  <span className="item-price">${combo.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="total-section">
            <div className="total-line">
              <span>Total Amount</span>
              <span className="total-price">${totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="bill-modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="pay-button" onClick={goVNPay}>
            {btn}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillModal;