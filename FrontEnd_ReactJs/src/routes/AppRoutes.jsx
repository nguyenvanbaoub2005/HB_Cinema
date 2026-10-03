import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User from "./UserRoutes";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import AdminRoutes from "./AdminRoutes";
import BillVNPay from "../components/User/bill-VNPay/BillVNPay";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/identity/payment/vn-pay-callback" element={<BillVNPay />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
