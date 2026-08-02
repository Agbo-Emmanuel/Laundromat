import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineSpeakerphone,
  HiOutlineIdentification,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout,
  HiMenuAlt2,
  HiX,
} from "react-icons/hi";
import { PiHandWithdraw } from "react-icons/pi";
import SidebarContent from "../fundraiserDashboard/components/SidebarContent";
import aidra_icon from "../../assets/aidra_icon.png";
import { useCookies } from "react-cookie";
import { logout } from "../../services/auth.service";

const AdminDashboardLanding = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [, , removeCookie] = useCookies([
    "userData",
    "accessToken",
    "refreshToken",
  ]);

  const handleLogout = async () => {
    logout(() => {
      removeCookie("userData", { path: "/" });
      removeCookie("accessToken", { path: "/" });
      removeCookie("refreshToken", { path: "/" });
    });

    toast.success("Logged out successfully");
  };

  const navLinks = [
    {
      to: "/admin/dashboard/overview",
      label: "Dashboard",
      icon: <HiOutlineViewGrid size={22} />,
    },
    {
      to: "/admin/dashboard/campaigns",
      label: "Manage Campaigns",
      icon: <HiOutlineSpeakerphone size={22} />,
    },
    {
      to: "/admin/dashboard/kyc",
      label: "KYC Verifications",
      icon: <HiOutlineIdentification size={22} />,
    },
    {
      to: "/admin/dashboard/users",
      label: "Manage Users",
      icon: <HiOutlineUsers size={22} />,
    },
    {
      to: "/admin/dashboard/manage-withdrawals",
      label: "Manage Withdrawals",
      icon: <PiHandWithdraw size={22} />,
    },
  ];

  const bottomLinks = [
    // {
    //   to: "/admin/dashboard/settings",
    //   label: "Settings",
    //   icon: <HiOutlineCog size={22} />,
    // },
    {
      to: "/login",
      label: "Logout",
      icon: <HiOutlineLogout size={22} />,
    },
  ];

  const onClose = () => setIsSidebarOpen(false);

  return (
    <main className="min-h-screen bg-[#f8f8f6] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] h-screen sticky top-0 overflow-y-auto border-r border-gray-800">
        <SidebarContent
          navLinks={navLinks}
          bottomLinks={bottomLinks}
          onClose={onClose}
          navigate={navigate}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Header/Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 p-4 flex justify-between items-center z-40 shadow-sm">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src={aidra_icon}
            alt="Aidra Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Aidra Admin
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <HiMenuAlt2 size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            className="w-[80%] h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              navLinks={navLinks}
              bottomLinks={bottomLinks}
              onClose={onClose}
              navigate={navigate}
              onLogout={handleLogout}
            />
            <button
              onClick={onClose}
              className="absolute top-6 right-[-50px] text-white"
            >
              <HiX size={28} />
            </button>
          </motion.div>
        </div>
      )}

      {/* Content Area */}
      <section className="flex-1 min-h-screen overflow-x-hidden pt-20 lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardLanding;
