// src/components/seller-dashboard/Sidebar.jsx

import { Icon } from "@iconify/react";

const NAV_ITEMS = [
  {
    label: "داشبورد",
    icon: "solar:widget-5-bold-duotone",
    active: true,
    requiresStore: true,
  },
  {
    label: "سفارشات",
    icon: "solar:cart-large-bold-duotone",
    badge: "۲۴",
    requiresStore: true,
  },
  {
    label: "محصولات",
    icon: "solar:box-bold-duotone",
    requiresStore: true,
  },
  {
    label: "فروشگاه‌ها",
    icon: "solar:shop-bold-duotone",
    requiresStore: true,
  },
  {
    label: "مشتریان",
    icon: "solar:users-group-rounded-bold-duotone",
    requiresStore: true,
  },
  {
    label: "تنظیمات",
    icon: "solar:settings-bold-duotone",
    requiresStore: true,
  },

  // این یکی همیشه فعال است
  {
    label: "ایجاد فروشگاه",
    icon: "solar:shop-add-bold-duotone",
    requiresStore: false,
  },
];

export default function SellerSidebar({
  isOpen,
  onClose,
  hasStore,
}) {
  const Inner = ({ onNav }) => (
    <>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">

        <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-[#14532d] font-extrabold text-sm shrink-0 select-none">
          AB
        </div>

        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">
            آریا بازار
          </p>

          <p className="text-emerald-300/60 text-[10px] mt-0.5">
            پنل مدیریت فروشگاه
          </p>
        </div>

        <button
          onClick={onClose}
          className="mr-auto lg:hidden text-white/50 hover:text-white transition-colors shrink-0"
          aria-label="بستن منو"
        >
          <Icon
            icon="solar:close-circle-linear"
            className="text-xl"
          />
        </button>
      </div>


      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">

        {NAV_ITEMS.map((item) => {

          // آیا این آیتم باید disabled باشد؟
          const disabled =
            item.requiresStore && !hasStore;


          return (
            <button
              key={item.label}

              disabled={disabled}

              onClick={() => {
                if (disabled) return;

                onNav?.();
              }}

              className={[
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",

                // فعال
                !disabled && item.active
                  ? "bg-white/15 text-white font-semibold shadow-sm"

                  // فعال ولی inactive
                  : !disabled
                  ? "text-emerald-200/60 hover:bg-white/10 hover:text-white"

                  // disabled
                  : "text-emerald-200/25 cursor-not-allowed opacity-50",
              ].join(" ")}
            >

              {/* Icon */}
              <Icon
                icon={item.icon}
                className="text-lg shrink-0"
              />

              {/* Label */}
              <span className="flex-1 text-right">
                {item.label}
              </span>


              {/* Badge */}
              {item.badge && !disabled && (
                <span className="bg-amber-400 text-[#14532d] text-[10px] font-extrabold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {item.badge}
                </span>
              )}


              {/* Lock */}
              {disabled && (
                <Icon
                  icon="solar:lock-keyhole-bold"
                  className="text-sm text-emerald-200/30"
                />
              )}

            </button>
          );
        })}

      </nav>


      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">

        <div className="flex items-center gap-1.5 text-emerald-300/40 text-[11px]">

          <Icon
            icon="solar:info-circle-bold-duotone"
            className="text-xs"
          />

          <span>
            نسخه ۲.۴.۰
          </span>

        </div>

      </div>
    </>
  );


  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}


      {/* Mobile drawer */}
      <aside
        className={[
          "fixed top-0 right-0 h-screen w-64 bg-[#14532d] z-40 flex flex-col",
          "transition-transform duration-300 ease-in-out lg:hidden",
          isOpen
            ? "translate-x-0"
            : "translate-x-full",
        ].join(" ")}
      >
        <Inner onNav={onClose} />
      </aside>


      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 bg-[#14532d] flex-col fixed right-0 top-0 h-screen z-20">
        <Inner />
      </aside>
    </>
  );
}