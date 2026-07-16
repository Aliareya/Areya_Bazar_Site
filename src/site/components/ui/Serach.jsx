import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

function Search() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const searchBoxref = useRef(null);

  // Close search box when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchBoxref.current && !searchBoxref.current.contains(event.target)) {
                setOpen(false);
            }   
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }   , [searchBoxref]);

  // Auto focus when open
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <div className="">
      
      {/* Trigger Button */}
      <li
        onClick={() => setOpen(true)}
        className="hover:bg-gray-100 cursor-pointer p-0.5 list-none rounded-full text-[#1f5138] hover:text-[#133725] "
      >
        <Icon icon="mdi:magnify" className="text-2xl" />
      </li>

      {/* Search Box */}
      <div
        ref={searchBoxref}
        className={`absolute z-40 lg:top-24 lg:right-[30%] max-sm:right-6 max-sm:top-20 max-sm:w-80 max-md:w-96 md:w-96 max-md:right-40 md:right-44 max-md:top-24 md:top-24 lg:w-96 p-2 rounded-lg flex items-center bg-gray-100 shadow-lg transition-all duration-300 ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          className="w-full h-10 px-3 rounded-md outline-none bg-white"
        />

        {/* Search Button */}
        <button className="text-white bg-[#1f5138] h-10 px-4 ml-2 rounded-md hover:opacity-90">
          Search
        </button>

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="ml-2 text-gray-600 hover:text-black"
        >
          <Icon icon="mdi:close" className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default Search;