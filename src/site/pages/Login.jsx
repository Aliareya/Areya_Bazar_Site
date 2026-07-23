import React, { useState } from "react";
import * as yup from "yup";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../context/ApiContext";
import { toast } from "react-toastify";

// -----------------------------
// Validation schema (Yup)
// -----------------------------
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

export default function Login() {
  const { user, is_login, login, logout } = useAuth();
  const {apiurl} = useApi();
  const navigate = useNavigate();
  const { t } = useTranslation("auth");


  const [form, setForm] = useState({
    email: "",
    password: "",
  });


  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts typing
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


    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    setLoading(true);

    try {
      const res = await fetch(
        `${apiurl}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log(data)
      if (!res.ok) {
        const errorMessage = Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message || "Invalid email or password";

        throw new Error(errorMessage);
      }

      if (!data?.token) {
        throw new Error("Access token was not returned");
      }


      if (data.data) {
        localStorage.setItem("user", JSON.stringify(data?.data));
        login(data.data, data?.token);
        toast.success(data.message)
      }

      navigate("/");
    } catch (err) {
      setError(
        "Please Try Again Latter"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="py-5 flex items-center justify-center bg-gray-100 max-sm:px-3 md:px-5 max-md:px-6 lg:px-10">
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

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder={t("email")}
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#1f5138]"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder={t("password")}
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full border rounded-lg px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#1f5138]"
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-2.5 text-gray-500"
              >
                <Icon
                  icon={
                    showPassword
                      ? "mdi:eye-off"
                      : "mdi:eye"
                  }
                />
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1f5138] text-white py-2 rounded-lg disabled:opacity-60"
            >
              {loading
                ? t("loggingIn") ||
                "Logging in..."
                : t("login")}
            </button>

          </form>

          {/* ========================= */}
          {/* OR */}
          {/* ========================= */}

          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />

            <span className="px-3 text-gray-400 text-sm">
              {t("or")}
            </span>

            <hr className="flex-1 border-gray-300" />
          </div>

          {/* ========================= */}
          {/* SOCIAL LOGIN */}
          {/* ========================= */}

          <div className="flex max-sm:flex-wrap justify-center items-center gap-3">

            {/* GOOGLE */}
            <button
              type="button"
              onClick={() =>
                handleSocialLogin("google")
              }
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="logos:google-icon" />
              {t("google")}
            </button>

            {/* GITHUB */}
            <button
              type="button"
              onClick={() =>
                handleSocialLogin("github")
              }
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="mdi:github" />
              {t("github")}
            </button>

            {/* FACEBOOK */}
            <button
              type="button"
              onClick={() =>
                handleSocialLogin("facebook")
              }
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon
                icon="mdi:facebook"
                className="text-blue-600"
              />

              {t("facebook")}
            </button>

          </div>

          {/* ========================= */}
          {/* REGISTER LINK */}
          {/* ========================= */}

          <p className="text-center text-sm text-gray-500 mt-4">
            {t("dontHaveAccount")}{" "}

            <span
              onClick={() =>
                navigate("/auth/register")
              }
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