
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../components/Admin/sidebar/Sidebar";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Movie from "../components/Admin/movie/Movie";
import Branch from "../components/Admin/branch/Branch";
import User from "../components/Admin/user/User";
import Dashboard from "../components/Admin/dashboard/Dashboard";
import Room from "../components/Admin/room/Room";
import Schedule from "../components/Admin/schedule/Schedule";
import SeatSchedule from "../components/Admin/seat/SeatSchedule";
import SeatRoom from "../components/Admin/seat/SeatRoom";
import SellTicket from "../components/Admin/sell-ticket/SellTicket";
import SelectedSeatSell from "../components/Admin/selected-seat/SelectedSeatSell";
import MyTicket from "../components/Admin/my-ticket/MyTicket";
import AllBill from "../components/Admin/all-bill/AllBill";
import MyBillAdmin from "../components/Admin/my-bill/MyBill";
import BillUser from "../components/Admin/bill-user/BillUser";

const AdminRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpenOnMobile(!isSidebarOpenOnMobile);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed xl:relative z-20 h-full bg-white shadow-md transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          xl:translate-x-0 xl:w-[250px] w-[250px]`}
      >
        <Sidebar />
      </div>

      {/* Nội dung chính, bao gồm cả MenuBar */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${isSidebarOpen && !isSidebarOpenOnMobile ? "ml-[250px]" : ""
          }`}
      >
        {/* MenuBar luôn hiển thị phía trên */}
        <div className="h-[60px] sticky top-0 z-20 flex items-center justify-between p-4 shadow-md bg-white">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-2xl xl:hidden">
              <FiMenu />
            </button>
            <nav className="ml-4 space-x-4">
              <Link to="/admin/dashboard" className="hover:text-blue-500">
                Dashboard
              </Link>
              <Link to="/admin/user" className="hover:text-blue-500">
                Customer
              </Link>
              <Link to="/admin/movie" className="hover:text-blue-500">
                Movie
              </Link>
              <Link to="/admin/branch" className="hover:text-blue-500">
                Branch
              </Link>
              <Link to="/admin/movie" className="hover:text-blue-500">
                Schedule
              </Link>
            </nav>
          </div>
        </div>

        {/* Nội dung chính */}
        <div
          className="p-0"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            paddingTop: "40px",
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user" element={<User />} />
            <Route path="/movie" element={<Movie />} />
            <Route path="/branch" element={<Branch />} />
            <Route path="/branch/rooms/:id" element={<Room />} />
            <Route path="/branch/rooms/seats/:id" element={<SeatRoom />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/schedule/seats/:id" element={<SeatSchedule />} />
           < Route path="/sell-ticket" element={<SellTicket />} />
           < Route path="/sell-ticket/:id" element={<SelectedSeatSell />} />
           < Route path="/my-bill" element={<MyBillAdmin />} />
           < Route path="/my-ticket/:id" element={<MyTicket />} />
           < Route path="/all-bill" element={<AllBill />} /> 
           < Route path="/bill-user/:id" element={<BillUser />} /> 
          </Routes>
        </div>
      </div>

      {/* Overlay để đóng sidebar khi nhấn bên ngoài */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 xl:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default AdminRoutes;