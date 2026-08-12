import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCash,
  HiOutlineReceiptTax,
  HiOutlineArrowRight,
  HiOutlineEye,
  HiOutlineInboxIn,
  HiOutlineRefresh,
  HiOutlineTruck,
} from "react-icons/hi";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "../../services/admin.service";
import { formatMoney } from "../../utils/formatMoney";
import { getAllOrders } from "../../services/order.service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

const BRAND = "#1E88C7";

const STATUS_COLORS = {
  Pending: "#1E88C7",
  "In Progress": "#63B3D9",
  Completed: "#0F5C82",
  Cancelled: "#CBD5E1",
};

const STATUS_META = {
  pending: {
    icon: HiOutlineClock,
    className: "bg-[#FDF3E0] text-[#9A6413]",
    label: "Pending",
  },
  "in-progress": {
    icon: HiOutlineRefresh,
    className: "bg-[#E6F1FB] text-[#0C447C]",
    label: "In Progress",
  },
  "awaiting-pickup": {
    icon: HiOutlineTruck,
    className: "bg-[#F1EAFC] text-[#6B3FB8]",
    label: "Awaiting Pickup",
  },
  completed: {
    icon: HiOutlineCheckCircle,
    className: "bg-[#E9F7EE] text-[#0F8F5F]",
    label: "Completed",
  },
};

const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] ?? {
    icon: HiOutlineClock,
    className: "bg-[#F0F4F8] text-[#4C6A80]",
    label: status ?? "Unknown",
  };
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${meta.className}`}
    >
      <Icon size={13} />
      {meta.label}
    </span>
  );
};

const StatCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse space-y-4">
    <div className="w-10 h-10 rounded-xl bg-gray-100" />
    <div className="h-6 w-20 bg-gray-100 rounded" />
    <div className="h-3 w-28 bg-gray-100 rounded" />
  </div>
);

const SectionSkeleton = ({ className = "" }) => (
  <div
    className={`bg-white border border-gray-200 rounded-2xl p-6 animate-pulse space-y-4 ${className}`}
  >
    <div className="h-4 w-32 bg-gray-100 rounded" />
    <div className="h-40 w-full bg-gray-50 rounded-xl" />
  </div>
);

const SectionHeader = ({ eyebrow, title, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div>
      <p className="text-xs font-semibold tracking-wide text-[#1E88C7] uppercase">
        {eyebrow}
      </p>
      <h2 className="text-lg font-semibold text-gray-900 mt-0.5">{title}</h2>
    </div>
    {action}
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const AdminOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAdminDashboardStats();
        const data = response?.data || response;
        setStats(data || null);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setIsOrdersLoading(true);
      try {
        const response = await getAllOrders();
        setRecentOrders(response.data ?? []);
      } catch (error) {
        toast.error(error.message || "Couldn't load recent orders.");
      } finally {
        setIsOrdersLoading(false);
      }
    };
    fetchRecentOrders();
  }, []);

  const revenueTrend = stats?.revenueTrend || [];
  const orderStatusBreakdown = stats?.orderStatusBreakdown || [];

  return (
    <div className="space-y-8 pb-10 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Platform Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track orders, workers, and revenue across your laundromat network.
          </p>
        </div>
      </div>

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SectionSkeleton className="lg:col-span-2" />
            <SectionSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SectionSkeleton className="lg:col-span-2" />
            <SectionSkeleton />
          </div>
        </>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <StatCard
              icon={<HiOutlineClipboardList size={24} color={BRAND} />}
              subtext="Total Orders"
              value={stats?.totalOrders || 0}
              title="Total Orders"
            />
            <StatCard
              icon={<HiOutlineClock size={24} color={BRAND} />}
              subtext="Pending orders"
              value={stats?.pendingOrders || 0}
              title="Pending Orders"
            />
            <StatCard
              icon={<HiOutlineCheckCircle size={24} color={BRAND} />}
              subtext="Completed orders"
              value={stats?.completedOrders || 0}
              title="Completed Orders"
            />
            <StatCard
              icon={<HiOutlineUserGroup size={24} color={BRAND} />}
              subtext="Registered workers"
              value={stats?.totalWorkers || 0}
              title="Total Workers"
            />
            <StatCard
              icon={<HiOutlineCash size={24} color={BRAND} />}
              subtext="Total balance"
              value={formatMoney(stats?.totalBalance) || 0}
              title="Total Balance"
            />
            {/* <StatCard
              icon={<HiOutlineReceiptTax size={24} color={BRAND} />}
              subtext="Platform commission"
              value={formatMoney(stats?.total_commission) || 0}
              title="Total Commission"
            /> */}
          </motion.div>

          {/* Revenue + Order Status */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            {/* Revenue Trend */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
              <SectionHeader eyebrow="Revenue" title="Revenue Trend" />
              {revenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={revenueTrend}>
                    <defs>
                      <linearGradient
                        id="revenueFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={BRAND}
                          stopOpacity={0.25}
                        />
                        <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F1F5F9"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => formatMoney(value)}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E5E7EB",
                        fontSize: 13,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={BRAND}
                      strokeWidth={2.5}
                      fill="url(#revenueFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[240px] flex items-center justify-center text-sm text-gray-400">
                  No revenue data yet.
                </div>
              )}
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <SectionHeader eyebrow="Orders" title="Status Breakdown" />
              {orderStatusBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={orderStatusBreakdown}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {orderStatusBreakdown.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={STATUS_COLORS[entry.status] || "#CBD5E1"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #E5E7EB",
                          fontSize: 13,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {orderStatusBreakdown.map((entry, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2 text-gray-600">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                STATUS_COLORS[entry.status] || "#CBD5E1",
                            }}
                          />
                          {entry.status}
                        </span>
                        <span className="font-medium text-gray-900">
                          {entry.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[160px] flex items-center justify-center text-sm text-gray-400">
                  No order data yet.
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Orders + Top Workers */}
          <motion.div variants={itemVariants} className="w-full gap-4">
            {/* Recent Orders */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <SectionHeader
                eyebrow="Activity"
                title="Recent Orders"
                action={
                  <button className="text-sm font-medium text-[#1E88C7] flex items-center gap-1 hover:gap-2 transition-all">
                    View all <HiOutlineArrowRight size={16} />
                  </button>
                }
              />
              {isOrdersLoading ? (
                <div className="p-5 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-12 bg-[#F4FAFE] rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
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
                        <th className="px-5 py-3">Order Code</th>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Service</th>
                        <th className="px-5 py-3">Items</th>
                        <th className="px-5 py-3">Price</th>
                        <th className="px-5 py-3">Pickup date</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, i) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          onClick={() =>
                            navigate(`/admin/dashboard/orders/${order._id}`)
                          }
                          className="border-t border-[#EEF6FC] hover:bg-[#F8FBFE] transition-colors duration-150 cursor-pointer"
                        >
                          <td className="px-5 py-3.5 font-medium text-[#0B2540]">
                            {order.orderCode}
                          </td>
                          <td className="px-5 py-3.5 text-[#33526A]">
                            {order.customerName}
                          </td>
                          <td className="px-5 py-3.5 text-[#33526A]">
                            {order.service}
                          </td>
                          <td className="px-5 py-3.5 text-[#33526A]">
                            {order.numberOfItems}
                          </td>
                          <td className="px-5 py-3.5 text-[#33526A] font-medium">
                            {formatMoney(order.price)}
                          </td>
                          <td className="px-5 py-3.5 text-[#33526A]">
                            {formatDate(order.pickupDate)}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/admin/dashboard/orders/${order._id}`,
                                );
                              }}
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminOverview;
