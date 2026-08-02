import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./ScrollToTop";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* 
        <Route path="/fundraiser/dashboard" element={<DashboardLanding />}>
          <Route path="overview" element={<Overview />} />
          <Route path="campaigns" element={<UserCampaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="create-campaign" element={<CreateCampaign />} />
          <Route path="profile" element={<Profile />} />
          <Route path="kyc" element={<KycVerification />} />
          <Route path="campaign-updates" element={<CampaignUpdates />} />
          <Route path="withdraw" element={<WithdrawFunds />} />
          <Route path="withdrawal-history" element={<WithdrawalHistory />} />
          <Route
            path="withdrawal-history/:id/receipt"
            element={<WithdrawalReceipt />}
          />
        </Route> */}

        {/* <Route path="/admin/dashboard" element={<AdminDashboardLanding />}>
          <Route path="overview" element={<AdminOverview />} />
          <Route path="campaigns" element={<ManageCampaigns />} />
          <Route path="kyc" element={<ManageKYC />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="manage-withdrawals" element={<ManageWithdrawal />} />
          <Route
            path="settings"
            element={
              <div className="text-white">Admin Settings Coming Soon</div>
            }
          />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
