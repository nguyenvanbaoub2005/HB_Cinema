import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieSchedule } from "../../../api/apiSchedule";
import { getToken } from "../../../api/localStorage";
import { useNotificationModal } from "../../User/notificationModal/NotificationModal";
import { removeBookingDataStorage } from "../../../api/dataBookingStorage";
import "./sell-ticket.css";
import { getAllMovie } from "../../../api/apiMovie";

const SellTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieSchedule, setMovieSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  // Sử dụng hook thông báo
  const { openModal, ModalComponent } = useNotificationModal();

  
    useEffect(() => {
      fetchAllMovie();
    }, []);
  
    const fetchAllMovie = async () => {
      try {
        const data = await getAllMovie();
        const movie = data.result;
        setMovies(movie);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    const fetchMovieSchedule = async () => {
      if (selectedMovie) {
        const data = await getMovieSchedule(selectedMovie.id );
        const schedule = data.result;
        setMovieSchedule(schedule);

        if (schedule.length > 0) {
          const firstShow = schedule[0];
          setSelectedDate(firstShow.startDateTime.split("T")[0]);
          setSelectedBranch(firstShow.branchName);
          setSelectedRoom(firstShow.room.name);
        }
      } else {
        const data = await getMovieSchedule(1);
        const schedule = data.result;
        setMovieSchedule(schedule);

        if (schedule.length > 0) {
          const firstShow = schedule[0];
          setSelectedDate(firstShow.startDateTime.split("T")[0]);
          setSelectedBranch(firstShow.branchName);
          setSelectedRoom(firstShow.room.name);
        }
      }
    };

    fetchMovieSchedule();
  }, [selectedMovie]);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setMovieSchedule([]);
    setSelectedDate("");
    setSelectedBranch("");
    setSelectedRoom("");
  };


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
    removeBookingDataStorage();
    navigate(`/admin/sell-ticket/${showtime.id}`);
  };

  return (
    <div className="container sell-movie-schedule-container">
      <ModalComponent />
      <h1 className="sell-title">Choose movies for customers</h1>
      {/* Movie Selection Section */}
      <div className="sell-movie-selection-row">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={`sell-movie-card ${selectedMovie?.id === movie.id ? 'selected' : ''}`}
            onClick={() => handleMovieSelect(movie)}
          >
            <img 
              src={movie.image} 
              alt={movie.title}
              className="sell-movie-poster" 
            />
            <div className="sell-movie-info">
              <h3 className="sell-movie-title">{movie.title}</h3>
              <p className="sell-movie-duration">{movie.duration} minutes</p>
            </div>
          </div>
        ))}
      </div>

      {/* Date Selection */}
      <div className="sell-selection-row">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`sell-selection-button date-button ${
              selectedDate === date ? "selected" : ""
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
      <div className="sell-selection-row">
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            className={`sell-selection-button sell-branch-button ${
              selectedBranch === branch ? "selected" : ""
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* Room Selection */}
      <div className="sell-selection-row">
        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => setSelectedRoom(room)}
            className={`sell-selection-button sell-room-button ${
              selectedRoom === room ? "selected" : ""
            }`}
          >
            {room}
          </button>
        ))}
      </div>

      {/* Showtime List */}
      <div className="sell-showtime-list">
        {showtimes.map((showtime, index) => (
          <button
            key={index}
            onClick={() => handleShowtimeClick(showtime)}
            className="sell-showtime-button"
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

export default SellTicket;
