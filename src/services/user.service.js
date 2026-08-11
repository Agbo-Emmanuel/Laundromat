import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

export const getUserMe = async () => {
  const response = await api.get(ENDPOINTS.GET_USER_ME);
  return response.data;
};

export const updateUserMe = async (payload) => {
  const response = await api.patch(ENDPOINTS.UPDATE_USER_ME, payload);
  return response.data;
};

export const getWorkerDashboardStats = async () => {
  const response = await api.get(ENDPOINTS.GET_WORKER_DASHBOARD_STATS);
  return response.data;
};
