import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

export const createOrder = async (payload) => {
  const response = await api.post(`${ENDPOINTS.CREATE_ORDER}`, payload);
  return response.data;
};

export const getAllOrders = async (status = "") => {
  const response = await api.get(
    `${ENDPOINTS.GET_ALL_ORDERS}?status=${status}`,
  );
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`${ENDPOINTS.GET_ORDER(orderId)}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(
    `${ENDPOINTS.UPDATE_ORDER_STATUS(orderId)}`,
    { status },
  );
  return response.data;
};
