import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate()
  const { t } = useTranslation('auth')
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      return "Please fill all required fields";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) return setError(err);

    setError("");
    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1500));

      console.log("User registered:", form);
      alert("Account created successfully!");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // SOCIAL LOGIN
  const handleSocialLogin = (provider) => {
    setLoading(true);

    setTimeout(() => {
      console.log(`Login with ${provider}`);
      alert(`Logged in with ${provider}`);
      setLoading(false);
    }, 1200);
  };

  const [userType, setUserType] = useState([
    { type: 'buyer', selec: true },
    { type: 'seller', selec: false }
  ]);

  const selectRole = (type) => {
    setForm({ ...form, type });

    setUserType(prev =>
      prev.map(role => ({
        ...role,
        selec: role.type === type
      }))
    );
  };

  return (
    <div className="min-h-screen py-5 flex items-center justify-center bg-gray-100 max-sm:px-3 md:px-5 max-md:px-6 lg:px-10">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex">

        {/* LEFT SIDE IMAGE */}
        <div className="hidden lg:block  w-1/2">
          <img
            src="https://i.pinimg.com/736x/4b/7e/1f/4b7e1f5ef71701edfc4b72f4cde6578d.jpg"
            alt="marketplace"
            className="h-full w-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-full  lg:w-1/2 lg:p-8 md:p-6 max-md:p-5 p-3 ">

          <h2 className="text-2xl font-bold text-center text-[#1f5138] mb-2">
            {t('createAccount')}
          </h2>

          <p className="text-center text-gray-500 text-sm mb-4">
            {t('registerSubtitle')}
          </p>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ROLE */}
            <div>
              <label className="text-sm text-gray-600 font-medium">
                {t('iWantTo')}
              </label>

              <div className="flex gap-2 mt-2">
                {userType.map((role) => (
                  <button
                    key={role.type}
                    type="button"
                    onClick={() => selectRole(role.type, role)}
                    className={`flex-1 py-2 rounded-lg border text-sm ${role.selec
                      ? "bg-[#1f5138] text-white"
                      : "bg-white"
                      }`}
                  >
                    {t(role.type)}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              name="name"
              placeholder={t('fullName')}
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />

            <input
              type="email"
              name="email"
              placeholder={t('email')}
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />

            <input
              type="text"
              name="phone"
              placeholder={t('phoneNumber')}
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t('password')}
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
              </span>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder={t('confirmPassword')}
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                <Icon icon={showConfirm ? "mdi:eye-off" : "mdi:eye"} />
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1f5138] text-white py-2 rounded-lg"
            >
              {loading ? `${t('Creating')}` : `${t('createAccount')}`}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="px-3 text-gray-400 text-sm">{t('or')}</span>
            <hr className="flex-1 border-gray-300" />
          </div>
          {/* SOCIAL LOGIN */}
          <div className="flex max-sm:flex-wrap justify-center items-center gap-3">

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="w-full flex items-center justify-center  gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="material-icon-theme:google" />
              {t('google')}
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="mdi:github" />
              {t('github')}
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="mdi:facebook" className="text-blue-600" />
              {t('facebook')}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t('alreadyHaveAccount')}{" "}
            <span onClick={()=>navigate('/auth/login')} className="text-[#1f5138] font-medium cursor-pointer">
              {t('login')}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}