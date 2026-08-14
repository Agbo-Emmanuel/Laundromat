import { useMemo, useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatMoney } from "../../utils/formatMoney";

const BRAND = "#1E88C7";

const RANGE_OPTIONS = [
  { key: "monthly", label: "Monthly" },
  { key: "weekly", label: "Weekly" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const { revenue, orderCount } = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm text-sm">
      <p className="font-semibold text-[#0B2540]">{label}</p>
      <p className="text-[#1E88C7] font-medium mt-1">{formatMoney(revenue)}</p>
      <p className="text-xs text-[#5B7A93] mt-0.5">
        {orderCount} order{orderCount === 1 ? "" : "s"}
      </p>
    </div>
  );
};

const RangeToggle = ({ active, onChange }) => (
  <div className="inline-flex items-center bg-[#F1F5F9] rounded-full p-1">
    {RANGE_OPTIONS.map((opt) => (
      <button
        key={opt.key}
        onClick={() => onChange(opt.key)}
        className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          active === opt.key
            ? "bg-white text-[#0C447C] shadow-sm"
            : "text-[#5B7A93] hover:text-[#0C447C]"
        }`}
      >
        {opt.label}
      </button>
    ))}
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

/**
 * revenueTrend shape:
 * {
 *   monthly: [{ revenue, orderCount, year, month, label }],
 *   weekly:  [{ revenue, orderCount, year, week, label }],
 * }
 */
const RevenueTrendCard = ({ revenueTrend }) => {
  const [range, setRange] = useState("monthly");

  const data = useMemo(
    () => revenueTrend?.[range] ?? [],
    [revenueTrend, range],
  );

  const totalRevenue = useMemo(
    () => data.reduce((sum, d) => sum + (d.revenue || 0), 0),
    [data],
  );

  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
      <SectionHeader
        eyebrow="Revenue"
        title="Revenue Trend"
        action={<RangeToggle active={range} onChange={setRange} />}
      />

      {data.length > 0 ? (
        <>
          <p className="text-sm text-[#5B7A93] mb-4">
            Total for period:{" "}
            <span className="font-semibold text-[#0B2540]">
              {formatMoney(totalRevenue)}
            </span>
          </p>

          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={0.28} />
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
                tickFormatter={(v) => formatMoney(v)}
                width={64}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* light blue shadow fill under the line */}
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="none"
                fill="url(#revenueFill)"
                isAnimationActive
                animationDuration={500}
              />

              {/* crisp blue line on top */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={BRAND}
                strokeWidth={2.5}
                dot={{ r: 3, fill: BRAND, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive
                animationDuration={500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="h-[240px] flex items-center justify-center text-sm text-gray-400">
          No revenue data yet.
        </div>
      )}
    </div>
  );
};

export default RevenueTrendCard;
