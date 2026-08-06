import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  HiOutlineTag,
  HiOutlineClock,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineTruck,
  HiOutlineXCircle,
  HiOutlineChevronRight,
  HiOutlineHashtag,
} from "react-icons/hi";

// ---- Status configuration ----------------------------------------------

const STATUS_FLOW = ["Pending", "In Progress", "Ready for Pickup", "Completed"];

const STATUS_META = {
  Pending: {
    icon: HiOutlineClock,
    color: "#B7791F",
    bg: "#FDF3E0",
    border: "#F3DCA6",
    description: "Order logged. Not started yet.",
  },
  "In Progress": {
    icon: HiOutlineRefresh,
    color: "#1E88C7",
    bg: "#E6F1FB",
    border: "#BFDFF6",
    description: "Being washed, ironed, or cleaned.",
  },
  "Ready for Pickup": {
    icon: HiOutlineTruck,
    color: "#7C4FD1",
    bg: "#F1EAFC",
    border: "#DCC9F7",
    description: "Finished. Waiting for the customer.",
  },
  Completed: {
    icon: HiOutlineCheckCircle,
    color: "#1E9E62",
    bg: "#E5F7EE",
    border: "#BCE9D3",
    description: "Picked up and closed out.",
  },
  Cancelled: {
    icon: HiOutlineXCircle,
    color: "#C4433D",
    bg: "#FBEAE9",
    border: "#F3C7C4",
    description: "Order cancelled.",
  },
};

// ---- Mock data (swap for a real GET /orders/:id) ------------------------

const MOCK_ORDER = {
  id: "ORD-10482",
  customerName: "Amaka Johnson",
  customerPhone: "+234 801 234 5678",
  service: "Wash & Iron",
  description: "3 shirts, 2 trousers, 1 duvet — wash and iron",
  itemCount: 6,
  price: 5000,
  dueDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  })(),
  status: "In Progress",
  createdAt: (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString();
  })(),
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const currency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });

