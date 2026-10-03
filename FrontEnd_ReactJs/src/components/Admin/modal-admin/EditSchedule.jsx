import React, { useState, useEffect } from "react";
import "./modal.css";
import { getAllMovie } from "../../../api/apiMovie";
import { getAllBranch } from "../../../api/apiBranch";
import { getAllRoom } from "../../../api/apiRoom";

const EditSchedule = ({
  isOpen,
  onClose,
  schedule,
  onUpdateSchedule,
}) => {
  const [movies, setMovies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [updatedSchedule, setUpdatedSchedule] = useState({
    movieId: "",
    branchId: "",
    roomId: "",
    startDateTime: "",
  });

  // Fetch all data when modal opens
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

  // Update local state when schedule prop changes
  useEffect(() => {
    if (schedule) {
      setUpdatedSchedule({
        movieId: schedule.movieId || "",
        branchId: schedule.branchId || "",
        roomId: schedule.roomId || "",
        startDateTime: schedule.startDateTime
          ? new Date(schedule.startDateTime).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [schedule]);

  const handleBranchChange = (branchId) => {
    setUpdatedSchedule({ ...updatedSchedule, branchId, roomId: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updating schedule: ", updatedSchedule);
    onUpdateSchedule(updatedSchedule);
  };

  if (!isOpen || !schedule) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Update Schedule</h2>
        <form className="grid-cols-2" onSubmit={handleSubmit}>
          {/* Select Movie */}
          <select
            value={updatedSchedule.movieId}
            onChange={(e) =>
              setUpdatedSchedule({ ...updatedSchedule, movieId: e.target.value })
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
            value={updatedSchedule.branchId}
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
            value={updatedSchedule.roomId}
            onChange={(e) =>
              setUpdatedSchedule({ ...updatedSchedule, roomId: e.target.value })
            }
            required
            disabled={!updatedSchedule.branchId}
          >
            <option value="" disabled>
              Select Room
            </option>
            {rooms
              .filter((room) => room.branchId === Number(updatedSchedule.branchId))
              .map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
          </select>

          {/* Select Start DateTime */}
          <input
            type="datetime-local"
            value={updatedSchedule.startDateTime}
            onChange={(e) =>
              setUpdatedSchedule({
                ...updatedSchedule,
                startDateTime: e.target.value,
              })
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

export default EditSchedule;
