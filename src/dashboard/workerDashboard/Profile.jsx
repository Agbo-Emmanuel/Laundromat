import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiOutlineUserCircle,
  HiOutlineShieldCheck,
  HiOutlineMail,
  HiOutlineCamera,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineArrowRight,
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

// Normalizes whatever the backend sends ("approved", "verified", "pending"...)
// down to the four states this page knows how to render.
function normalizeKycStatus(status) {
  const s = (status || "").toLowerCase();
  if (s === "verified" || s === "approved") return "verified";
  if (s === "pending" || s === "processing" || s === "in_review")
    return "pending";
  if (s === "rejected" || s === "declined") return "rejected";
  return "unverified";
}

function formatMemberSince(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

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
  <div className="w-full h-[58px] bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
);

const SidebarCardSkeleton = () => (
  <div className="p-6 bg-white border border-gray-200 rounded-3xl animate-pulse space-y-3">
    <div className="h-4 w-32 bg-gray-100 rounded" />
    <div className="h-4 w-24 bg-gray-100 rounded" />
    <div className="h-3 w-full bg-gray-100 rounded" />
    <div className="h-3 w-3/4 bg-gray-100 rounded" />
  </div>
);

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
    kyc_status: "",
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
        kyc_status: user.kyc_status || "",
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

  const kycStatus = normalizeKycStatus(formData.kyc_status);
  const isOrganization = formData.account_type === "organization";
  const hasUnsavedLocalImage = formData.profile_image?.startsWith("data:");

  return (
    <div className="w-full min-h-full bg-gray-50 space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your profile and verification status
          </p>
        </div>
        <UserProfile role="fundraiser" />
      </div>

      {/* Suspended account warning */}
      {!userLoading && formData.is_suspended && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
          <HiOutlineExclamation size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Your account is suspended</p>
            <p className="text-xs mt-0.5 text-red-600/80">
              Some platform features are restricted. Contact support for more
              information.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-teal-800 text-white shadow-lg shadow-teal-800/20 w-full">
            <HiOutlineUserCircle size={24} />
            <span className="font-semibold">Profile Details</span>
          </div>

          {userLoading ? (
            <>
              <SidebarCardSkeleton />
              <SidebarCardSkeleton />
            </>
          ) : (
            <>
              {/* KYC status / CTA card */}
              {kycStatus === "pending" && (
                <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-2 text-amber-600 mb-3">
                    <HiOutlineClock size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Verification Status
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">Pending Review</p>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    Your identity verification is currently being processed by
                    our team. This usually takes 24-48 hours.
                  </p>
                </div>
              )}

              {kycStatus === "verified" && (
                <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-2 text-teal-700 mb-3">
                    <HiOutlineCheckCircle size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Verification Status
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">Verified</p>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    Your identity has been successfully verified. You now have
                    full access to all platform features.
                  </p>
                </div>
              )}

              {(kycStatus === "unverified" || kycStatus === "rejected") && (
                <Link
                  to="/fundraiser/dashboard/kyc"
                  className="block p-6 bg-white border border-gray-200 rounded-3xl hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 shadow-sm group"
                >
                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-orange-500 mb-3 transition-colors duration-200">
                    <HiOutlineShieldCheck size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Verification Status
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {kycStatus === "rejected"
                      ? "Verification Rejected"
                      : "Not Verified"}
                  </p>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">
                    {kycStatus === "rejected"
                      ? "Your last submission needs another look. Resubmit your documents to try again."
                      : "Verify your identity to unlock donations, withdrawals, and full platform access."}
                  </p>
                  <div className="flex items-center gap-2 text-orange-500 text-sm font-bold mt-4">
                    <span>
                      {kycStatus === "rejected"
                        ? "Resubmit documents"
                        : "Start verification"}
                    </span>
                    <HiOutlineArrowRight size={16} />
                  </div>
                </Link>
              )}

              {/* Account info card */}
              <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Account Info
                </span>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Account type</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {formData.account_type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Member since</span>
                  <span className="font-semibold text-gray-900">
                    {formatMemberSince(formData.created_at)}
                  </span>
                </div>
                {formData.auth_provider && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Signed in via</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {formData.auth_provider}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm"
          >
            <form onSubmit={handleProfileSubmit} className="space-y-10">
              {/* Profile Image Section */}
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  {userLoading ? (
                    <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse border-2 border-gray-200" />
                  ) : (
                    <>
                      <div className="w-32 h-32 rounded-full border-2 border-gray-200 bg-gray-50 overflow-hidden ring-4 ring-teal-700/10">
                        {formData.profile_image ? (
                          <img
                            src={formData.profile_image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <HiOutlineUserCircle size={64} />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="absolute bottom-0 right-0 p-3 bg-teal-800 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
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
                  <h3 className="text-2xl font-bold text-gray-900">
                    Profile Photo
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs">
                    This image will be visible to donors and other users across
                    the platform.
                  </p>
                  <p className="text-teal-700/70 text-xs font-medium">
                    Recommended: 400x400px • Max 2MB
                  </p>
                  {hasUnsavedLocalImage && (
                    <p className="text-orange-500 text-xs font-medium">
                      Preview only — photo upload will be available soon.
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
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
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                        />
                        <HiOutlineUserCircle
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-700 transition-colors duration-200"
                          size={22}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
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
                          className="w-full bg-gray-100/70 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-400 cursor-not-allowed italic"
                        />
                        <HiOutlineMail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                          size={22}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
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
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                        />
                        <HiOutlinePhone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-700 transition-colors duration-200"
                          size={22}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-500 ml-1">
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
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                        />
                        <HiOutlineGlobeAlt
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-700 transition-colors duration-200"
                          size={22}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Organization-only fields */}
                {!userLoading && isOrganization && (
                  <>
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-500 ml-1">
                        Organization Name
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          name="organization_name"
                          placeholder="Your organization's name"
                          value={formData.organization_name}
                          onChange={handleProfileChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                        />
                        <HiOutlineOfficeBuilding
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-700 transition-colors duration-200"
                          size={22}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-500 ml-1">
                        Website
                      </label>
                      <div className="relative group">
                        <input
                          type="url"
                          name="website"
                          placeholder="https://yourorganization.com"
                          value={formData.website}
                          onChange={handleProfileChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 focus:bg-white transition-all duration-200 placeholder:text-gray-400"
                        />
                        <HiOutlineLink
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-700 transition-colors duration-200"
                          size={22}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-500 ml-1">
                        Organization Description
                      </label>
                      <textarea
                        name="organization_description"
                        placeholder="Tell donors about your organization"
                        value={formData.organization_description}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 focus:bg-white transition-all duration-200 placeholder:text-gray-400 resize-none"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading || userLoading}
                  className="w-full sm:w-auto px-12 py-4 bg-teal-800 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-800/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-3 cursor-pointer"
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
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
