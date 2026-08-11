import React, { useState } from "react";
import * as yup from "yup";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";

/* =========================================================
   CONSTANTS & SCHEMA
========================================================= */

const ROLE_OPTIONS = [
  {
    value: "buyer",
    icon: "mdi:cart-outline",
    title: "buyer",
    desc: "خرید از فروشگاه‌های مستقل بازار",
  },
  {
    value: "seller",
    icon: "mdi:storefront-outline",
    title: "seller",
    desc: "راه‌اندازی فروشگاه و فروش محصولات",
  },
];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  role: "buyer",
  country: "",
  city: "",
  address: "",
};

const registerSchema = yup.object({
  firstName: yup.string().trim().min(2).required("First name is required"),
  lastName: yup.string().trim().min(2).required("Last name is required"),
  email: yup.string().trim().email().required("Email is required"),

  phoneNumber: yup.string().when("role", {
    is: "seller",
    then: (schema) => schema.trim().min(7).required("Phone number is required for sellers"),
    otherwise: (schema) => schema.notRequired(),
  }),

  password: yup.string().min(6).required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords do not match").required(),
  role: yup.string().oneOf(["buyer", "seller"]).required(),

  // Seller Address Validation
  country: yup.string().when("role", {
    is: "seller",
    then: (schema) => schema.trim().required("Country is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  city: yup.string().when("role", {
    is: "seller",
    then: (schema) => schema.trim().required("City is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  address: yup.string().when("role", {
    is: "seller",
    then: (schema) => schema.trim().min(5).required("Full address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

/* =========================================================
   STABLE PRESENTATIONAL COMPONENTS
   NOTE: these must live OUTSIDE the Register component.
   Defining them inside Register recreates their function
   identity on every render, which makes React treat them as
   a brand-new component type and REMOUNT the <input> on every
   keystroke — that's what was causing "can't type in inputs".
========================================================= */

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1f5138]/10 text-[#1f5138]">
        <Icon icon={icon} className="text-lg" />
      </div>
      <h3 className="text-[15px] font-semibold text-stone-800">{title}</h3>
    </div>
  );
}

function Field({ label, name, error, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-stone-700">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-600">
          <Icon icon="mdi:alert-circle-outline" className="text-sm shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ name, type = "text", placeholder, icon, label, value, error, disabled, onChange }) {
  return (
    <Field label={label} name={name} error={error}>
      <div className="relative">
        {icon && (
          <Icon icon={icon} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-stone-400 pointer-events-none" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] outline-none transition disabled:cursor-not-allowed disabled:opacity-60
            ${icon ? "pr-11" : ""}
            ${error
              ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
              : "border-stone-200 focus:border-[#1f5138] focus:ring-4 focus:ring-[#1f5138]/10"}`}
        />
      </div>
    </Field>
  );
}

function PasswordInput({ name, placeholder, label, value, error, disabled, show, setShow, onChange }) {
  return (
    <Field label={label} name={name} error={error}>
      <div className="relative">
        <Icon icon="mdi:lock-outline" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-stone-400 pointer-events-none" />
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 pr-11 pl-11 text-[15px] outline-none transition disabled:cursor-not-allowed disabled:opacity-60
            ${error
              ? "border-rose-400 focus:ring-4 focus:ring-rose-100"
              : "border-stone-200 focus:border-[#1f5138] focus:ring-4 focus:ring-[#1f5138]/10"}`}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
        >
          <Icon icon={show ? "mdi:eye-off-outline" : "mdi:eye-outline"} className="text-lg" />
        </button>
      </div>
    </Field>
  );
}

/* =========================================================
   LOADING / SUCCESS OVERLAY
   status: "loading" | "success"
   Shows a spinner while the request is in flight, then morphs
   into a drawn checkmark + success message, then the parent
   navigates to /auth/login once the timer finishes.
========================================================= */

function StatusOverlay({ status, redirectMs, t }) {
  if (!status) return null;
  const isSuccess = status === "success";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm">
      <div className="mx-4 flex w-full max-w-xs flex-col items-center rounded-2xl bg-white px-8 py-9 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="relative flex h-16 w-16 items-center justify-center">
          {!isSuccess && (
            <>
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(#1f5138 0deg, #1f5138 90deg, transparent 90deg, transparent 360deg)",
                  animation: "register-spin 0.9s linear infinite",
                }}
              />
              <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-white">
                <Icon icon="mdi:storefront-outline" className="text-2xl text-[#1f5138]" />
              </div>
            </>
          )}

          {isSuccess && (
            <svg viewBox="0 0 64 64" className="h-16 w-16" style={{ animation: "register-pop 0.4s ease-out" }}>
              <circle
                cx="32"
                cy="32"
                r="29"
                fill="none"
                stroke="#1f5138"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 182,
                  strokeDashoffset: 182,
                  animation: "register-ring 0.5s ease-out forwards",
                }}
              />
              <path
                d="M20 33.5L28 41.5L44 24.5"
                fill="none"
                stroke="#1f5138"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 34,
                  strokeDashoffset: 34,
                  animation: "register-check 0.35s ease-out 0.45s forwards",
                }}
              />
            </svg>
          )}
        </div>

        <p className="mt-5 text-[15px] font-semibold text-stone-800">
          {isSuccess ? t("registerSuccessTitle") || "Account created!" : t("creating") || "Creating your account"}
        </p>
        <p className="mt-1 text-center text-xs text-stone-500">
          {isSuccess
            ? t("registerSuccessSubtitle") || "You're all set. Taking you to the login page..."
            : "Just a moment, we're setting things up for you."}
        </p>

        {!isSuccess && (
          <div className="mt-4 flex items-center gap-1.5">
            {[0, 0.15, 0.3].map((delay, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#1f5138]"
                style={{ animation: "register-bounce 1s ease-in-out infinite", animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        )}

        {isSuccess && (
          <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-[#1f5138]"
              style={{ animation: `register-progress ${redirectMs}ms linear forwards` }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes register-spin { to { transform: rotate(360deg); } }
        @keyframes register-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes register-pop {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes register-ring { to { stroke-dashoffset: 0; } }
        @keyframes register-check { to { stroke-dashoffset: 0; } }
        @keyframes register-progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Register() {
  const { apiurl , production_api_url } = useApi();
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // "" | "loading" | "success" — drives the fullscreen overlay below
  const [status, setStatus] = useState("");
  const isSubmitting = status !== "";
  const REDIRECT_MS = 1800;

  /* --- HANDLERS --- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const selectRole = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
      ...(role === "buyer" ? { country: "", city: "", address: "" } : {}),
    }));
    setErrors({});
  };

  const validateForm = async () => {
    try {
      await registerSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner?.forEach((e) => {
        if (e.path && !newErrors[e.path]) newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const isValid = await validateForm();
    if (!isValid) return;

    const isSeller = form.role === "seller";
    const endpoint = isSeller ? `${production_api_url}/auth/seller` : `${production_api_url}/auth/buyer`;

    const payload = isSeller
      ? {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          address: form.address.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
          role: "seller",
          phoneNumber: form.phoneNumber.trim(),
        }
      : {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          role: "buyer",
          ...(form.phoneNumber.trim() && { phoneNumber: form.phoneNumber.trim() }),
        };

    if (!apiurl) {
      setServerError("API URL is not configured.");
      return;
    }

    setStatus("loading");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Registration failed");

      clearTimeout(timeoutId);
      setStatus("success");
      // Hold the success message on screen for a beat, then move on.
      setTimeout(() => navigate("/auth/login"), REDIRECT_MS);
    } catch (error) {
      clearTimeout(timeoutId);
      setStatus("");
      if (error?.name === "AbortError") {
        setServerError("Request timed out. Please check your connection.");
      } else {
        setServerError(error?.message || "Something went wrong.");
      }
    }
  };

  /* --- MAIN RENDER --- */
  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 relative">
      <StatusOverlay status={status} redirectMs={REDIRECT_MS} t={t} />

      <div className="mx-auto w-full max-w-3xl">
        {/* BRAND */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f5138] text-white shadow-sm">
            <Icon icon="mdi:storefront-outline" className="text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">{t("createAccount")}</h1>
          <p className="mt-1 text-sm text-stone-500">{t("registerSubtitle")}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="h-1.5 w-full bg-gradient-to-l from-[#1f5138] via-[#2c6b4a] to-[#1f5138]" />

          <div className="p-6 sm:p-9">
            {serverError && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
                <Icon icon="mdi:alert-circle" className="mt-0.5 shrink-0 text-base" />
                <span>{serverError}</span>
              </div>
            )}

            {/* SINGLE CLEAN FORM TAG - NO NESTED FIELDSETS */}
            <form onSubmit={handleSubmit} className="space-y-7">

              {/* ROLE SELECTOR */}
              <div>
                <label className="mb-2.5 block text-sm font-medium text-stone-700">{t("iWantTo")}</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const active = form.role === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => selectRole(opt.value)}
                        className={`group relative flex items-start gap-3 rounded-xl border p-4 text-right transition
                          ${active
                            ? "border-[#1f5138] bg-[#1f5138]/[0.05] ring-1 ring-[#1f5138]"
                            : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"}`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition
                          ${active ? "bg-[#1f5138] text-white" : "bg-stone-100 text-stone-500"}`}>
                          <Icon icon={opt.icon} className="text-xl" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold ${active ? "text-[#1f5138]" : "text-stone-800"}`}>
                            {t(opt.title)}
                          </p>
                          <p className="mt-0.5 text-xs leading-5 text-stone-500">{opt.desc}</p>
                        </div>
                        {active && (
                          <Icon icon="mdi:check-circle" className="absolute left-3 top-3 text-lg text-[#1f5138]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PERSONAL INFO */}
              <div>
                <SectionHeading icon="mdi:account-outline" title={t("personalInfo") || "اطلاعات شخصی"} />
                <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <TextInput
                    name="firstName"
                    placeholder={t("firstName")}
                    label={t("firstName")}
                    value={form.firstName}
                    error={errors.firstName}
                    disabled={isSubmitting}
                    onChange={handleChange}
                  />
                  <TextInput
                    name="lastName"
                    placeholder={t("lastName")}
                    label={t("lastName")}
                    value={form.lastName}
                    error={errors.lastName}
                    disabled={isSubmitting}
                    onChange={handleChange}
                  />
                  <TextInput
                    name="email"
                    type="email"
                    icon="mdi:email-outline"
                    placeholder={t("email")}
                    label={t("email")}
                    value={form.email}
                    error={errors.email}
                    disabled={isSubmitting}
                    onChange={handleChange}
                  />
                  <TextInput
                    name="phoneNumber"
                    type="tel"
                    icon="mdi:phone-outline"
                    placeholder={form.role === "seller" ? "Phone number" : "Phone number (optional)"}
                    label={form.role === "seller" ? "Phone number" : "Phone number (optional)"}
                    value={form.phoneNumber}
                    error={errors.phoneNumber}
                    disabled={isSubmitting}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* SELLER ADDRESS */}
              {form.role === "seller" && (
                <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <TextInput
                      name="country"
                      placeholder="Country"
                      label="Country"
                      value={form.country}
                      error={errors.country}
                      disabled={isSubmitting}
                      onChange={handleChange}
                    />
                    <TextInput
                      name="city"
                      placeholder="City"
                      label="City"
                      value={form.city}
                      error={errors.city}
                      disabled={isSubmitting}
                      onChange={handleChange}
                    />
                    <div className="sm:col-span-2">
                      <TextInput
                        name="address"
                        placeholder="Full store address / آدرس کامل فروشگاه"
                        label={t("fullAddress") || "Full address"}
                        icon="mdi:home-map-marker-outline"
                        value={form.address}
                        error={errors.address}
                        disabled={isSubmitting}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PASSWORD */}
              <div>
                <SectionHeading icon="mdi:shield-lock-outline" title={t("security") || "امنیت حساب"} />
                <div className="mt-3 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <PasswordInput
                    name="password"
                    placeholder={t("password")}
                    label={t("password")}
                    value={form.password}
                    error={errors.password}
                    disabled={isSubmitting}
                    show={showPassword}
                    setShow={setShowPassword}
                    onChange={handleChange}
                  />
                  <PasswordInput
                    name="confirmPassword"
                    placeholder={t("confirmPassword")}
                    label={t("confirmPassword")}
                    value={form.confirmPassword}
                    error={errors.confirmPassword}
                    disabled={isSubmitting}
                    show={showConfirm}
                    setShow={setShowConfirm}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f5138] py-3 text-[15px] font-semibold text-white transition hover:bg-[#17432e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && <Icon icon="mdi:loading" className="animate-spin text-lg" />}
                {isSubmitting ? t("creating") : t("createAccount")}
              </button>
            </form>

            {/* SOCIAL & LOGIN LINK */}
            <div className="my-6 flex items-center gap-3">
              <hr className="flex-1 border-stone-200" />
              <span className="text-xs text-stone-400">{t("or")}</span>
              <hr className="flex-1 border-stone-200" />
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {["google", "github", "facebook"].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => console.log(`Social: ${provider}`)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
                >
                  <Icon
                    icon={provider === "google" ? "material-icon-theme:google" : `mdi:${provider}`}
                    className="text-base"
                  />
                  {t(provider)}
                </button>
              ))}
            </div>

            <p className="mt-7 text-center text-sm text-stone-500">
              {t("alreadyHaveAccount")}{" "}
              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="font-semibold text-[#1f5138] hover:underline"
              >
                {t("login")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}