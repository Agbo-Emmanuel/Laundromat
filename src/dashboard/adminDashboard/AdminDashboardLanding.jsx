import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineLogout,
  HiMenuAlt2,
  HiX,
} from "react-icons/hi";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import SidebarContent from "../components/SidebarContent";
// import aidra_icon from "../../assets/aidra_icon.png";
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
    navigate("/");
  };

  const navLinks = [
    {
      to: "/admin/dashboard/overview",
      label: "Dashboard",
      icon: <HiOutlineViewGrid size={20} />,
    },
    {
      to: "/admin/dashboard/orders",
      label: "Manage Orders",
      icon: <HiOutlineClipboardDocumentList size={20} />,
    },
    {
      to: "/admin/dashboard/users",
      label: "Manage Users",
      icon: <HiOutlineUsers size={20} />,
    },
  ];

  const bottomLinks = [
    {
      label: "Logout",
      icon: <HiOutlineLogout size={20} />,
      to: "/",
    },
  ];

  const onClose = () => setIsSidebarOpen(false);

  return (
    <main className="min-h-screen bg-[#EFF8FE] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[260px] h-screen sticky top-0 overflow-y-auto border-r border-[#E1F1FB] bg-white shadow-[0_0_0_1px_rgba(30,136,199,0.03)]">
        <SidebarContent
          navLinks={navLinks}
          bottomLinks={bottomLinks}
          onClose={onClose}
          navigate={navigate}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm border-b border-[#E1F1FB] p-4 flex justify-between items-center z-40 shadow-sm">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#EFF8FE] border border-[#CFE9FA] flex items-center justify-center overflow-hidden">
            {/* <img
              src={aidra_icon}
              alt="Aidra Logo"
              className="w-5 h-5 object-contain"
            /> */}
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0B2540]">
            Aidra Admin
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg text-[#4C6A80] hover:bg-[#F0F8FE] transition-colors duration-200"
        >
          <HiMenuAlt2 size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden fixed inset-0 bg-[#0B2540]/30 backdrop-blur-sm z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="w-[280px] h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent
                navLinks={navLinks}
                bottomLinks={bottomLinks}
                onClose={onClose}
                navigate={navigate}
                onLogout={handleLogout}
              />
            </motion.div>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              onClick={onClose}
              className="absolute top-6 right-4 text-white bg-[#0B2540]/40 hover:bg-[#0B2540]/60 transition-colors duration-200 rounded-full p-1.5"
            >
              <HiX size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <section className="flex-1 min-h-screen overflow-x-hidden pt-[72px] lg:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <motion.div
            key={
              typeof window !== "undefined"
                ? window.location.pathname
                : "content"
            }
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboardLanding;
