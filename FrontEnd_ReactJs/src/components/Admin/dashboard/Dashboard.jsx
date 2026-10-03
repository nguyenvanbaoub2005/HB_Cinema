import React, { useState, useEffect } from "react";
import {
  Film,
  RefreshCcw,
  BadgeDollarSign,
  User,
  Calendar,
  Star,
  Ticket,
} from "lucide-react";
import { FaDollarSign, FaMoneyBill, FaMoneyBillWave } from "react-icons/fa";
import { IoTicket, IoTicketOutline } from "react-icons/io5";
import { getAllTicket } from "../../../api/apiTicket";
import { getAllUser } from "../../../api/apiUser";
import { getAllMovie } from "../../../api/apiMovie";
import { MdRoom } from "react-icons/md";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const totalRevenue = tickets.reduce((total, item) => total + item.price, 0);
  const totalTicket = tickets.length;
  const totalUser = users.length;
  const totalMovie = movies.length;
  const sortedMovie = Object.values(movies).sort((a, b) => b.rating - a.rating);
  const movieByRating = limitData(sortedMovie, 5);
  const userByTicket = limitData(users, 5);
  useEffect(() => {
    fetchAllTicket();
    fetchAllUsers();
    fetchAllMovie();
  }, []);

  const fetchAllTicket = async () => {
    try {
      const data = await getAllTicket();
      setTickets(data.result);
      console.log(data.result);
    } catch (error) {
      console.error("Error fetching all ticket:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await getAllUser();
      setUsers(data.result);
      console.log(data.result);
    } catch (error) {
      console.error("Error fetching all user :", error);
    }
  };

  const fetchAllMovie = async () => {
    try {
      const data = await getAllMovie();
      setMovies(data.result);
      console.log(data.result);
    } catch (error) {
      console.error("Error fetching all movie :", error);
    }
  };
  //Hàm giới hạn dữ liệu
  function limitData(data, limit) {
    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu phải là một mảng");
    }
    if (typeof limit !== "number" || limit <= 0) {
      throw new Error("Giới hạn phải là một số dương");
    }
    return data.slice(0, limit);
  }

  // Xử lý dữ liệu
  const processDataRevenueByMovie = (data) => {
    const movieMap = {};
    // Đếm số vé bán cho mỗi phim và tính tổng tiền
    data.forEach(({ scheduleDetails, price }) => {
      const movie = scheduleDetails?.movie; // Kiểm tra an toàn nếu scheduleDetails hoặc movie bị undefined
      if (!movie || price === undefined) return; // Kiểm tra nếu không có giá vé

      if (!movieMap[movie.id]) {
        movieMap[movie.id] = {
          id: movie.id,
          title: movie.title,
          ticketsSold: 0,
          rating: movie.rating,
          totalRevenue: 0, // Thêm trường tổng tiền
        };
      }

      movieMap[movie.id].ticketsSold += 1; // Đếm số lượng vé bán
      movieMap[movie.id].totalRevenue += price; // Cộng dồn tổng tiền từ giá vé
    });

    // Chuyển object movieMap thành mảng và sắp xếp theo số vé bán từ cao đến thấp
    const sortedMovies = Object.values(movieMap).sort(
      (a, b) => b.ticketsSold - a.ticketsSold
    );

    // Thêm trường 'top' vào mỗi đối tượng phim
    sortedMovies.forEach((movie, index) => {
      movie.top = index + 1; // Thứ hạng sẽ là chỉ số + 1 (vì chỉ số mảng bắt đầu từ 0)
    });

    return sortedMovies; // Trả về danh sách phim đã sắp xếp với trường 'top' và 'totalRevenue'
  };

  const DataRevenueByMovie = processDataRevenueByMovie(tickets);
  const RevenueByMovie = limitData(DataRevenueByMovie, 5);

  console.log(RevenueByMovie);

  const processRevenueByBranch = (data) => {
    const branchMap = {};

    // Đếm số vé bán cho mỗi phim và tính tổng tiền
    data.forEach(({ scheduleDetails, price }) => {
      const branch = scheduleDetails?.branch; // Kiểm tra an toàn nếu scheduleDetails hoặc movie bị undefined
      if (!branch || price === undefined) return; // Kiểm tra nếu không có giá vé

      if (!branchMap[branch.id]) {
        branchMap[branch.id] = {
          id: branch.id,
          name: branch.name,
          ticketsSold: 0,
          totalRevenue: 0,
        };
      }

      branchMap[branch.id].ticketsSold += 1; // Đếm số lượng vé bán
      branchMap[branch.id].totalRevenue += price; // Cộng dồn tổng tiền từ giá vé
    });

    // Chuyển object movieMap thành mảng và sắp xếp theo số vé bán từ cao đến thấp
    const sortedBranchs = Object.values(branchMap).sort(
      (a, b) => b.ticketsSold - a.ticketsSold
    );

    // Thêm trường 'top' vào mỗi đối tượng phim
    sortedBranchs.forEach((branch, index) => {
      branch.top = index + 1; // Thứ hạng sẽ là chỉ số + 1 (vì chỉ số mảng bắt đầu từ 0)
    });

    return sortedBranchs; // Trả về danh sách phim đã sắp xếp với trường 'top' và 'totalRevenue'
  };

  const RevenueByBranch = processRevenueByBranch(tickets);

  console.log(RevenueByBranch);

  const StatCard = ({ title, value, change, icon: Icon }) => (
    <div className="bg-white rounded-lg p-4 flex flex-col shadow-md">
      <h3 className="text-gray-600 text-sm mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-gray-800 text-2xl font-bold">
            {value.toLocaleString()}
          </span>
          <span
            className={`ml-2 text-sm ${
              change >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change}
            {title === "Revenue this month" ? "%" : ""}
          </span>
        </div>
        <Icon className="text-orange-500 w-6 h-6" />
      </div>
    </div>
  );

  const ItemsTableMovie = ({ title, items, showViewAll = true }) => (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Calendar className="text-orange-500 w-5 h-5 mr-2" />
          <h2 className="text-gray-800 text-lg font-semibold">{title}</h2>
        </div>
        {showViewAll && (
          <button className="flex items-center text-gray-600 hover:text-orange-500 transition-colors">
            <span className="mr-2">View All</span>
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-600 text-sm">
              <th className="text-left py-2 px-4">TOP</th>
              <th className="text-left py-2 px-4">MOVIE</th>
              <th className="text-left py-2 px-4">TICKET</th>
              <th className="text-left py-2 px-4">REVENUE</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-100 hover:bg-orange-50 transition-colors"
              >
                <td className="py-2 px-4 text-gray-800">{item.top}</td>
                <td className="py-2 px-4 text-gray-800">{item.title}</td>
                <td className="py-2 px-4 text-gray-800">{item.ticketsSold}</td>
                <td className="py-2 px-4 flex items-center text-gray-800">
                  <FaDollarSign className="text-orange-500 w-4 h-4 mr-1" />
                  {item.totalRevenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ItemsTableBranch = ({ title, items, showViewAll = true }) => (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <MdRoom className="text-orange-500 w-5 h-5 mr-2" />
          <h2 className="text-gray-800 text-lg font-semibold">{title}</h2>
        </div>
        {showViewAll && (
          <button className="flex items-center text-gray-600 hover:text-orange-500 transition-colors">
            <span className="mr-2">View All</span>
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-600 text-sm">
              <th className="text-left py-2 px-4">ID</th>
              <th className="text-left py-2 px-4">BRANCH</th>
              <th className="text-left py-2 px-4">TICKET</th>
              <th className="text-left py-2 px-4">REVENUE</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-100 hover:bg-orange-50 transition-colors"
              >
                <td className="py-2 px-4 text-gray-800">{item.top}</td>
                <td className="py-2 px-4 text-gray-800">{item.name}</td>
                <td className="py-2 px-4 text-gray-800">{item.ticketsSold}</td>
                <td className="py-2 px-4 flex items-center text-gray-800">
                  <FaDollarSign className="text-orange-500 w-4 h-4 mr-1" />
                  {item.totalRevenue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ItemsTableTopMovie = ({ title, items, showViewAll = true }) => (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Film className="text-orange-500 w-5 h-5 mr-2" />
          <h2 className="text-gray-800 text-lg font-semibold">{title}</h2>
        </div>
        {showViewAll && (
          <button className="flex items-center text-gray-600 hover:text-orange-500 transition-colors">
            <span className="mr-2">View All</span>
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-600 text-sm">
              <th className="text-left py-2 px-4">ID</th>
              <th className="text-left py-2 px-4">MOVIE</th>
              <th className="text-left py-2 px-4">LANGUAGE</th>
              <th className="text-left py-2 px-4">RATING</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-100 hover:bg-orange-50 transition-colors"
              >
                <td className="py-2 px-4 text-gray-800">{item.id}</td>
                <td className="py-2 px-4 text-gray-800">{item.title}</td>
                <td className="py-2 px-4 text-gray-800">{item.language}</td>
                <td className="py-2 px-4 flex items-center text-gray-800">
                  <Star className="text-orange-500 w-4 h-4 mr-1" />
                  {item.rating.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  const ItemsTablUser = ({ title, items, showViewAll = true }) => (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <User className="text-orange-500 w-5 h-5 mr-2" />
          <h2 className="text-gray-800 text-lg font-semibold">{title}</h2>
        </div>
        {showViewAll && (
          <button className="flex items-center text-gray-600 hover:text-orange-500 transition-colors">
            <span className="mr-2">View All</span>
            <RefreshCcw className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-600 text-sm">
              <th className="text-left py-2 px-4">NAME</th>
              <th className="text-left py-2 px-4">MAIL</th>
              <th className="text-left py-2 px-4">TICKET</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-100 hover:bg-orange-50 transition-colors"
              >
                <td className="py-2 px-4 text-gray-800">
                  {item.firstName + " "}
                  {item.lastName}
                </td>
                <td className="py-2 px-4 text-gray-800">{item.email}</td>
                <td className="py-2 px-4 flex items-center text-gray-800">
                  <IoTicket className="text-orange-500 w-4 h-4 mr-1" />
                  {5}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Revenue this month"
          value={totalRevenue}
          change={-25}
          icon={FaMoneyBillWave}
        />
        <StatCard
          title="Total tickets sold this month"
          value={totalTicket}
          change={-33}
          icon={IoTicketOutline}
        />
        <StatCard
          title="Total current customers"
          value={totalUser}
          change={26}
          icon={User}
        />
        <StatCard
          title="Movies available"
          value={totalMovie}
          change={3}
          icon={Film}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ItemsTableMovie title="Revenue per movie" items={RevenueByMovie} />
        <ItemsTableBranch title="Revenue per branch" items={RevenueByBranch} />
        <ItemsTableTopMovie title="Top rating" items={movieByRating} />
        <ItemsTablUser
          title="Top users"
          items={userByTicket.filter(
            (user) => !user.roles.some((role) => role.name === "ADMIN")
          )}
        />
      </div>
    </div>
  );
};

export default Dashboard;
