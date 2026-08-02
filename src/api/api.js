import axios from "axios";
import { BASE_URL } from "../config/apiConfig";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s to handle Render cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.data === "Invalid or expired token") {
      const cookies = new Cookies();
      cookies.remove("userData", { path: "/" });
      cookies.remove("token", { path: "/" });
      window.location.href = "/";
      toast.error("Session Expired, Please Login Again");
    }

    return Promise.reject(error);
  },
);
