import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import ali from "../../../assets/images/ali.png";
import { useNavigate } from "react-router-dom";

function MobileMunuIcon({is_login}) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const mobileref = useRef();
  const mainMenuIcomRef = useRef();
  const menuitems = [
    { name: "home", label: "Home", url: "/" },
    { name: "shop", label: "Shop", url: "/shop" },
    { name: "categories", label: "Categories", url: "/categories" },
    { name: "about", label: "About", url: "/about" },
    { name: "contact", label: "Contact Us", url: "/contact" }
];
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
  const lang = 'en';
  const navigate = useNavigate()


  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        mobileref.current &&
        !mobileref.current.contains(e.target) &&
        mainMenuIcomRef.current &&
        !mainMenuIcomRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleProfileToggle = ({is_login}) => {
    setProfileOpen(!profileOpen);
  };

  const handlemobialDropdownToggle = () => {
    setOpen(!open);
  };


  return (
    <div className="relative">
      <Icon
        ref={mainMenuIcomRef}
        icon={!open ? "mage:dash-menu" : "lets-icons:close-round"}
        className="max-sm:flex cursor-pointer"
        width="28"
        height="28"
        onClick={handlemobialDropdownToggle}
      />

      {/* Mobile Menu Dropdown */}
      {open && (
        <div
          ref={mobileref}
          className={`${lang === 'fa'|| lang === 'ps' ? '-left-2' :"-right-2 "} absolute top-[50px] z-50 w-72 border border-gray-200 bg-white shadow-lg rounded-md flex flex-col gap-2`}
        >
          {is_login && (
            <div className="relative px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 bg-gray-300 rounded-full bg-center bg-cover"
                  style={{ backgroundImage: `url(${ali})` }}
                ></div>
                <div>
                  <p claxssName="font-semibold">Alireza</p>
                  <p className="text-sm text-gray-500">ali@gmail.com</p>
                </div>
              </div>
              <span
                onClick={handleProfileToggle}
                className="p-1 bg-gray-100 rounded-full"
              >
                <Icon
                  icon={
                    !profileOpen ? "iconamoon:arrow-down-2" : "formkit:close"
                  }
                  width="24"
                  height="24"
                />
              </span>

              {/* Profile Dropdown (conditionally rendered) */}

              {profileOpen && (
                <div className="absolute top-14 right-3 mt-2  w-64 border border-gray-200 bg-gray-100 shadow-xl rounded-md">
                  {usermenu.map((item , index)=>{
                    return(
                      <button key={index} className="flex items-center gap-2 border-b w-full text-left px-4 py-3 hover:bg-gray-200">
                        <Icon icon={item.icon} width={20} height={20} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
          <div className=" flex flex-col ">
            {menuitems.map((item, idx) => (
              <button
                key={idx}
                className="flex items-center  px-4 py-2 border-b border-gray-100 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </div>

          {!is_login && (
            <div className="flex flex-col gap-2 px-4 pb-3">
              <button onClick={()=>navigate('/login')} className="px-4 py-2 w-full text-sm border rounded-md bg-gray-200/50 hover:bg-gray-200">
                Login
              </button>
              <button onClick={()=>navigate('/register')} className="px-4 py-2 w-full text-sm bg-[#1f5138] text-white rounded-md hover:opacity-90">
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MobileMunuIcon;
