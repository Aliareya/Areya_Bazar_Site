import React, { useState } from "react";
import { Icon } from "@iconify/react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email || !form.password) {
      return "Please fill all fields";
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

      console.log("Login user:", form);
      alert("Login successful!");
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

  return (
    <div className="min-h-screen py-5 flex items-center justify-center bg-gray-100 max-sm:px-3 md:px-5 max-md:px-6 lg:px-10">

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex">

        {/* LEFT IMAGE */}
        <div className="hidden lg:block w-1/2">
          <img
            src="https://i.pinimg.com/736x/4b/7e/1f/4b7e1f5ef71701edfc4b72f4cde6578d.jpg"
            alt="login"
            className="h-full w-full object-cover"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 lg:p-8 md:p-6 max-md:p-5 p-3">

          <h2 className="text-2xl font-bold text-center text-[#1f5138] mb-2">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 text-sm mb-4">
            Login to continue buying or selling
          </p>

          {/* ERROR */}
          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />

            {/* PASSWORD */}
            <div className="relative !z-0">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 cursor-pointer"
              >
                <Icon icon={!showPassword ? "mdi:eye-off" : "mdi:eye"} />
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1f5138] text-white py-2 rounded-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="flex max-sm:flex-wrap justify-center items-center gap-3">

            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="logos:google-icon" />
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="mdi:github" />
              GitHub
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50"
            >
              <Icon icon="mdi:facebook" className="text-blue-600" />
              Facebook
            </button>
          </div>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <span className="text-[#1f5138] font-medium cursor-pointer">
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}