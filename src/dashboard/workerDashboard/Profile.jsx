import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineCamera,
  HiOutlineCheckCircle,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineOfficeBuilding,
  HiOutlineLink,
  HiOutlineExclamation,
} from "react-icons/hi";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { getUserMe, updateUserMe } from "../../services/user.service";
import UserProfile from "../components/UserProfile";

// Strips out empty/undefined fields so the payload only ever contains what
// the person actually filled in, matching the "all fields optional" contract.
function buildUpdatePayload(formData) {
  const payload = {};

  if (formData.full_name?.trim()) payload.full_name = formData.full_name.trim();
  if (formData.phone_number?.trim())
    payload.phone_number = formData.phone_number.trim();
  if (formData.country?.trim()) payload.country = formData.country.trim();

  // profile_image is expected to be a Cloudinary URL. A freshly-picked local
  // file is only a base64 data URL at this point (no upload step wired up
  // yet), so we don't send that — only an existing hosted URL goes through.
  if (formData.profile_image && !formData.profile_image.startsWith("data:")) {
    payload.profile_image = formData.profile_image;
  }

  if (formData.account_type === "organization") {
    if (formData.organization_name?.trim())
      payload.organization_name = formData.organization_name.trim();
    if (formData.organization_description?.trim())
      payload.organization_description =
        formData.organization_description.trim();
    if (formData.website?.trim()) payload.website = formData.website.trim();
  }

  return payload;
}

const FieldSkeleton = () => (
  <div className="w-full h-[58px] bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
);

