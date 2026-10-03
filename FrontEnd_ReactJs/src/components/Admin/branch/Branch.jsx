import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBranch } from "../../../api/apiBranch";
import "./branch.css"; 

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fecthAllBranch();
  }, []);

  const fecthAllBranch = async () => {
    try {
      setError(null);
      const data = await getAllBranch();
      setBranches(data.result);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewRooms = (branchId) => {
    navigate(`/admin/branch/rooms/${branchId}`);
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="branch-container">
      {branches.map((branch) => (
        <div
          key={branch.id}
          className="branch-card"
        >
          <img
            src={branch.image}
            alt={branch.name}
            className="branch-image"
          />
          <div className="branch-content">
            <h2 className="branch-name">{branch.name}</h2>
            <p className="branch-phone">Phone Number: {branch.phoneNumber}</p>
            <div className="col">
              <button
                onClick={() => handleViewRooms(branch.id)}
                className="view-rooms-button"
              >
                Show Room
              </button>
              <button className="view-address-button">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    branch.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-address-link"
                >
                  Address
                </a>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Branch;
