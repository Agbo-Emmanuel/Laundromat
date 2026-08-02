import { motion } from "framer-motion";
import UserProfile from "../fundraiserDashboard/components/UserProfile";
import {
  HiOutlineSpeakerphone,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineCurrencyDollar,
  HiOutlineCash,
  HiOutlineReceiptTax,
} from "react-icons/hi";
import StatCard from "../fundraiserDashboard/components/StatCard";
import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "../../services/admin.service";
import { formatMoney } from "../../utils/formatMoney";

const StatCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse space-y-4">
    <div className="w-10 h-10 rounded-xl bg-gray-100" />
    <div className="h-6 w-20 bg-gray-100 rounded" />
    <div className="h-3 w-28 bg-gray-100 rounded" />
  </div>
);

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="space-y-8 pb-10 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <UserProfile role="admin" />
      </div>

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <StatCard
            icon={<HiOutlineSpeakerphone size={24} />}
            subtext={`${stats?.published_campaigns || 0} published campaigns`}
            value={stats?.total_campaigns || 0}
            title="Campaigns"
          />
          <StatCard
            icon={<HiOutlineCurrencyDollar size={24} />}
            subtext={`${stats?.total_donations || 0} donations`}
            value={formatMoney(stats?.total_donated)}
            title="Total Donated"
          />
          <StatCard
            icon={<HiOutlineUserGroup size={24} />}
            subtext="Registered users"
            value={stats?.total_users || 0}
            title="Total Users"
          />
          <StatCard
            icon={<HiOutlineIdentification size={24} />}
            subtext="Awaiting review (KYC)"
            value={stats?.pending_kyc || 0}
            title="Pending KYC"
          />
          <StatCard
            icon={<HiOutlineCash size={24} />}
            subtext="Awaiting approval (WITHDRAWALS)"
            value={stats?.pending_withdrawals || 0}
            title="Pending Withdrawals"
          />
          <StatCard
            icon={<HiOutlineReceiptTax size={24} />}
            subtext="Platform revenue"
            value={formatMoney(stats?.total_fees_collected)}
            title="Fees Collected"
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Placeholder */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Platform Activity
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 animate-pulse"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    <div className="h-2.5 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 transition-colors duration-200 hover:bg-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                    <HiOutlineSpeakerphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">
                      New campaign created: "Help Build a School"
                    </p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
