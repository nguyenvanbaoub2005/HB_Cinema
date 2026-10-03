import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/User/header/Header";
import Home from "../pages/user-pages/Home";
import Movie from "../pages/user-pages/Movie";
import MovieDetailPage from "../pages/user-pages/MovieDetailPage";
import SelectedSeatPage from "../pages/user-pages/SelectedSeatPage";
import TopRate from "../pages/user-pages/TopRate";
import { getMyInfo } from "../api/apiUser";
import ProfilePage from "../pages/user-pages/ProfilePage";
import MovieSearch from "../pages/user-pages/MovieSearch";
import { MovieProvider } from "../context/MovieProvider";

const UserRoutes = () => {
  const [myInfo, setMyInfo] = useState({});
  useEffect(() => {
    fetchMyInfo();
  }, []);

  const fetchMyInfo = async () => {
    try {
      const data = await getMyInfo();
      const myInfo = data.result;
      setMyInfo(myInfo);
      console.log(myInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setMyInfo(null); // Reset user info when logging out
  };

  return (
    <>
      <div className="">
        <Header data={myInfo} onLogout={handleLogout} />
      </div>
      <div className="pt-20">         <MovieProvider>
        <Routes>
          {/* Định nghĩa các route */}
          <Route path="/" element={<Home />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/toprate" element={<TopRate />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/seats/schedule/:id" element={<SelectedSeatPage />} />
          <Route path="/profile*" element={<ProfilePage />} />
          <Route path="/search" element={<MovieSearch />} />
        </Routes>           </MovieProvider>
      </div>
    </>
  );
};

export default UserRoutes;
