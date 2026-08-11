export const ENDPOINTS = {
  // Auth
  REGISTER: "/api/auth/signup",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",

  //Admin
  GET_ALL_USERS: "/api/admin/users",
  GET_USER_BY_ID: (user_id) => `/api/admin/users/${user_id}`,
  GET_ADMIN_DASHBOARD_STATS: "/api/admin/dashboard-stats",

  //Workers
  GET_USER_ME: "/api/users/me",
  UPDATE_USER_ME: "/api/users/me",
  GET_WORKER_DASHBOARD_STATS: "/api/worker/dashboard-stats",

  //orders
  CREATE_ORDER: "/api/create-order",
  GET_ALL_ORDERS: "/api/orders",
  GET_ORDER: (orderId) => `/api/orders/${orderId}`,
  UPDATE_ORDER_STATUS: (orderId) => `/api/orders/${orderId}`,
};
