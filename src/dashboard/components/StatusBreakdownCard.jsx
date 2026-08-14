import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const STATUS_COLORS = {
  pending: "#1E88C7",
  "awaiting-pickup": "#F0A93C",
  completed: "#0F8F5F",
};

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

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { label, count } = payload[0].payload;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 shadow-sm text-sm">
      <p className="font-semibold text-[#0B2540]">{label}</p>
      <p className="text-xs text-[#5B7A93] mt-0.5">
        {count} order{count === 1 ? "" : "s"}
      </p>
    </div>
  );
};

/**
 * orderStatusBreakdown shape:
 * [{ status: "pending", label: "Pending", count: 2 }, ...]
 */
const StatusBreakdownCard = ({ orderStatusBreakdown = [] }) => {
  const total = useMemo(
    () => orderStatusBreakdown.reduce((sum, d) => sum + (d.count || 0), 0),
    [orderStatusBreakdown],
  );

  const hasData = total > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <SectionHeader eyebrow="Orders" title="Status Breakdown" />

      {hasData ? (
        <>
          <div className="relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={orderStatusBreakdown}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  isAnimationActive
                  animationDuration={500}
                >
                  {orderStatusBreakdown.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || "#CBD5E1"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center total, overlaid on the donut */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold text-[#0B2540]">
                {total}
              </span>
              <span className="text-[11px] text-[#5B7A93]">orders</span>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {orderStatusBreakdown.map((entry) => (
              <div
                key={entry.status}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-gray-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: STATUS_COLORS[entry.status] || "#CBD5E1",
                    }}
                  />
                  {entry.label}
                </span>
                <span className="font-medium text-gray-900">{entry.count}</span>
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
  );
};

export default StatusBreakdownCard;
