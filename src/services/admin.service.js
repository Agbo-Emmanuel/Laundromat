import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

export const getAllUsers = async () => {
  const response = await api.get(ENDPOINTS.GET_ALL_USERS);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(ENDPOINTS.GET_USER_BY_ID(id));
  return response.data;
};

export const getAdminDashboardStats = async () => {
  const response = await api.get(ENDPOINTS.GET_ADMIN_DASHBOARD_STATS);
  return response.data;
};
