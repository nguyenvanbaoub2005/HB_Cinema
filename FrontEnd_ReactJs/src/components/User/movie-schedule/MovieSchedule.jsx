import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieSchedule } from "../../../api/apiSchedule";
import "./movieSchedule.css";
import branchHB from "../../../assets/images/branchHB.png";
import roomHB from "../../../assets/images/roomHB.png";
import { getToken } from "../../../api/localStorage";
import { useNotificationModal } from "../notificationModal/NotificationModal";
import { removeBookingDataStorage } from "../../../api/dataBookingStorage";

const MovieSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const [movieSchedule, setMovieSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  // Sử dụng hook thông báo
  const { openModal, ModalComponent } = useNotificationModal();

  useEffect(() => {
    const fetchMovieSchedule = async () => {
      const data = await getMovieSchedule(id);
      const schedule = data.result;
      setMovieSchedule(schedule);
      console.log(schedule);

      if (schedule.length > 0) {
        // Đặt mặc định ngày, chi nhánh, phòng
        const firstShow = schedule[0];
        setSelectedDate(firstShow.startDateTime.split("T")[0]);
        setSelectedBranch(firstShow.branchName);
        setSelectedRoom(firstShow.room.name);
      }
    };

    fetchMovieSchedule();
  }, [id]);

  // Các giá trị tính toán dựa trên dữ liệu
  const dates = useMemo(
    () => [
      ...new Set(movieSchedule.map((show) => show.startDateTime.split("T")[0])),
    ],
    [movieSchedule]
  );

  const branches = useMemo(
    () => [
      ...new Set(
        movieSchedule
          .filter((show) => show.startDateTime.startsWith(selectedDate))
          .map((show) => show.branchName)
      ),
    ],
    [movieSchedule, selectedDate]
  );

  const rooms = useMemo(() => {
    return [
      ...new Set(
        movieSchedule
          .filter(
            (show) =>
              show.branchName === selectedBranch &&
              show.startDateTime.startsWith(selectedDate)
          )
          .map((show) => show.room.name)
      ),
    ];
  }, [movieSchedule, selectedBranch, selectedDate]);

  const showtimes = useMemo(() => {
    return movieSchedule.filter(
      (show) =>
        show.branchName === selectedBranch &&
        show.room.name === selectedRoom &&
        show.startDateTime.startsWith(selectedDate)
    );
  }, [movieSchedule, selectedBranch, selectedRoom, selectedDate]);

  // Cập nhật chi nhánh mặc định khi chọn ngày mới
  useEffect(() => {
    if (branches.length > 0) {
      setSelectedBranch(branches[0]); // Set chi nhánh đầu tiên
    } else {
      setSelectedBranch(""); // Không có chi nhánh
    }
  }, [selectedDate, branches]);

  // Cập nhật phòng mặc định khi chọn ngày mới
  useEffect(() => {
    if (rooms.length > 0) {
      setSelectedRoom(rooms[0]); // Phòng đầu tiên trong danh sách
    } else {
      setSelectedRoom(""); // Không có phòng
    }
  }, [selectedDate, selectedBranch, rooms]);

  const handleShowtimeClick = (showtime) => {
    if (!token) {
      openModal({ type: "info", title: "Please login", message: "Please login to purchase tickets" });
      navigate("/login"); // Chuyển hướng tới trang đăng nhập nếu chưa đăng nhập
    } else {
      removeBookingDataStorage();
      navigate(`/seats/schedule/${showtime.id}`);
    }
  };

  return (
    <div className="container movie-schedule-container">
      <ModalComponent />
      {/* Date Selection */}
      <div className="selection-row">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`selection-button date-button ${selectedDate === date ? "selected" : ""
              }`}
          >
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })}
          </button>
        ))}
      </div>

      {/* Branch Selection */}
      <div className="selection-row">
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            className={`selection-button branch-button ${selectedBranch === branch ? "selected" : ""
              }`}
          >
            <img src={branchHB} alt="" />
            {branch}
          </button>
        ))}
      </div>

      {/* Room Selection */}
      <div className="selection-row">
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => setSelectedRoom(room)}
            className={`selection-button room-button ${selectedRoom === room ? "selected" : ""
              }`}
          >
            <img src={roomHB} alt="" />
            {room}
          </button>
        ))}
      </div>

      {/* Showtime List */}
      <div className="showtime-list">
        {showtimes.map((showtime, index) => (
          <button
            key={index}
            onClick={() => handleShowtimeClick(showtime)}
            className="showtime-button"
          >
            {new Date(showtime.startDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MovieSchedule;
