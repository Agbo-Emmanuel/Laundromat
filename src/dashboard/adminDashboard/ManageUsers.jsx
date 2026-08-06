import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineIdentification,
  HiOutlineLogin,
  HiOutlineBan,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { getAllUsers } from "../../services/admin.service";
import UserProfile from "../components/UserProfile";
import { toast } from "react-toastify";

// ---- helpers -----------------------------------------------------------

const formatLabel = (value) =>
  typeof value === "string"
    ? value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : value;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ---- badges -------------------------------------------------------------

const StatusBadge = ({ type, status }) => {
  const getStyles = () => {
    switch (type) {
      case "role":
        return status === "admin"
          ? "bg-purple-50 text-purple-700 border-purple-200"
          : "bg-blue-50 text-blue-700 border-blue-200";
      case "kyc":
        if (status === "approved")
          return "bg-emerald-50 text-emerald-700 border-emerald-200";
        if (status === "pending")
          return "bg-amber-50 text-amber-700 border-amber-200";
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "suspended":
        return status
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "account_type":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getLabel = () => {
    if (type === "suspended") return status ? "Suspended" : "Active";
    return formatLabel(status ?? "—");
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border whitespace-nowrap ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
};

// ---- detail modal ---------------------------------------------------------

const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  const infoRows = [
    { label: "User ID", value: user.id, mono: true },
    { label: "Account Type", value: formatLabel(user.account_type) },
    { label: "Sign-in Method", value: formatLabel(user.auth_provider) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 16 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-xl mt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-28 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-gray-100">
          {/* <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 cursor-pointer rounded-full bg-white/80 text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
          >
            <HiOutlineX size={20} />
          </button> */}
          <div className="absolute -bottom-9 left-8">
            <div className="w-[72px] h-[72px] rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center text-emerald-600 bg-emerald-50">
              <HiOutlineUser size={34} />
            </div>
          </div>
        </div>

        <div className="pt-12 pb-8 px-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.full_name || "No Name Provided"}
            </h2>
            <p className="text-gray-500 flex items-center gap-2 mt-1 text-sm">
              <HiOutlineMail className="text-emerald-600" />
              {user.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Role
              </p>
              <StatusBadge type="role" status={user.role} />
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                KYC Status
              </p>
              <StatusBadge type="kyc" status={user.kyc_status} />
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Account
              </p>
              <StatusBadge type="suspended" status={user.is_suspended} />
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                Joined On
              </p>
              <p className="text-sm text-gray-700 font-medium flex items-center gap-1.5">
                <HiOutlineClock className="text-gray-400" size={14} />
                {formatDate(user.created_at)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Additional Information
            </h3>
            <div className="space-y-2">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center text-sm py-1"
                >
                  <span className="text-gray-500">{row.label}</span>
                  <span
                    className={`text-gray-700 font-medium ${row.mono ? "font-mono text-[11px]" : ""}`}
                  >
                    {row.value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-emerald-600/20"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ---- main page ------------------------------------------------------------

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Debounce search so filtering feels smooth while typing
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(searchTerm), 200);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term),
    );
  }, [users, debouncedSearch]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all registered users on the platform
          </p>
        </div>
        <UserProfile role="admin" />
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <HiOutlineSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 text-sm placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 shadow-sm transition-all text-sm font-medium">
            <HiOutlineFilter size={18} />
            Filter
          </button>
          <div className="text-sm text-gray-500 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
            Total:{" "}
            <span className="text-emerald-600 font-bold">
              {filteredUsers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Account Type
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-4">
                      <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-20 text-center text-gray-400"
                  >
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03, duration: 0.2 }}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <HiOutlineUser size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {user.full_name || "No Name"}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge type="role" status={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <HiOutlineIdentification
                          className="text-gray-400"
                          size={14}
                        />
                        {formatLabel(user.account_type)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge type="kyc" status={user.kyc_status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {user.is_suspended ? (
                          <HiOutlineBan className="text-rose-500" size={14} />
                        ) : (
                          <HiOutlineCheckCircle
                            className="text-emerald-500"
                            size={14}
                          />
                        )}
                        <StatusBadge
                          type="suspended"
                          status={user.is_suspended}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                        title="View Details"
                      >
                        <HiOutlineEye size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUsers;
