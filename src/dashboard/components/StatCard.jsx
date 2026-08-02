import React from "react";

const StatCard = ({ icon, title, value, subtext, color = "green" }) => {
  const colorMap = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div
        className={`inline-flex p-2.5 rounded-xl mb-3 ${colorMap[color] || colorMap.green}`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-sm text-gray-500">{subtext || title}</p>
    </div>
  );
};

export default StatCard;
