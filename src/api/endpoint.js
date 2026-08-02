export const ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",

  //Admin
  GET_ALL_USERS: "/api/admin/users",
  GET_USER_BY_ID: (user_id) => `/api/admin/users/${user_id}`,

  // Dashboard
  GET_DASHBOARD_STATS: "/api/dashboard",

  //Users
  GET_USER_ME: "/api/users/me",
  UPDATE_USER_ME: "/api/users/me",
};
