import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiArrowRight,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { login } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  //   const [, setCookie] = useCookies(["userData", "token"]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) return toast.error("Your Email is required");
    if (!formData.password) return toast.error("Password is required");

    try {
      setLoading(true);
      const response = await login(formData);
      toast.success("Login Successful");

      // Cookie options: if rememberMe is checked, persist for 7 days; otherwise session cookie
      const cookieOptions = formData.rememberMe
        ? { path: "/", maxAge: 7 * 24 * 60 * 60 } // 7 days in seconds
        : { path: "/" }; // session cookie — deleted when browser closes

      //   setCookie("userData", response?.user, cookieOptions);
      //   setCookie("token", response?.access_token, cookieOptions);

      const userRole = response?.user?.role;

      // Small delay so the success toast is visible before we navigate away —
      // keeps the transition from feeling abrupt.
      setTimeout(() => {
        if (userRole == "user") {
          navigate("/fundraiser/dashboard/overview");
        } else {
          navigate("/admin/dashboard/overview");
        }
      }, 400);
    } catch (error) {
      setLoading(false);
      console.log("login error", error);
      if (error.message === "Network Error") {
        toast.error("Network Error, please check your internet connection");
      } else {
        toast.error(error?.response?.data?.detail || "Login failed");
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", delay: 0.1 + i * 0.07 },
    }),
  };

  const inputClasses =
    "w-full bg-[#F7F8F7] text-gray-900 placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-700/40 focus:border-emerald-700/60 transition-all duration-200";
  const labelClasses = "block text-gray-900 text-sm font-semibold mb-2";

  return (
    <div className="min-h-screen bg-[#F4F5F3] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      {/* <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-8 cursor-pointer"
      >
        <img
          src={aidra_icon}
          alt="Aidra Logo"
          className="w-9 h-9 object-contain"
        />
        <div className="text-gray-900 text-xl font-bold">
          Aid<span className="text-emerald-700">ra</span>
        </div>
      </motion.div> */}

      {/* Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] p-8 sm:p-10"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">
            Welcome back
          </h1>
          <p className="text-emerald-700/90 text-sm">
            Sign in to manage your Laundry.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            variants={fieldVariants}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <label className={labelClasses}>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              autoComplete="email"
              required
            />
          </motion.div>

          <motion.div
            variants={fieldVariants}
            custom={1}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-900 text-sm font-semibold">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-emerald-700 text-sm font-medium hover:text-emerald-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputClasses} pr-11`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <HiOutlineEyeOff size={19} />
                ) : (
                  <HiOutlineEye size={19} />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fieldVariants}
            custom={2}
            initial="hidden"
            animate="visible"
          >
            <label className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer w-fit">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-emerald-700 focus:ring-emerald-700/40"
              />
              Remember me
            </label>
          </motion.div>

          <motion.div
            variants={fieldVariants}
            custom={3}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 bg-emerald-800 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors duration-200 shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <HiArrowRight size={18} />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* <div className="flex items-center gap-3 pt-1">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-700 font-semibold hover:text-emerald-800 hover:underline transition-colors"
            >
              Create one free
            </Link>
          </p> */}
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
