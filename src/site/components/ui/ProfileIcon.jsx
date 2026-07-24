import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useLangStore from "../../../stores/LangStore";
import { useTranslation } from "react-i18next";

function ProfileIcon({user}) {
  const {t} = useTranslation('header')
  const {t:c} = useTranslation('common')
  const { loading, is_login } = useAuth();
  const { language :lang } = useLangStore()
  const navigate = useNavigate();
  const usermenu = [
    {
      name: "dashboard",
      label: "Dashboard",
      icon: "mdi:view-dashboard-outline",
      url: "/dashboard"
    },
    {
      name: "profile",
      label: "Profile",
      icon: "qlementine-icons:user-16",
      url: "/profile"
    },
    {
      name: "settings",
      label: "Settings",
      icon: "uil:setting",
      url: "/settings"
    },
    {
      name: "logout",
      label: "Logout",
      icon: "line-md:logout",
      url: "#",
      danger: true
    }
  ];
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
          {c('login')}
        </button>
        <button
          onClick={() => navigate("/auth/register")}
          className="px-4 py-2 text-sm bg-[#1f5138] text-white rounded-md hover:opacity-90"
        >
          {c('register')}
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={` flex items-center gap-2 p-1.5 ml-1 bg-gray-100 rounded-md`}
      >
        <Icon icon="mdi:account-circle" className="text-2xl" />
        <span className="hidden md:block text-[#133d28]">{user.first_name}</span>
        <Icon icon="mdi:chevron-down" />
      </button>

      {/* Dropdown */}
      <div
        className={`${lang === "fa" || lang === "ps" ? "left-0" : "right-0"
          } absolute mt-2 w-56 border border-gray-200 bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-200 ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        {/* User Info */}
        <div className="px-4 py-3 border-b flex items-center gap-4">
          {user?.image ? (<div className="w-9 h-9 rounded-full bg-gray-200"
            style={{ backgroundImage: `url(${`https://i.pinimg.com/1200x/ac/60/b0/ac60b0eadfe5183455d5fd7ccab07dfd.jpg`})` }}>
          </div>) : (
            <Icon icon="mdi:account-circle" className="text-3xl"/>
          )}
          
          <div>
            <p className="font-semibold">{user?.first_name}{" "}{user?.last_name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col">
          {usermenu.map((item, index) => (
            <button
              key={index}
              className={`${item.name === "logout" ? "hover:bg-red-50 text-red-600" : ""
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