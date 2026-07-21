import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import useLangStore from "../../../stores/LangStore";
// import { useLanguageStore } from "../../../store/LanguageStore";

function LanguageIcon({ myclass = null }) {
  const { language, changeLanguage } = useLangStore();
  const [lang, setLang] = useState(language);
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleLanguageChange = (code) => {
    localStorage.setItem("siteLang", code);
    changeLanguage(code)
    setLang(code)
    setOpen(false);
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const languages = [
    { code: "fa", label: "فارسی 🇦🇫" },
    { code: "ps", label: "پښتو 🇦🇫" },
    { code: "en", label: "English 🇺🇸" },
  ];

  return (
    <div className="relative !z-auto" ref={ref}>

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={` flex items-center gap-2 px-2.5 py-1.5 bg-gray-100 rounded-md hover:bg-gray-200 ${myclass}`}
      >
        <Icon icon="mdi:translate" className="" color="#1f5138" />
        <span className="uppercase text-[#1f5138]">{lang}</span>
        <Icon icon="mdi:chevron-down" />
      </button>

      {/* Dropdown */}
      <div
        className={`${lang === "fa" || lang === "ps" ? "right-0" : "right-0"} !z-50 absolute  mt-2 w-40 border border-gray-200 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200 ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        {languages.map((item) => (
          <button
            key={item.code}
            onClick={() => handleLanguageChange(item.code)}
            className="w-full text-left px-4 py-2  hover:bg-gray-100 border border-gray-100"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageIcon;