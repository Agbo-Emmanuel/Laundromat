import { api } from "../api/api";
import { ENDPOINTS } from "../api/endpoint";

export const login = async (payload) => {
  const response = await api.post(ENDPOINTS.LOGIN, payload);
  return response.data;
};

export const logout = async (clearCookies) => {
  try {
    await api.post(ENDPOINTS.LOGOUT);
  } finally {
    if (typeof clearCookies === "function") clearCookies();
    window.location.href = "/login";
  }
};

export const forgotPassword = async (payload) => {
  const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, null, {
    params: {
      email: payload.email,
    },
  });
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await api.post(ENDPOINTS.RESET_PASSWORD, null, {
    params: {
      email: payload.email,
      otp: payload.otp,
      new_password: payload.newPassword,
    },
  });
  return response.data;
};