const formatDate = (value, opts) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        ...opts,
      })
    : "—";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null); // status awaiting confirmation
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    // Replace with real API call, e.g. GET /orders/:order_id
    const timer = setTimeout(() => {
      if (!active) return;
      setOrder({ ...MOCK_ORDER, id: order_id || MOCK_ORDER.id });
      setIsLoading(false);
    }, 600);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [order_id]);

  const currentStepIndex = useMemo(() => {
    if (!order) return -1;
    return STATUS_FLOW.indexOf(order.status);
  }, [order]);

  const isCancelled = order?.status === "Cancelled";
  const isCompleted = order?.status === "Completed";
  const nextStatus =
    !isCancelled &&
    currentStepIndex > -1 &&
    currentStepIndex < STATUS_FLOW.length - 1
      ? STATUS_FLOW[currentStepIndex + 1]
      : null;

  const commitStatusChange = async (status) => {
    setIsUpdating(true);
    try {
      // Replace with real API call, e.g. PATCH /orders/:id { status }
      await new Promise((resolve) => setTimeout(resolve, 700));
      setOrder((prev) => ({ ...prev, status }));
      toast.success(
        status === "Cancelled" ? "Order cancelled" : `Marked as "${status}"`,
      );
    } catch (err) {
      toast.error("Couldn't update the order. Try again.");
    } finally {
      setIsUpdating(false);
      setPendingStatus(null);
      setShowCancelConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#E6F1FB]" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-[#E6F1FB] rounded" />
            <div className="h-3 w-56 bg-[#E6F1FB] rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white border border-[#E1F1FB] rounded-2xl" />
          <div className="h-80 bg-[#F4FAFE] border border-[#E1F1FB] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusMeta = STATUS_META[order.status] ?? STATUS_META.Pending;
  const StatusIcon = statusMeta.icon;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/worker/dashboard/orders")}
            className="p-2 rounded-lg text-[#4C6A80] hover:bg-[#F0F8FE] transition-colors duration-200 cursor-pointer"
          >
            <HiOutlineArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0B2540]">
                {order.customerName}'s order
              </h1>
            </div>
            <p className="flex items-center gap-1 text-sm text-[#5B7A93] mt-1">
              <HiOutlineHashtag size={14} />
              {order.id}
              <span className="mx-1 text-[#C4D9E9]">•</span>
              Logged {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <span
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
          style={{
            color: statusMeta.color,
            backgroundColor: statusMeta.bg,
            borderColor: statusMeta.border,
          }}
        >
          <StatusIcon size={14} />
          {order.status}
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Details card */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white border border-[#E1F1FB] rounded-2xl p-6 space-y-6"
        >
          <div>
            <h2 className="text-sm font-semibold text-[#0B2540] mb-4">
              Order details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DetailRow
                icon={HiOutlineUser}
                label="Customer"
                value={order.customerName}
              />
              <DetailRow
                icon={HiOutlinePhone}
                label="WhatsApp"
                value={order.customerPhone}
                href={`https://wa.me/${order.customerPhone.replace(/[^\d]/g, "")}`}
              />
              <DetailRow
                icon={HiOutlineTag}
                label="Service"
                value={order.service}
              />
              <DetailRow
                icon={HiOutlineCube}
                label="No. of items"
                value={order.itemCount}
              />
              <DetailRow
                icon={HiOutlineCurrencyDollar}
                label="Price"
                value={currency(order.price)}
                valueClass="text-[#1E88C7] font-bold"
              />
              <DetailRow
                icon={HiOutlineCalendar}
                label="Due date"
                value={formatDate(order.dueDate)}
              />
            </div>
          </div>

          <div className="pt-5 border-t border-[#EAF4FC]">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-[#0B2540] mb-2">
              <HiOutlineDocumentText size={16} className="text-[#5B7A93]" />
              Description
            </label>
            <p className="text-sm text-[#3D5972] bg-[#F8FCFF] border border-[#EAF4FC] rounded-xl px-4 py-3 leading-relaxed">
              {order.description}
            </p>
          </div>
        </motion.div>

        {/* Status panel */}
        <motion.div
          variants={itemVariants}
          className="lg:sticky lg:top-8 bg-[#F4FAFE] border border-[#E1F1FB] rounded-2xl p-6 space-y-6"
        >
          <div>
            <h2 className="text-sm font-semibold text-[#0B2540] mb-1">
              Order status
            </h2>
            <p className="text-xs text-[#5B7A93] mb-4">
              {statusMeta.description}
            </p>

            {/* Stepper */}
            <div className="space-y-0">
              {STATUS_FLOW.map((step, i) => {
                const meta = STATUS_META[step];
                const StepIcon = meta.icon;
                const isDone = !isCancelled && i < currentStepIndex;
                const isCurrent = !isCancelled && i === currentStepIndex;
                const isLast = i === STATUS_FLOW.length - 1;

                return (
                  <div key={step} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 ${
                          isDone || isCurrent
                            ? ""
                            : "bg-white border-[#DCEEFB] text-[#B7CBDA]"
                        }`}
                        style={
                          isDone || isCurrent
                            ? {
                                backgroundColor: isCurrent
                                  ? meta.bg
                                  : meta.color,
                                borderColor: meta.color,
                                color: isCurrent ? meta.color : "white",
                              }
                            : undefined
                        }
                      >
                        {isDone ? (
                          <HiOutlineCheckCircle size={15} />
                        ) : (
                          <StepIcon size={14} />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 min-h-[22px] transition-colors duration-300"
                          style={{
                            backgroundColor: isDone ? meta.color : "#DCEEFB",
                          }}
                        />
                      )}
                    </div>
                    <div className={isLast ? "pb-0" : "pb-5"}>
                      <p
                        className={`text-sm leading-7 ${
                          isCurrent
                            ? "font-semibold text-[#0B2540]"
                            : isDone
                              ? "text-[#3D5972]"
                              : "text-[#9AB4C7]"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {isCancelled && (
              <div
                className="mt-2 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border"
                style={{
                  color: STATUS_META.Cancelled.color,
                  backgroundColor: STATUS_META.Cancelled.bg,
                  borderColor: STATUS_META.Cancelled.border,
                }}
              >
                <HiOutlineXCircle size={14} />
                This order was cancelled
              </div>
            )}
          </div>

          {/* Actions */}
          {!isCancelled && !isCompleted && (
            <div className="pt-5 border-t border-[#DCEEFB] space-y-2.5">
              {nextStatus && (
                <button
                  onClick={() => setPendingStatus(nextStatus)}
                  disabled={isUpdating}
                  className="w-full flex cursor-pointer items-center justify-center gap-2 bg-[#1E88C7] hover:bg-[#187099] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-[#1E88C7]/30 active:scale-[0.98]"
                >
                  {isUpdating && pendingStatus === nextStatus ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <HiOutlineChevronRight size={18} />
                  )}
                  Mark as "{nextStatus}"
                </button>
              )}
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={isUpdating}
                className="w-full text-sm cursor-pointer font-medium text-[#C4433D] hover:bg-[#FBEAE9] disabled:opacity-60 transition-colors duration-200 px-5 py-2.5 rounded-xl"
              >
                Cancel order
              </button>
            </div>
          )}

          {isCompleted && (
            <div className="pt-5 border-t border-[#DCEEFB]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E9E62] bg-[#E5F7EE] border border-[#BCE9D3] px-3 py-2.5 rounded-lg">
                <HiOutlineCheckCircle size={15} />
                Order completed and closed out
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Confirm: advance status */}
      <ConfirmDialog
        open={!!pendingStatus}
        title={`Mark as "${pendingStatus}"?`}
        body={`This updates the order status for ${order.customerName}. They will be notified automatically.`}
        confirmLabel="Confirm"
        isLoading={isUpdating}
        onCancel={() => setPendingStatus(null)}
        onConfirm={() => commitStatusChange(pendingStatus)}
      />

      {/* Confirm: cancel order */}
      <ConfirmDialog
        open={showCancelConfirm}
        title="Cancel this order?"
        body="This can't be undone. The order will be marked as cancelled."
        confirmLabel="Cancel order"
        destructive
        isLoading={isUpdating}
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={() => commitStatusChange("Cancelled")}
      />
    </motion.div>
  );
};

// ---- Small presentational helpers ---------------------------------------

const DetailRow = ({ icon: Icon, label, value, href, valueClass = "" }) => (
  <div>
    <p className="flex items-center gap-1.5 text-xs font-medium text-[#5B7A93] mb-1">
      <Icon size={14} />
      {label}
    </p>
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`text-sm font-medium text-[#1E88C7] hover:underline ${valueClass}`}
      >
        {value}
      </a>
    ) : (
      <p className={`text-sm font-medium text-[#0B2540] ${valueClass}`}>
        {value}
      </p>
    )}
  </div>
);

const ConfirmDialog = ({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  isLoading,
  destructive = false,
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#0B2540]/40 backdrop-blur-[2px] flex items-center justify-center px-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-base font-bold text-[#0B2540]">{title}</h3>
          <p className="text-sm text-[#5B7A93] mt-2 leading-relaxed">{body}</p>
          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="text-sm font-medium cursor-pointer text-[#5B7A93] hover:text-[#0B2540] transition-colors duration-200 px-4 py-2 rounded-xl disabled:opacity-60"
            >
              Go back
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2 rounded-xl text-white transition-colors duration-200 disabled:opacity-70 active:scale-[0.98] ${
                destructive
                  ? "bg-[#D9615C] hover:bg-[#C4433D]"
                  : "bg-[#1E88C7] hover:bg-[#187099]"
              }`}
            >
              {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default OrderDetails;
