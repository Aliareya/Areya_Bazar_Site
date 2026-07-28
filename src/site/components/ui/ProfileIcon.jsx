import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useLangStore from "../../../stores/LangStore";
import { useTranslation } from "react-i18next";

// ==========================================
// MENU DEFINITIONS PER ROLE
// ==========================================

const ADMIN_MENU = [
  { name: "dashboard", label: "Dashboard", icon: "mdi:view-dashboard-outline", url: "dashboard" },
  { name: "profile", label: "Profile", icon: "qlementine-icons:user-16", url: "profile" },
  { name: "settings", label: "Settings", icon: "uil:setting", url: "settings" },
  { name: "logout", label: "Logout", icon: "line-md:logout", url: "#", danger: true },
];

const SELLER_MENU = [
  { name: "dashboard", label: "Dashboard", icon: "mdi:view-dashboard-outline", url: "dashboard" },
  { name: "logout", label: "Logout", icon: "line-md:logout", url: "#", danger: true },
];

const BUYER_MENU = [
  { name: "profile", label: "Profile", icon: "qlementine-icons:user-16", url: "profile" },
  { name: "logout", label: "Logout", icon: "line-md:logout", url: "#", danger: true },
];

function getMenuByRole(role) {
  if (role === "admin") return ADMIN_MENU;
  if (role === "seller") return SELLER_MENU;
  return BUYER_MENU;
}

function ProfileIcon() {
  const { t } = useTranslation("header");
  const { t: c } = useTranslation("common");
  const { loading, is_login, user, logout } = useAuth();
  const { language: lang } = useLangStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 ml-2">
        <div className="w-24 h-9 bg-gray-200 rounded-md animate-pulse max-sm:hidden" />
        <div className="w-9 h-9 bg-gray-200 rounded-md animate-pulse sm:hidden" />
      </div>
    );
  }

  if (!is_login) {
    return (
      <div className="flex items-center max-sm:hidden gap-2 ml-2">
        <button
          onClick={() => navigate("/auth/login")}
          className="px-4 py-2 text-sm border rounded-md bg-gray-200/50 hover:bg-gray-200"
        >
          {c("login")}
        </button>
        <button
          onClick={() => navigate("/auth/register")}
          className="px-4 py-2 text-sm bg-[#1f5138] text-white rounded-md hover:opacity-90"
        >
          {c("register")}
        </button>
      </div>
    );
  }

  // Fallback so we don't crash if user is momentarily null
  if (!user) return null;

  const firstName = user.firstName ?? user.first_name ?? "";
  const lastName = user.lastName ?? user.last_name ?? "";
  const profileImage = user.profileImage ?? user.image ?? null;

  const usermenu = getMenuByRole(user.role);

  function handleMenuClick(item) {
    setOpen(false);

    // Logout is a special action, not a navigation
    if (item.name === "logout") {
      logout();
      navigate("/auth/login");
      return;
    }

    if (user.role === "admin") {
      navigate(`/admin/${item.url}`);
      return;
    }

    if (user.role === "seller") {
      navigate(`/seller/${item.url}`);
      return;
    }

    navigate(`/${item.url}`);
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 ml-1 bg-gray-100 rounded-md"
      >
        {user?.image ? (<div className="w-7 h-7 rounded-full bg-cover bg-center"
        style={{backgroundImage : `url(${user?.image})`}}></div>) :(
          <Icon icon="mdi:account-circle" className="text-2xl" />
        )}
        <span className="hidden md:block text-[#133d28]">{firstName}</span>
        <Icon icon="mdi:chevron-down" />
      </button>

      {/* Dropdown */}
      <div
        className={`${
          lang === "fa" || lang === "ps" ? "left-0" : "right-0"
        } absolute mt-2 w-56 border border-gray-200 bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-200 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* User Info */}
        <div className="px-4 py-3 border-b flex items-center gap-4">
          {profileImage ? (
            <div
              className="w-9 h-9 rounded-full bg-gray-200 bg-cover bg-center"
              style={{ backgroundImage: `url(${profileImage})` }}
            />
          ) : (
            <Icon icon="mdi:account-circle" className="text-3xl" />
          )}

          <div>
            <p className="font-semibold">
              {firstName} {lastName}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col">
          {usermenu.map((item, index) => (
            <button
              onClick={() => handleMenuClick(item)}
              key={index}
              className={`${
                item.name === "logout" ? "hover:bg-red-50 text-red-600" : ""
              } flex items-center gap-2 px-4 py-2 hover:bg-gray-100`}
            >
              <Icon icon={item.icon} />
              {t(item.name)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileIcon;