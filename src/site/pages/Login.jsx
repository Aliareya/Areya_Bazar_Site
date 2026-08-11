import React, { useState } from "react";
import * as yup from "yup";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../context/ApiContext";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required"),
});


function StatusOverlay({ status, redirectMs, userName, t }) {
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
                  animation: "login-spin 0.9s linear infinite",
                }}
              />
              <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-white">
                <Icon icon="mdi:storefront-outline" className="text-2xl text-[#1f5138]" />
              </div>
            </>
          )}

          {isSuccess && (
            <svg viewBox="0 0 64 64" className="h-16 w-16" style={{ animation: "login-pop 0.4s ease-out" }}>
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
                  animation: "login-ring 0.5s ease-out forwards",
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
                  animation: "login-check 0.35s ease-out 0.45s forwards",
                }}
              />
            </svg>
          )}
        </div>

        <p className="mt-5 text-[15px] font-semibold text-stone-800">
          {isSuccess
            ? (userName ? `${t("welcomeBackName") || "Welcome back"}, ${userName}!` : t("welcomeBack") || "Welcome back!")
            : t("loggingIn") || "Signing you in"}
        </p>
        <p className="mt-1 text-center text-xs text-stone-500">
          {isSuccess
            ? t("loginSuccessSubtitle") || "You're logged in. Taking you to the homepage..."
            : "Just a moment, checking your details."}
        </p>

        {!isSuccess && (
          <div className="mt-4 flex items-center gap-1.5">
            {[0, 0.15, 0.3].map((delay, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#1f5138]"
                style={{ animation: "login-bounce 1s ease-in-out infinite", animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        )}

        {isSuccess && (
          <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-[#1f5138]"
              style={{ animation: `login-progress ${redirectMs}ms linear forwards` }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes login-spin { to { transform: rotate(360deg); } }
        @keyframes login-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes login-pop {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes login-ring { to { stroke-dashoffset: 0; } }
        @keyframes login-check { to { stroke-dashoffset: 0; } }
        @keyframes login-progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
}

export default function Login() {
  const { login } = useAuth();
  const { apiurl } = useApi();
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // "" | "loading" | "success" — drives the fullscreen overlay below
  const [status, setStatus] = useState("");
  const [loggedInName, setLoggedInName] = useState("");
  const isSubmitting = status !== "";
  const REDIRECT_MS = 1500;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await loginSchema.validate(form, {
        abortEarly: true,
      });
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    if (!apiurl) {
      setError("API URL is not configured.");
      return;
    }

    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    setStatus("loading");

    try {
      const res = await fetch(`${apiurl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        throw new Error("Unexpected response from server. Please try again.");
      }

      if (!res.ok) {
        const errorMessage = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message || "Invalid email or password";

        throw new Error(errorMessage);
      }

      // Real API shape: { message, access_token, user }
      if (!data?.access_token) {
        throw new Error("Access token was not returned");
      }

      if (!data?.user) {
        throw new Error("User data was not returned");
      }

      login(data.user, data.access_token);
      setLoggedInName(data.user.first_name || "");
      setStatus("success");

      // Hold the success message on screen for a beat, then move on.
      setTimeout(() => navigate("/"), REDIRECT_MS);
    } catch (err) {
      setStatus("");
      const message =
        err instanceof TypeError
          ? "Could not reach the server. Check your connection and try again."
          : err.message || "Something went wrong. Please try again.";

      console.error("Login failed:", err);
      setError(message);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="py-5 flex items-center justify-center bg-gray-100 max-sm:px-3 md:px-5 max-md:px-6 lg:px-10">
      <StatusOverlay status={status} redirectMs={REDIRECT_MS} userName={loggedInName} t={t} />

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex">
        {/* ========================= */}
        {/* LEFT IMAGE */}
        {/* ========================= */}

        <div className="hidden lg:block w-1/2">
          <img
            src="https://i.pinimg.com/736x/4b/7e/1f/4b7e1f5ef71701edfc4b72f4cde6578d.jpg"
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>

        {/* ========================= */}
        {/* RIGHT FORM */}
        {/* ========================= */}

        <div className="w-full lg:w-1/2 lg:p-8 md:p-6 max-md:p-5 p-3">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-[#1f5138] mb-2">
            {t("welcomeBack")}
          </h2>

          {/* Subtitle */}
          <p className="text-center text-gray-500 text-sm mb-4">
            {t("loginSubtitle")}
          </p>

          {/* ========================= */}
          {/* ERROR MESSAGE */}
          {/* ========================= */}

          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* ========================= */}
          {/* LOGIN FORM */}
          {/* ========================= */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder={t("email")}
              value={form.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#1f5138] disabled:opacity-60 disabled:cursor-not-allowed"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t("password")}
                value={form.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full border rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#1f5138] disabled:opacity-60 disabled:cursor-not-allowed"
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
                className="absolute right-3 top-2.5 text-gray-500 disabled:opacity-60"
              >
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1f5138] text-white py-2 rounded-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Icon icon="mdi:loading" className="animate-spin text-lg" />}
              {isSubmitting ? t("loggingIn") || "Logging in..." : t("login")}
            </button>
          </form>

          {/* ========================= */}
          {/* OR */}
          {/* ========================= */}

          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />

            <span className="px-3 text-gray-400 text-sm">{t("or")}</span>

            <hr className="flex-1 border-gray-300" />
          </div>

          {/* ========================= */}
          {/* SOCIAL LOGIN */}
          {/* ========================= */}

          <div className="flex max-sm:flex-wrap justify-center items-center gap-3">
            {/* GOOGLE */}
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 disabled:opacity-60"
            >
              <Icon icon="logos:google-icon" />
              {t("google")}
            </button>

            {/* GITHUB */}
            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 disabled:opacity-60"
            >
              <Icon icon="mdi:github" />
              {t("github")}
            </button>

            {/* FACEBOOK */}
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 disabled:opacity-60"
            >
              <Icon icon="mdi:facebook" className="text-blue-600" />
              {t("facebook")}
            </button>
          </div>

          {/* ========================= */}
          {/* REGISTER LINK */}
          {/* ========================= */}

          <p className="text-center text-sm text-gray-500 mt-4">
            {t("dontHaveAccount")}{" "}
            <span
              onClick={() => navigate("/auth/register")}
              className="text-[#1f5138] font-medium cursor-pointer"
            >
              {t("register")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}