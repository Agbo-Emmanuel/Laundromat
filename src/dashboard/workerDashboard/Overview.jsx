import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlinePlusCircle,
  HiOutlineEye,
  HiOutlineInboxIn,
} from "react-icons/hi";
import { getWorkerDashboardStats } from "../../services/user.service";
import { getAllOrders } from "../../services/order.service";

// Mock data — replace with real API call (e.g. GET /orders?worker=me&status=pending)
const MOCK_PENDING_ORDERS = [
  {
    id: "ORD-1042",
    customer: "Amaka Johnson",
    service: "Wash & Fold",
    items: 12,
    dueDate: "2026-08-03",
    status: "Awaiting Pickup",
  },
  {
    id: "ORD-1041",
    customer: "Tunde Bakare",
    service: "Dry Cleaning",
    items: 5,
    dueDate: "2026-08-02",
    status: "In Progress",
  },
  {
    id: "ORD-1039",
    customer: "Chiamaka Obi",
    service: "Wash & Iron",
    items: 8,
    dueDate: "2026-08-04",
    status: "Ready for Delivery",
  },
  {
    id: "ORD-1037",
    customer: "David Eze",
    service: "Wash & Fold",
    items: 20,
    dueDate: "2026-08-02",
    status: "In Progress",
  },
];

const statusStyles = {
  "Awaiting Pickup": "bg-[#FDF3E4] text-[#9A6413]",
  "In Progress": "bg-[#E6F1FB] text-[#0C447C]",
  "Ready for Delivery": "bg-[#E9F7EE] text-[#0F8F5F]",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const Overview = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    totalOrders: 0,
    completedOrders: 0,
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const response = await getWorkerDashboardStats();
        setIsLoading(false);
        setStats(response.data);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchAllOrders = async () => {
      setIsLoading(true);
      try {
        const response = await getAllOrders();
        setIsLoading(false);
        setOrders(response.data);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    fetchAllOrders();
  }, []);

  const statCards = [
    {
      label: "Pending orders",
      value: isLoading ? (
        <span className="inline-block w-10 h-6 bg-[#EFF8FE] rounded animate-pulse" />
      ) : (
        stats.pendingOrders
      ),
      icon: <HiOutlineClock size={22} />,
    },
    {
      label: "Total orders",
      value: isLoading ? (
        <span className="inline-block w-10 h-6 bg-[#EFF8FE] rounded animate-pulse" />
      ) : (
        stats.totalOrders
      ),
      icon: <HiOutlineClipboardList size={22} />,
    },
    {
      label: "Completed orders",
      value: isLoading ? (
        <span className="inline-block w-10 h-6 bg-[#EFF8FE] rounded animate-pulse" />
      ) : (
        stats.completedOrders
      ),
      icon: <HiOutlineCheckCircle size={22} />,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#0B2540]">Overview</h1>
          <p className="text-sm text-[#5B7A93] mt-1">
            Here's what's happening with your orders today.
          </p>
        </div>
        <button
          onClick={() => navigate("/worker/dashboard/create-order")}
          className="flex items-center cursor-pointer justify-center gap-2 bg-[#1E88C7] hover:bg-[#187099] transition-colors duration-200 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-[#1E88C7]/30 active:scale-[0.98]"
        >
          <HiOutlinePlusCircle size={20} />
          Create order
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-[#E1F1FB] rounded-2xl p-5 flex items-center gap-4 hover:border-[#BFE2F7] transition-colors duration-200"
          >
            <div className="w-11 h-11 rounded-full bg-[#EFF8FE] text-[#1E88C7] flex items-center justify-center flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-[#5B7A93]">{stat.label}</p>
              <p className="text-2xl font-bold text-[#0B2540] mt-0.5">
                {isLoading ? (
                  <span className="inline-block w-10 h-6 bg-[#EFF8FE] rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Pending Orders Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-[#E1F1FB] rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E1F1FB]">
          <div>
            <h2 className="text-base font-semibold text-[#0B2540]">
              Pending orders
            </h2>
            <p className="text-xs text-[#5B7A93] mt-0.5">
              Orders that still need action from you.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-[#F4FAFE] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : MOCK_PENDING_ORDERS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-5 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EFF8FE] text-[#1E88C7] flex items-center justify-center mb-3">
              <HiOutlineInboxIn size={22} />
            </div>
            <p className="text-sm font-semibold text-[#0B2540]">
              No pending orders
            </p>
            <p className="text-xs text-[#5B7A93] mt-1 max-w-xs">
              New orders you create or get assigned will show up here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-[#5B7A93] bg-[#F8FBFE]">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Due date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PENDING_ORDERS.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="border-t border-[#EEF6FC] hover:bg-[#F8FBFE] transition-colors duration-150"
                  >
                    <td className="px-5 py-3.5 font-medium text-[#0B2540]">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5 text-[#33526A]">
                      {order.customer}
                    </td>
                    <td className="px-5 py-3.5 text-[#33526A]">
                      {order.service}
                    </td>
                    <td className="px-5 py-3.5 text-[#33526A]">
                      {order.items}
                    </td>
                    <td className="px-5 py-3.5 text-[#33526A]">
                      {new Date(order.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusStyles[order.status] ??
                          "bg-[#F0F4F8] text-[#4C6A80]"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() =>
                          navigate(`/worker/dashboard/orders/${order.id}`)
                        }
                        className="inline-flex cursor-pointer items-center gap-1.5 text-[#1E88C7] hover:text-[#187099] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#EFF8FE] transition-colors duration-150"
                      >
                        <HiOutlineEye size={16} />
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Overview;
