import {
  UserCircleIcon,
  ChartPieIcon,
  FilmIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { RiBillLine } from "react-icons/ri";
import { Calendar, Ticket, TicketCheck, TicketCheckIcon } from "lucide-react";
import Logo from "../../../assets/images/logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { removeToken } from "../../../api/localStorage";
import { getMyInfo } from "../../../api/apiUser";
import "./sidebar.css";

export default function SidebarAdmin() {
  const [myInfo, setMyInfo] = useState({});
  const [checkRoles, setCheckRoles] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard"); // Thiết lập trạng thái menu đang hoạt động
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyInfo();
  }, []);

  const fetchMyInfo = async () => {
    try {
      const data = await getMyInfo();
      const myInfo = data.result;
      setMyInfo(myInfo);
      setCheckRoles(myInfo.roles[0].name);
      console.log(myInfo);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    removeToken(); // Gọi hàm logout của bạn ở đây
    navigate("/login");
  };

  return (
    <div className="sidebar sidebar-container">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img src={Logo} alt="Logo" />
      </div>

      {/* Profile Section */}
      <div className="sidebar-profile">
        <UserCircleIcon className="profile-icon" />
        <div className="profile-text">
          <h2 className="text-gray-700">{myInfo.lastName} {myInfo.firstName}</h2>
          <p className="text-gray-700">{checkRoles ? checkRoles.toLowerCase(): checkRoles}</p>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="h-4 w-4" />
        </button>
      </div>

      {/* Menu Items */}
      <div className="menu-items">
        {checkRoles === "ADMIN" && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveMenu("dashboard")}
          >
            <ChartPieIcon className="menu-item-icon" />
            <span className="menu-item-text">Dashboard</span>
          </NavLink>
        )}

        {checkRoles === "STAFF" && (
          <NavLink
            to="/admin/sell-ticket"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveMenu("sell-ticket")}
          >
            <Ticket className="menu-item-icon" />
            <span className="menu-item-text">Sell Ticket</span>
          </NavLink>
        )}

        {checkRoles === "STAFF" && (
          <NavLink
            to="/admin/my-bill"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveMenu("my-bill")}
          >
            <TicketCheck className="menu-item-icon" />
            <span className="menu-item-text">Ticket Sold</span>
          </NavLink>
        )}

        {checkRoles === "ADMIN" && (
          <NavLink
            to="/admin/user"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveMenu("customers")}
          >
            <UserCircleIcon className="menu-item-icon" />
            <span className="menu-item-text">Customers</span>
          </NavLink>
        )}

        {checkRoles === "ADMIN" && (
          <NavLink
            to="/admin/all-bill"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveMenu("all-bill")}
          >
            <RiBillLine className="menu-item-icon" />
            <span className="menu-item-text">All Bill</span>
          </NavLink>
        )}

        {checkRoles === "ADMIN" && (
          <NavLink
            to="/admin/movie"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveMenu("movie")}
          >
            <FilmIcon className="menu-item-icon" />
            <span className="menu-item-text">Movies</span>
          </NavLink>
        )}
        {checkRoles === "ADMIN" && (
          <NavLink
            to="/admin/branch"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveMenu("branch")}
          >
            <ChartBarIcon className="menu-item-icon" />
            <span className="menu-item-text">Branch</span>
          </NavLink>
        )}
        {checkRoles === "ADMIN" && (
          <NavLink
            to="/admin/schedule"
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
            onClick={() => setActiveMenu("schedule")}
          >
            <Calendar className="menu-item-icon" />
            <span className="menu-item-text">Schedule</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}
