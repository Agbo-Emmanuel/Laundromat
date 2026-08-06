import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./ScrollToTop";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./dashboard/workerDashboard/Profile";
import DashboardLanding from "./dashboard/workerDashboard/DashboardLanding";
import Overview from "./dashboard/workerDashboard/Overview";
import CreateOrder from "./dashboard/workerDashboard/CreateOrder";
import Orders from "./dashboard/workerDashboard/Orders";
import OrderDetails from "./dashboard/workerDashboard/OrderDetails";
import AdminDashboardLanding from "./dashboard/adminDashboard/AdminDashboardLanding";
import AdminOverview from "./dashboard/adminDashboard/AdminOverview";
import ManageUsers from "./dashboard/adminDashboard/ManageUsers";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/worker/dashboard" element={<DashboardLanding />}>
          <Route path="overview" element={<Overview />} />
          <Route path="create-order" element={<CreateOrder />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:order_id" element={<OrderDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/admin/dashboard" element={<AdminDashboardLanding />}>
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
