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
import UserProfile from "../components/UserProfile";
import {
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCash,
  HiOutlineReceiptTax,
  HiOutlineArrowRight,
} from "react-icons/hi";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "../../services/admin.service";
import { formatMoney } from "../../utils/formatMoney";

const BRAND = "#1E88C7";

const STATUS_COLORS = {
  Pending: "#1E88C7",
  "In Progress": "#63B3D9",
  Completed: "#0F5C82",
  Cancelled: "#CBD5E1",
};

const STATUS_BADGE = {
  Pending: "bg-[#1E88C7]/10 text-[#1E88C7]",
  "In Progress": "bg-sky-50 text-sky-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Cancelled: "bg-gray-100 text-gray-500",
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
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await getAdminDashboardStats();
  //       const data = response?.data || response;
  //       setStats(data || null);
  //     } catch (err) {
  //       console.error("Error fetching admin stats:", err);
  //       setError("Failed to load dashboard stats.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStats();
  // }, []);

  const revenueTrend = stats?.revenue_trend || [];
  const orderStatusBreakdown = stats?.order_status_breakdown || [];
  const recentOrders = stats?.recent_orders || [];
  const topWorkers = stats?.top_workers || [];

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
        <UserProfile role="admin" />
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
              value={stats?.total_orders || 0}
              title="Total Orders"
            />
            <StatCard
              icon={<HiOutlineClock size={24} color={BRAND} />}
              subtext="Pending orders"
              value={stats?.pending_orders || 0}
              title="Pending Orders"
            />
            <StatCard
              icon={<HiOutlineCheckCircle size={24} color={BRAND} />}
              subtext="Completed orders"
              value={stats?.completed_orders || 0}
              title="Completed Orders"
            />
            <StatCard
              icon={<HiOutlineUserGroup size={24} color={BRAND} />}
              subtext="Registered workers"
              value={stats?.total_users || 0}
              title="Total Workers"
            />
            <StatCard
              icon={<HiOutlineCash size={24} color={BRAND} />}
              subtext="Total balance"
              value={formatMoney(stats?.total_balance) || 0}
              title="Total Balance"
            />
            <StatCard
              icon={<HiOutlineReceiptTax size={24} color={BRAND} />}
              subtext="Platform commission"
              value={formatMoney(stats?.total_commission) || 0}
              title="Total Commission"
            />
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
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
              <SectionHeader
                eyebrow="Activity"
                title="Recent Orders"
                action={
                  <button className="text-sm font-medium text-[#1E88C7] flex items-center gap-1 hover:gap-2 transition-all">
                    View all <HiOutlineArrowRight size={16} />
                  </button>
                }
              />
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-400 text-xs uppercase tracking-wide">
                        <th className="font-medium px-2 pb-3">Order</th>
                        <th className="font-medium px-2 pb-3">Customer</th>
                        <th className="font-medium px-2 pb-3">Amount</th>
                        <th className="font-medium px-2 pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-2 py-3 font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-2 py-3 text-gray-600">
                            {order.customer_name}
                          </td>
                          <td className="px-2 py-3 text-gray-600">
                            {formatMoney(order.amount)}
                          </td>
                          <td className="px-2 py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                STATUS_BADGE[order.status] ||
                                "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-[160px] flex items-center justify-center text-sm text-gray-400">
                  No recent orders.
                </div>
              )}
            </div>

            {/* Top Workers */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <SectionHeader eyebrow="Team" title="Top Workers" />
              {topWorkers.length > 0 ? (
                <div className="space-y-4">
                  {topWorkers.map((worker, i) => (
                    <div key={worker.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1E88C7]/10 text-[#1E88C7] flex items-center justify-center text-sm font-semibold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {worker.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {worker.completed_orders} orders completed
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatMoney(worker.earnings)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[160px] flex items-center justify-center text-sm text-gray-400">
                  No worker activity yet.
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
