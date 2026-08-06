import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
// import aidra_icon from "../../../assets/aidra_icon.png";
import { useCookies } from "react-cookie";

const SidebarContent = ({
  navLinks,
  bottomLinks,
  onClose,
  navigate,
  onLogout,
}) => {
  const [cookies] = useCookies(["userData"]);
  const user = cookies.userData;

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full bg-white text-[#0B2540] p-5">
      {/* Logo */}
      <div
        // onClick={() => navigate("/")}
        className="flex items-center gap-2.5 mb-6 group"
      >
        <div className="w-9 h-9 rounded-full bg-[#EFF8FE] border border-[#CFE9FA] flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:border-[#8FCBF2]">
          {/* <motion.img
            src={aidra_icon}
            alt="Aidra Logo"
            className="w-5 h-5 object-contain"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          /> */}
        </div>
        <span className="text-lg font-bold tracking-tight text-[#0B2540]">
          Laundro
        </span>
      </div>

      {/* User Profile Block */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center gap-3 mb-8 bg-[#F4FAFE] rounded-2xl p-3 border border-[#E1F1FB]"
        >
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.full_name}
              className="w-11 h-11 rounded-full object-cover flex-shrink-0 ring-2 ring-white outline outline-1 outline-[#BFE2F7]"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#1E88C7] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-white outline outline-1 outline-[#BFE2F7]">
              {getInitials(user.full_name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0B2540] truncate">
              {user.full_name || "User"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-[#5B7A93] capitalize">
                {user.account_type || "Individual"}
              </span>
              {user.kyc_status === "approved" && (
                <>
                  <span className="text-[#BFD8E8]">·</span>
                  <span className="text-xs text-[#0F8F5F] font-medium">
                    Approved
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 space-y-1">
        {navLinks.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
          >
            <NavLink
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-[#1E88C7] text-white shadow-sm shadow-[#1E88C7]/30"
                    : "text-[#4C6A80] hover:bg-[#F0F8FE] hover:text-[#0B2540]"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Nav */}
      <nav className="mt-auto pt-5 border-t border-[#E7F2FA] space-y-1">
        {bottomLinks.map((link) =>
          link.label === "Logout" ? (
            <button
              key={link.label}
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium text-[#4C6A80] hover:bg-[#FCEEEE] hover:text-[#C4433D] cursor-pointer"
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium text-[#4C6A80] hover:bg-[#F0F8FE] hover:text-[#0B2540]"
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ),
        )}
      </nav>
    </div>
  );
};

export default SidebarContent;
