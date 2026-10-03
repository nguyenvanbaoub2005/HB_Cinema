import React, { useContext, useEffect, useState } from "react";
import { getAllMovie } from "../../api/apiMovie";
import TopMovie from "../../components/User/top-movie/TopMovie";
import Footer from "../../components/User/footer/Footer";
import Loading from "../../components/User/loading/Loading";
import { useNotificationModal } from "../../components/User/notificationModal/NotificationModal";
import { MovieProvider } from "../../context/MovieProvider";
import { useNavigate } from "react-router-dom";


const TopRate = () => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const { openModal, ModalComponent } = useNotificationModal();
  useEffect(() => {
    fetchAllMovie();
  }, []);

  const fetchAllMovie = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const data = await getAllMovie();
      setMovie(data.result);
      console.log(data.result);
    } catch (error) {
      openModal({ type: "error", title: "Error", message: error.message });
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleMovieClick = (id) => {
    navigate(`/movies/${id}`);
  };

  // Nếu đang loading, hiển thị spinner
  if (loading) {
    return <Loading fullScreen={true} text="Loading movie list..." />;
  }

  return (
    <div>
      <MovieProvider>
        <ModalComponent />
        {error && <p className="text-red-500">{error}</p>}
        <TopMovie movie={movie} onMovieClick={handleMovieClick} />
        <Footer />
      </MovieProvider>
    </div>
  );
};

export default TopRate;
