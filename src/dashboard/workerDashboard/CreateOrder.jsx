import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineArrowLeft,
  HiOutlineClipboardCheck,
  HiOutlineTag,
  HiOutlineChevronDown,
} from "react-icons/hi";

const SERVICE_OPTIONS = ["Wash", "Wash & Iron", "Dry Cleaning"];

const INITIAL_FORM = {
  customerName: "",
  customerPhone: "",
  service: "",
  description: "",
  itemCount: "",
  price: "",
  dueDate: "",
};

const todayISO = () => new Date().toISOString().split("T")[0];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const CreateOrder = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const next = {};

    if (!form.customerName.trim()) {
      next.customerName = "Enter the customer's name.";
    }

    if (!form.customerPhone.trim()) {
      next.customerPhone = "Enter a WhatsApp number.";
    } else if (!/^[+]?[0-9\s-]{7,15}$/.test(form.customerPhone.trim())) {
      next.customerPhone = "Enter a valid phone number.";
    }

    if (!form.service) {
      next.service = "Select a service.";
    }

    if (!form.description.trim()) {
      next.description = "Describe the laundry items.";
    }

    if (!form.itemCount) {
      next.itemCount = "Enter the number of items.";
    } else if (Number(form.itemCount) <= 0) {
      next.itemCount = "Must be at least 1 item.";
    }

    if (!form.price) {
      next.price = "Enter a price.";
    } else if (Number(form.price) < 0) {
      next.price = "Price can't be negative.";
    }

    if (!form.dueDate) {
      next.dueDate = "Pick a due date.";
    } else if (form.dueDate < todayISO()) {
      next.dueDate = "Due date can't be in the past.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Check the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with real API call, e.g. POST /orders
      await new Promise((resolve) => setTimeout(resolve, 900));
      toast.success("Order created");
      setForm(INITIAL_FORM);
      navigate("/worker/dashboard/overview");
    } catch (err) {
      toast.error("Couldn't create the order. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedPrice = form.price
    ? Number(form.price).toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      })
    : null;

  const formattedDueDate = form.dueDate
    ? new Date(form.dueDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : null;

  const fieldClass = (hasError) =>
    `w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#0B2540] placeholder:text-[#9AB4C7] outline-none transition-all duration-200 focus:ring-4 ${
      hasError
        ? "border-[#E8A9A6] focus:border-[#D9615C] focus:ring-[#F9E2E1]"
        : "border-[#DCEEFB] focus:border-[#1E88C7] focus:ring-[#E6F1FB]"
    }`;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <button
          onClick={() => navigate("/worker/dashboard/overview")}
          className="p-2 rounded-lg text-[#4C6A80] hover:bg-[#F0F8FE] transition-colors duration-200"
        >
          <HiOutlineArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0B2540]">Create order</h1>
          <p className="text-sm text-[#5B7A93] mt-1">
            Fill in the details to log a new laundry order.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white border border-[#E1F1FB] rounded-2xl p-6 space-y-5"
        >
          {/* Customer name */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#0B2540] mb-1.5">
              <HiOutlineUser size={16} className="text-[#5B7A93]" />
              Customer name
            </label>
            <input
              type="text"
              value={form.customerName}
              onChange={handleChange("customerName")}
              placeholder="e.g. Amaka Johnson"
              className={fieldClass(errors.customerName)}
            />
            <AnimatePresence>
              {errors.customerName && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-[#C4433D] mt-1.5"
                >
                  {errors.customerName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Customer phone */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#0B2540] mb-1.5">
              <HiOutlinePhone size={16} className="text-[#5B7A93]" />
              Customer phone (WhatsApp)
            </label>
            <input
              type="tel"
              value={form.customerPhone}
              onChange={handleChange("customerPhone")}
              placeholder="+234 801 234 5678"
              className={fieldClass(errors.customerPhone)}
            />
            <AnimatePresence>
              {errors.customerPhone && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-[#C4433D] mt-1.5"
                >
                  {errors.customerPhone}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Service */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#0B2540] mb-1.5">
              <HiOutlineTag size={16} className="text-[#5B7A93]" />
              Service
            </label>
            <div className="relative">
              <select
                value={form.service}
                onChange={handleChange("service")}
                className={`${fieldClass(errors.service)} appearance-none pr-10 ${
                  form.service ? "" : "text-[#9AB4C7]"
                }`}
              >
                <option value="" disabled>
                  Select a service
                </option>
                {SERVICE_OPTIONS.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="text-[#0B2540]"
                  >
                    {option}
                  </option>
                ))}
              </select>
              <HiOutlineChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B7A93]"
              />
            </div>
            <AnimatePresence>
              {errors.service && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-[#C4433D] mt-1.5"
                >
                  {errors.service}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#0B2540] mb-1.5">
              <HiOutlineDocumentText size={16} className="text-[#5B7A93]" />
              Laundry description
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="e.g. 3 shirts, 2 trousers, 1 duvet — wash and iron"
              rows={3}
              className={`${fieldClass(errors.description)} resize-none`}
            />
            <AnimatePresence>
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-[#C4433D] mt-1.5"
                >
                  {errors.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Items + Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#0B2540] mb-1.5">
                <HiOutlineCube size={16} className="text-[#5B7A93]" />
                No. of items
              </label>
              <input
                type="number"
                min="1"
                value={form.itemCount}
                onChange={handleChange("itemCount")}
                placeholder="e.g. 12"
                className={fieldClass(errors.itemCount)}
              />
              <AnimatePresence>
                {errors.itemCount && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-[#C4433D] mt-1.5"
                  >
                    {errors.itemCount}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#0B2540] mb-1.5">
                <HiOutlineCurrencyDollar size={16} className="text-[#5B7A93]" />
                Price (₦)
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange("price")}
                placeholder="e.g. 5000"
                className={fieldClass(errors.price)}
              />
              <AnimatePresence>
                {errors.price && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-[#C4433D] mt-1.5"
                  >
                    {errors.price}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-[#0B2540] mb-1.5">
              <HiOutlineCalendar size={16} className="text-[#5B7A93]" />
              Due date
            </label>
            <input
              type="date"
              min={todayISO()}
              value={form.dueDate}
              onChange={handleChange("dueDate")}
              className={fieldClass(errors.dueDate)}
            />
            <AnimatePresence>
              {errors.dueDate && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-[#C4433D] mt-1.5"
                >
                  {errors.dueDate}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-[#1E88C7] hover:bg-[#187099] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm shadow-[#1E88C7]/30 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating order...
                </>
              ) : (
                <>
                  <HiOutlineClipboardCheck size={18} />
                  Create order
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setForm(INITIAL_FORM)}
              disabled={isSubmitting}
              className="text-sm font-medium text-[#5B7A93] hover:text-[#0B2540] transition-colors duration-200 px-4 py-2.5"
            >
              Clear
            </button>
          </div>
        </motion.form>

        {/* Live summary */}
        <motion.div
          variants={itemVariants}
          className="lg:sticky lg:top-8 bg-[#F4FAFE] border border-[#E1F1FB] rounded-2xl p-6"
        >
          <h2 className="text-sm font-semibold text-[#0B2540] mb-4">
            Order summary
          </h2>
          <div className="space-y-3.5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[#5B7A93]">Customer</span>
              <span className="text-[#0B2540] font-medium text-right">
                {form.customerName || "—"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-[#5B7A93]">WhatsApp</span>
              <span className="text-[#0B2540] font-medium text-right">
                {form.customerPhone || "—"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-[#5B7A93]">Service</span>
              <span className="text-[#0B2540] font-medium text-right">
                {form.service || "—"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-[#5B7A93]">Items</span>
              <span className="text-[#0B2540] font-medium text-right">
                {form.itemCount || "—"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-[#5B7A93]">Due</span>
              <span className="text-[#0B2540] font-medium text-right">
                {formattedDueDate || "—"}
              </span>
            </div>
            <div className="pt-3.5 border-t border-[#DCEEFB] flex items-center justify-between">
              <span className="text-[#5B7A93]">Price</span>
              <span className="text-lg font-bold text-[#1E88C7]">
                {formattedPrice || "₦0"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateOrder;