const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const Profile = () => {
  const [cookies, setCookie] = useCookies(["userData"]);

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    phone_number: "",
    country: "",
    account_type: "individual",
    is_suspended: false,
    profile_image: null,
    organization_name: "",
    organization_description: "",
    website: "",
    created_at: null,
    auth_provider: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchUserMe = async () => {
      setUserLoading(true);
      try {
        const response = await getUserMe();
        const data = response?.data || response;
        setUser(data || {});
      } catch (error) {
        console.log("Error fetching user me : ", error);
        toast.error("Could not load your profile.");
      } finally {
        setUserLoading(false);
      }
    };
    fetchUserMe();
  }, []);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setFormData((prev) => ({
        ...prev,
        id: user.id || "",
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        country: user.country || "",
        account_type: user.account_type || "individual",
        is_suspended: Boolean(user.is_suspended),
        profile_image: user.profile_image || null,
        organization_name: user.organization_name || "",
        organization_description: user.organization_description || "",
        website: user.website || "",
        created_at: user.created_at || null,
        auth_provider: user.auth_provider || "",
      }));
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = buildUpdatePayload(formData);
      const response = await updateUserMe(payload);
      console.log("my update profile res : ", response);
      setCookie("userData", { ...user, ...formData }, { path: "/" });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("my update profile error : ", error);
      toast.error("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  const isOrganization = formData.account_type === "organization";
  const hasUnsavedLocalImage = formData.profile_image?.startsWith("data:");

  return (
    <div className="w-full min-h-full space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Account Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your profile details</p>
        </div>
        <UserProfile role="fundraiser" />
      </div>

      {/* Suspended account warning */}
      {!userLoading && formData.is_suspended && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700"
        >
          <HiOutlineExclamation size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Your account is suspended</p>
            <p className="text-xs mt-0.5 text-rose-600/80">
              Some platform features are restricted. Contact support for more
              information.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm"
      >
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="show"
          onSubmit={handleProfileSubmit}
          className="space-y-10"
        >
          {/* Profile Image Section */}
          <motion.div
            variants={fieldVariants}
            className="flex flex-col sm:flex-row items-center gap-8"
          >
            <div className="relative group">
              {userLoading ? (
                <div className="w-32 h-32 rounded-full bg-slate-100 animate-pulse border-2 border-slate-200" />
              ) : (
                <>
                  <div className="w-32 h-32 rounded-full border-2 border-slate-200 bg-slate-50 overflow-hidden ring-4 ring-[#1E88C7]/10 transition-shadow duration-300 group-hover:ring-[#1E88C7]/20">
                    {formData.profile_image ? (
                      <img
                        src={formData.profile_image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <HiOutlineUserCircle size={64} />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="absolute bottom-0 right-0 p-3 bg-[#1E88C7] text-white rounded-full shadow-lg shadow-[#1E88C7]/30 hover:bg-[#187099] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <HiOutlineCamera size={20} />
                  </button>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="text-center sm:text-left space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">
                Profile Photo
              </h3>
              <p className="text-slate-500 text-sm max-w-xs">
                This image will be visible to donors and other users across the
                platform.
              </p>
              <p className="text-[#1E88C7]/70 text-xs font-medium">
                Recommended: 400x400px • Max 2MB
              </p>
              {hasUnsavedLocalImage && (
                <p className="text-amber-600 text-xs font-medium">
                  Preview only — photo upload will be available soon.
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={fieldVariants}
            className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
          />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fieldVariants} className="space-y-3">
              <label className="text-sm font-semibold text-slate-500 ml-1">
                Full Name
              </label>
              <div className="relative group">
                {userLoading ? (
                  <FieldSkeleton />
                ) : (
                  <>
                    <input
                      type="text"
                      name="full_name"
                      placeholder="Your full name"
                      value={formData.full_name}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:border-[#1E88C7] focus:ring-4 focus:ring-[#1E88C7]/10 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                    />
                    <HiOutlineUserCircle
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E88C7] transition-colors duration-200"
                      size={22}
                    />
                  </>
                )}
              </div>
            </motion.div>

            <motion.div variants={fieldVariants} className="space-y-3">
              <label className="text-sm font-semibold text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative">
                {userLoading ? (
                  <FieldSkeleton />
                ) : (
                  <>
                    <input
                      disabled
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full bg-slate-100/70 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-400 cursor-not-allowed italic"
                    />
                    <HiOutlineMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={22}
                    />
                  </>
                )}
              </div>
            </motion.div>

            <motion.div variants={fieldVariants} className="space-y-3">
              <label className="text-sm font-semibold text-slate-500 ml-1">
                Phone Number
              </label>
              <div className="relative group">
                {userLoading ? (
                  <FieldSkeleton />
                ) : (
                  <>
                    <input
                      type="tel"
                      name="phone_number"
                      placeholder="+234 800 000 0000"
                      value={formData.phone_number}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:border-[#1E88C7] focus:ring-4 focus:ring-[#1E88C7]/10 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                    />
                    <HiOutlinePhone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E88C7] transition-colors duration-200"
                      size={22}
                    />
                  </>
                )}
              </div>
            </motion.div>

            <motion.div variants={fieldVariants} className="space-y-3">
              <label className="text-sm font-semibold text-slate-500 ml-1">
                Country
              </label>
              <div className="relative group">
                {userLoading ? (
                  <FieldSkeleton />
                ) : (
                  <>
                    <input
                      type="text"
                      name="country"
                      placeholder="Your country"
                      value={formData.country}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:border-[#1E88C7] focus:ring-4 focus:ring-[#1E88C7]/10 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                    />
                    <HiOutlineGlobeAlt
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E88C7] transition-colors duration-200"
                      size={22}
                    />
                  </>
                )}
              </div>
            </motion.div>

            {/* Organization-only fields */}
            {!userLoading && isOrganization && (
              <>
                <motion.div variants={fieldVariants} className="space-y-3">
                  <label className="text-sm font-semibold text-slate-500 ml-1">
                    Organization Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="organization_name"
                      placeholder="Your organization's name"
                      value={formData.organization_name}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:border-[#1E88C7] focus:ring-4 focus:ring-[#1E88C7]/10 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                    />
                    <HiOutlineOfficeBuilding
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E88C7] transition-colors duration-200"
                      size={22}
                    />
                  </div>
                </motion.div>

                <motion.div variants={fieldVariants} className="space-y-3">
                  <label className="text-sm font-semibold text-slate-500 ml-1">
                    Website
                  </label>
                  <div className="relative group">
                    <input
                      type="url"
                      name="website"
                      placeholder="https://yourorganization.com"
                      value={formData.website}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:border-[#1E88C7] focus:ring-4 focus:ring-[#1E88C7]/10 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                    />
                    <HiOutlineLink
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E88C7] transition-colors duration-200"
                      size={22}
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={fieldVariants}
                  className="space-y-3 md:col-span-2"
                >
                  <label className="text-sm font-semibold text-slate-500 ml-1">
                    Organization Description
                  </label>
                  <textarea
                    name="organization_description"
                    placeholder="Tell donors about your organization"
                    value={formData.organization_description}
                    onChange={handleProfileChange}
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-900 focus:outline-none focus:border-[#1E88C7] focus:ring-4 focus:ring-[#1E88C7]/10 focus:bg-white transition-all duration-200 placeholder:text-slate-400 resize-none"
                  />
                </motion.div>
              </>
            )}
          </div>

          <motion.div
            variants={fieldVariants}
            className="pt-6 border-t border-slate-200"
          >
            <button
              type="submit"
              disabled={loading || userLoading}
              className="w-full sm:w-auto px-12 py-4 bg-[#1E88C7] hover:bg-[#187099] text-white font-bold rounded-2xl shadow-lg shadow-[#1E88C7]/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-3 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating Profile...</span>
                </>
              ) : (
                <>
                  <HiOutlineCheckCircle size={22} />
                  <span>Save Profile Details</span>
                </>
              )}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Profile;
