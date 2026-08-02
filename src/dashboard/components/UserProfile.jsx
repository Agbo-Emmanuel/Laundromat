import React from "react";
import { useCookies } from "react-cookie";

const UserProfile = ({ role }) => {
  const [cookies] = useCookies(["userData"]);
  const user = cookies.userData;

  if (!user) return null;

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatName = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    if (names.length === 1) return names[0];
    const firstName = names[0];
    const initials = names
      .slice(1)
      .map((name) => `${name.charAt(0).toUpperCase()}.`)
      .join(" ");
    return `${firstName} ${initials}`;
  };

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm p-1.5 rounded-full pr-4 hover:shadow-md transition-shadow">
      {user.profile_image ? (
        <img
          src={user.profile_image}
          alt={user.full_name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-green-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {getInitials(user.full_name)}
        </div>
      )}
      <div className="hidden sm:block">
        <p className="text-gray-900 text-sm font-semibold leading-tight">
          {formatName(user.full_name)}
        </p>
        <p className="text-gray-400 text-[10px] capitalize">
          {role || user.account_type || "User"} Account
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
