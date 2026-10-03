import React, { useEffect, useState } from "react";
import "./modal.css";
import { getAllMovie } from "../../../api/apiMovie";
import { getAllBranch } from "../../../api/apiBranch";
import { getAllRoom } from "../../../api/apiRoom";

const AddSchedule = ({ isOpen, onClose, onAddSchedule }) => {
  const [movies, setMovies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    movieId: "",
    branchId: "",
    roomId: "",
    startDateTime: "",
  });

  useEffect(() => {
    if (isOpen) fetchAllInfo();
  }, [isOpen]);

  const fetchAllInfo = async () => {
    try {
      const movieResponse = await getAllMovie();
      const branchResponse = await getAllBranch();
      const roomResponse = await getAllRoom();
      setMovies(movieResponse?.result || []);
      setBranches(branchResponse?.result || []);
      setRooms(roomResponse?.result || []);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleBranchChange = (branchId) => {
    setNewSchedule({ ...newSchedule, branchId, roomId: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Adding schedule: ", newSchedule);
    onAddSchedule(newSchedule);
    setNewSchedule({
      movieId: "",
      branchId: "",
      roomId: "",
      startDateTime: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Add New Schedule</h2>
        <form className="grid-cols-2" onSubmit={handleSubmit}>
          {/* Select Movie */}
          <select
            value={newSchedule.movieId}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, movieId: e.target.value })
            }
            required
          >
            <option value="" disabled>
              Select Movie
            </option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>

          {/* Select Branch */}
          <select
            value={newSchedule.branchId}
            onChange={(e) => handleBranchChange(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Branch
            </option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>

          {/* Select Room */}
          <select
            value={newSchedule.roomId}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, roomId: e.target.value })
            }
            required
            disabled={!newSchedule.branchId}
          >
            <option value="" disabled>
              Select Room
            </option>
            {rooms
              .filter((room) => room.branchId === Number(newSchedule.branchId))
              .map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
          </select>

          {/* Select Start DateTime */}
          <input
            type="datetime-local"
            value={newSchedule.startDateTime}
            onChange={(e) =>
              setNewSchedule({ ...newSchedule, startDateTime: e.target.value })
            }
            required
          />

          <div className="modal-actions-schedule">
            <button
              type="button"
              className="button-base-schedule button-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="button-base-schedule button-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchedule;
