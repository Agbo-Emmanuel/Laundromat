import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineEye, HiOutlineEyeOff, HiArrowRight } from "react-icons/hi";
import { toast } from "react-toastify";
import { register } from "../services/auth.service";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName) return toast.error("Full Name is required");
    if (!formData.email) return toast.error("Email is required");
    if (!formData.phoneNumber) return toast.error("Phone Number is required");
    if (!formData.password) return toast.error("Password is required");
    if (!formData.confirmPassword)
      return toast.error("Confirm Password is required");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      await register(formData);
      toast.success("Registration Successfull");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      setLoading(false);
      console.log("register error", error);
      if (error.message === "Network Error") {
        toast.error("Network Error, please check your internet connection");
      } else {
        toast.error(error?.response?.data?.detail || "register failed");
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Register</h1>
          <p className="text-[#187099]/90 text-sm">
            Register to manage your Laundry.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            variants={fieldVariants}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <label className={labelClasses}>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </motion.div>

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
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <label className={labelClasses}>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="090xxxxxxxx"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClasses}
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
            custom={1}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-gray-900 text-sm font-semibold">
                Confirm Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`${inputClasses} pr-11`}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-700 transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <HiOutlineEyeOff size={19} />
                ) : (
                  <HiOutlineEye size={19} />
                )}
              </button>
            </div>
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
              className={`w-full py-3.5 bg-[#1E88C7] text-white font-semibold rounded-xl hover:bg-[#187099] transition-colors duration-200 shadow-md shadow-[#187099]/10 flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register
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

export default Register;
