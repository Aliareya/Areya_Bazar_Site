// src/components/seller-dashboard/Topbar.jsx
import { Icon } from "@iconify/react";

export default function SellerTopbar({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">

      {/* Hamburger – mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors shrink-0"
        aria-label="باز کردن منو"
      >
        <Icon icon="solar:hamburger-menu-linear" className="text-xl text-gray-600" />
      </button>

      {/* Search – sm+ */}
      <div className="flex-1 max-w-lg relative hidden sm:block">
        <Icon
          icon="solar:magnifer-linear"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none"
        />
        <input
          type="text"
          placeholder="جستجوی سفارش، محصول یا مشتری..."
          className="w-full bg-gray-100 rounded-xl pr-10 pl-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-200 focus:bg-white border border-transparent focus:border-emerald-200 transition-all"
        />
      </div>

      {/* Search icon – mobile only */}
      <button className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors shrink-0">
        <Icon icon="solar:magnifer-linear" className="text-lg text-gray-500" />
      </button>

      <div className="flex-1 sm:hidden" />
      <div className="hidden sm:block flex-1" />

      {/* Notification */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors shrink-0">
        <Icon icon="solar:bell-bing-bold-duotone" className="text-xl text-gray-500" />
        <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
      </button>

      {/* Divider */}
      <div className="hidden sm:block w-px h-7 bg-gray-200" />

      {/* User */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800 leading-tight hidden sm:block">علیرضا محمدی</p>
          <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">مدیر ارشد</p>
          <p className="text-xs font-semibold text-gray-800 sm:hidden">علیرضا</p>
        </div>
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold select-none shrink-0">
          عم
        </div>
      </div>

    </header>
  );
}