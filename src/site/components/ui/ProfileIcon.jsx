import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
// import { useLanguageStore } from "../../../store/LanguageStore";
import { useNavigate } from "react-router-dom";

function ProfileIcon() {
  const navigate = useNavigate();
  const [sss, content] = useState();
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
  const lang = 'en'
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const isLoggedIn = true; 

  const user = {
    name: "Alireza",
    email: "alireza@gmail.com",
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center max-sm:hidden gap-2 ml-2 ">
        <button onClick={()=>navigate('/login')} className="px-4 py-2 text-sm border rounded-md bg-gray-200/50 hover:bg-gray-200">
          Login
        </button>
        <button onClick={()=>navigate('/register')} className="px-4 py-2 text-sm bg-[#1f5138] text-white rounded-md hover:opacity-90">
          Register
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
        <span className="hidden md:block text-[#133d28]">{user.name}</span>
        <Icon icon="mdi:chevron-down" />
      </button>

      {/* Dropdown */}
      <div
        className={`${lang === 'fa'|| lang === 'ps' ? 'left-0' :"right-0"} absolute mt-2 w-56 border border-gray-200 bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-200 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* User Info */}
        <div className="px-4 py-3 border-b">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Menu */}
        <div className="flex flex-col">
          {usermenu.map((item , index)=>{
            return(
              <button key={index} className={`${item.name === "logout" ?'hover:bg-red-50 text-red-600':''} flex items-center gap-2 px-4 py-2 hover:bg-gray-100`}>
                <Icon icon={item.icon} />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default ProfileIcon;