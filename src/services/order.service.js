import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

export const getAllOrders = async (status = "") => {
  const response = await api.get(
    `${ENDPOINTS.GET_ALL_ORDERS}?status=${status}`,
  );
  return response.data;
};
