import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineInboxIn,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClock,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineXCircle,
  HiOutlinePlusCircle,
  HiOutlineX,
} from "react-icons/hi";

// Mock data — replace with a real API call (e.g. GET /orders?worker=me&page=&status=&q=)
const MOCK_ORDERS = [
  {
    id: "ORD-1042",
    customer: "Amaka Johnson",
    service: "Wash & Fold",
    items: 12,
    price: 6000,
    dueDate: "2026-08-03",
    status: "Pending",
  },
  {
    id: "ORD-1041",
    customer: "Tunde Bakare",
    service: "Dry Cleaning",
    items: 5,
    price: 8500,
    dueDate: "2026-08-02",
    status: "In Progress",
  },
  {
    id: "ORD-1039",
    customer: "Chiamaka Obi",
    service: "Wash & Iron",
    items: 8,
    price: 5200,
    dueDate: "2026-08-04",
    status: "Ready for Pickup",
  },
  {
    id: "ORD-1037",
    customer: "David Eze",
    service: "Wash & Fold",
    items: 20,
    price: 11000,
    dueDate: "2026-08-02",
    status: "In Progress",
  },
  {
    id: "ORD-1034",
    customer: "Fatima Bello",
    service: "Dry Cleaning",
    items: 3,
    price: 4500,
    dueDate: "2026-07-30",
    status: "Completed",
  },
  {
    id: "ORD-1031",
    customer: "Ifeoma Nwosu",
    service: "Wash & Iron",
    items: 10,
    price: 6800,
    dueDate: "2026-07-29",
    status: "Completed",
  },
  {
    id: "ORD-1028",
    customer: "Segun Adekunle",
    service: "Wash & Fold",
    items: 6,
    price: 3600,
    dueDate: "2026-07-28",
    status: "Cancelled",
  },
  {
    id: "ORD-1025",
    customer: "Grace Umeh",
    service: "Dry Cleaning",
    items: 4,
    price: 5000,
    dueDate: "2026-07-27",
    status: "Completed",
  },
  {
    id: "ORD-1023",
    customer: "Kelechi Nnamdi",
    service: "Wash & Iron",
    items: 9,
    price: 6100,
    dueDate: "2026-07-26",
    status: "Completed",
  },
  {
    id: "ORD-1021",
    customer: "Blessing Okoro",
    service: "Wash & Fold",
    items: 15,
    price: 8200,
    dueDate: "2026-08-05",
    status: "Pending",
  },
  {
    id: "ORD-1019",
    customer: "Emeka Chukwu",
    service: "Dry Cleaning",
    items: 2,
    price: 3200,
    dueDate: "2026-07-25",
    status: "Completed",
  },
  {
    id: "ORD-1017",
    customer: "Halima Yusuf",
    service: "Wash & Iron",
    items: 7,
    price: 4700,
    dueDate: "2026-08-06",
    status: "Ready for Pickup",
  },
];

const STATUS_FILTERS = [
  "All",
  "Pending",
  "In Progress",
  "Ready for Pickup",
  "Completed",
  "Cancelled",
];

const STATUS_META = {
  Pending: { icon: HiOutlineClock, className: "bg-[#FDF3E0] text-[#9A6413]" },
  "In Progress": {
    icon: HiOutlineRefresh,
    className: "bg-[#E6F1FB] text-[#0C447C]",
  },
  "Ready for Pickup": {
    icon: HiOutlineTruck,
    className: "bg-[#F1EAFC] text-[#6B3FB8]",
  },
  Completed: {
    icon: HiOutlineCheckCircle,
    className: "bg-[#E9F7EE] text-[#0F8F5F]",
  },
  Cancelled: {
    icon: HiOutlineXCircle,
    className: "bg-[#FBEAE9] text-[#B23A34]",
  },
};

const PAGE_SIZE = 7;

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const currency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "—";

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] ?? {
    icon: HiOutlineClock,
    className: "bg-[#F0F4F8] text-[#4C6A80]",
  };
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Replace with real API call, e.g. GET /orders?worker=me
    const timer = setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Reset to page 1 whenever the active filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUS_FILTERS.slice(1).forEach((status) => {
      counts[status] = orders.filter((o) => o.status === status).length;
    });
    return counts;
  }, [orders]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#0B2540]">Orders</h1>
          <p className="text-sm text-[#5B7A93] mt-1">
            Every order you've logged, in one place.
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

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-[#E1F1FB] rounded-2xl p-4 space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <HiOutlineSearch
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AB4C7]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name"
            className="w-full rounded-xl border border-[#DCEEFB] bg-white pl-10 pr-9 py-2.5 text-sm text-[#0B2540] placeholder:text-[#9AB4C7] outline-none transition-all duration-200 focus:border-[#1E88C7] focus:ring-4 focus:ring-[#E6F1FB]"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AB4C7] hover:text-[#5B7A93] transition-colors duration-150"
              >
                <HiOutlineX size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#1E88C7] text-white shadow-sm shadow-[#1E88C7]/30"
                    : "bg-[#F4FAFE] text-[#4C6A80] hover:bg-[#E6F1FB]"
                }`}
              >
                {status}
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20" : "bg-white text-[#7C99AF]"
                  }`}
                >
                  {statusCounts[status] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-[#E1F1FB] rounded-2xl overflow-hidden"
      >
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-[#F4FAFE] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-5 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EFF8FE] text-[#1E88C7] flex items-center justify-center mb-3">
              <HiOutlineInboxIn size={22} />
            </div>
            <p className="text-sm font-semibold text-[#0B2540]">
              No orders found
            </p>
            <p className="text-xs text-[#5B7A93] mt-1 max-w-xs">
              {search || statusFilter !== "All"
                ? "Try a different search term or status filter."
                : "Orders you create will show up here."}
            </p>
            {(search || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-xs font-semibold text-[#1E88C7] hover:text-[#187099] transition-colors duration-150"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-[#5B7A93] bg-[#F8FBFE]">
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Items</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">Due date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {paginatedOrders.map((order, i) => (
                      <motion.tr
                        key={order.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        onClick={() =>
                          navigate(`/worker/dashboard/orders/${order.id}`)
                        }
                        className="border-t border-[#EEF6FC] hover:bg-[#F8FBFE] transition-colors duration-150 cursor-pointer"
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
                        <td className="px-5 py-3.5 text-[#33526A] font-medium">
                          {currency(order.price)}
                        </td>
                        <td className="px-5 py-3.5 text-[#33526A]">
                          {formatDate(order.dueDate)}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/worker/dashboard/orders/${order.id}`);
                            }}
                            className="inline-flex cursor-pointer items-center gap-1.5 text-[#1E88C7] hover:text-[#187099] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#EFF8FE] transition-colors duration-150"
                          >
                            <HiOutlineEye size={16} />
                            View
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#EEF6FC] bg-[#F8FBFE]">
              <p className="text-xs text-[#5B7A93]">
                Showing{" "}
                <span className="font-semibold text-[#0B2540]">
                  {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filteredOrders.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#0B2540]">
                  {filteredOrders.length}
                </span>{" "}
                orders
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-[#4C6A80] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                >
                  <HiOutlineChevronLeft size={16} />
                </button>
                <span className="text-xs font-medium text-[#5B7A93] px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-[#4C6A80] hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                >
                  <HiOutlineChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Orders;
