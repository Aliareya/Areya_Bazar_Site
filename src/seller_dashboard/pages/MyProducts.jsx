/**
 * ProductsPage.jsx
 * Areya Bazar — Seller "My Products" page
 *
 * Setup: same as SellerDashboard.jsx
 *  1. npm install @iconify/react
 *  2. Add Vazirmatn font link to index.html <head>
 *  3. <html lang="fa" dir="rtl">
 */

import { useState } from "react";
import { Icon } from "@iconify/react";

const navItems = [
  { label: "داشبورد", icon: "solar:widget-5-bold-duotone" },
  { label: "محصولات من", icon: "solar:box-bold-duotone", active: true },
  { label: "سفارش‌ها", icon: "solar:cart-large-2-bold-duotone", badge: "۱۲" },
  { label: "کیف پول", icon: "solar:wallet-bold-duotone" },
  { label: "پیام‌ها", icon: "solar:chat-round-dots-bold-duotone" },
  { label: "نظرات", icon: "solar:star-bold-duotone" },
  { label: "تنظیمات", icon: "solar:settings-bold-duotone" },
];

const miniStats = [
  { label: "کل محصولات", value: "۱۲۸", icon: "solar:widget-4-bold-duotone", bg: "#146C481A", color: "#146C48" },
  { label: "فعال", value: "۱۱۴", icon: "solar:check-circle-bold-duotone", bg: "#D1FAE5", color: "#059669" },
  { label: "ناموجود", value: "۹", icon: "solar:box-minimalistic-bold-duotone", bg: "#FEE2E2", color: "#EF4444" },
  { label: "پیش‌نویس", value: "۵", icon: "solar:pen-new-square-bold-duotone", bg: "#FEF3C7", color: "#F59E0B" },
];

const filterTabs = ["همه (۱۲۸)", "فعال (۱۱۴)", "ناموجود (۹)", "پیش‌نویس (۵)"];

const statusStyles = {
  active: "bg-emerald-50 text-emerald-600",
  out_of_stock: "bg-red-50 text-red-500",
  draft: "bg-slate-100 text-slate-500",
};
const statusLabels = { active: "فعال", out_of_stock: "ناموجود", draft: "پیش‌نویس" };

const stockBarColor = { active: "bg-emerald-500", warning: "bg-amber-500", empty: "bg-red-500" };
const stockTrackColor = { active: "bg-emerald-100", warning: "bg-amber-100", empty: "bg-red-100" };

const products = [
  { name: "Modern Wooden Chair", category: "Furniture", gradient: "from-[#0E3327] to-[#1C8557]", price: "$102.00", stock: 41, stockPct: 82, stockLevel: "active", sales: "۲۸۰ فروش", rating: "4.7", status: "active" },
  { name: "Minimal Table Lamp", category: "Lighting", gradient: "from-sky-800 to-sky-500", price: "$58.50", stock: 12, stockPct: 24, stockLevel: "warning", sales: "۱۹۵ فروش", rating: "4.5", status: "active" },
  { name: "Luxury Sofa", category: "Living Room", gradient: "from-orange-700 to-orange-400", price: "$360.00", stock: 48, stockPct: 95, stockLevel: "active", sales: "۳۱۰ فروش", rating: "4.9", status: "active" },
  { name: "Office Desk", category: "Office", gradient: "from-slate-800 to-slate-500", price: "$209.00", stock: 0, stockPct: 0, stockLevel: "empty", sales: "۱۴۰ فروش", rating: "4.3", status: "out_of_stock" },
  { name: "Comfort Bed", category: "Bedroom", gradient: "from-cyan-900 to-cyan-500", price: "$510.00", stock: 15, stockPct: 30, stockLevel: "warning", sales: "۹۸ فروش", rating: "5.0", status: "draft" },
];

function NavLink({ label, icon, active, badge }) {
  return (
    <a
      href="#"
      className={
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition " +
        (active ? "bg-[#F0B429] text-[#071C15] font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white")
      }
    >
      <Icon icon={icon} width={20} />
      {label}
      {badge && <span className="mr-auto bg-white/10 text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
    </a>
  );
}

function ProductRow({ product }) {
  return (
    <tr className="hover:bg-[#F7F8F4]/60">
      <td className="py-3 px-4">
        <input type="checkbox" className="rounded" />
      </td>
      <td className="py-3 px-4 flex items-center gap-3">
        <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${product.gradient} shrink-0`} />
        <div>
          <p className="font-semibold text-[#142019]">{product.name}</p>
          <p className="text-[12px] text-[#5B6B63]">{product.category}</p>
        </div>
      </td>
      <td className="py-3 px-4 font-semibold text-[#142019]">{product.price}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-16 h-1.5 rounded-full ${stockTrackColor[product.stockLevel]}`}>
            <div className={`h-1.5 rounded-full ${stockBarColor[product.stockLevel]}`} style={{ width: `${product.stockPct}%` }} />
          </div>
          <span className="text-[12px] text-[#5B6B63]">{product.stock}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-[#5B6B63]">{product.sales}</td>
      <td className="py-3 px-4">
        <span className="flex items-center gap-1 text-amber-500">
          <Icon icon="solar:star-bold" width={13} />
          {product.rating}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[product.status]}`}>
          {statusLabels[product.status]}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-lg hover:bg-[#F7F8F4] flex items-center justify-center text-[#5B6B63]">
            <Icon icon="solar:eye-bold" width={16} />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-[#F7F8F4] flex items-center justify-center text-[#146C48]">
            <Icon icon="solar:pen-bold" width={16} />
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400">
            <Icon icon="solar:trash-bin-trash-bold" width={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function MyProducts() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8F4] text-[#142019]" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-[#071C15] text-white flex-col justify-between py-6 px-4 hidden lg:flex">
          <div>
            <div className="flex items-center gap-2 px-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#F0B429] flex items-center justify-center font-extrabold text-[#071C15] text-sm">
                AB
              </div>
              <div>
                <p className="font-bold text-[15px] leading-none">آریا بازار</p>
                <p className="text-[11px] text-white/50 mt-1">پنل فروشندگان</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink key={item.label} {...item} />
              ))}
            </nav>
          </div>
          <div>
            <div className="border-t border-white/10 pt-4 flex items-center gap-3 px-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                <Icon icon="solar:user-circle-bold-duotone" width={22} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">علی رضا</p>
                <p className="text-[11px] text-white/50">فروشنده</p>
              </div>
            </div>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/5 hover:text-white text-sm transition">
              <Icon icon="solar:logout-2-bold" width={20} /> خروج
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 lg:p-8 max-w-[1400px]">
          {/* Topbar */}
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Icon icon="solar:magnifer-linear" width={18} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-[#5B6B63]" />
              <input
                placeholder="جستجو در محصولات..."
                className="w-full bg-white border border-[#E7EAE5] rounded-full py-2.5 pr-10 pl-4 text-sm outline-none focus:border-[#146C48]"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-10 h-10 rounded-full bg-white border border-[#E7EAE5] flex items-center justify-center">
                <Icon icon="solar:bell-bold-duotone" width={19} className="text-[#0E3327]" />
                <span className="absolute top-2 left-2.5 w-1.5 h-1.5 rounded-full bg-[#F0B429]" />
              </button>
              <button className="flex items-center gap-2 bg-[#F0B429] hover:bg-[#F6C94E] text-[#071C15] font-semibold text-sm px-4 py-2.5 rounded-full transition">
                <Icon icon="solar:add-circle-bold" width={18} /> افزودن محصول
              </button>
            </div>
          </div>

          {/* Page header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0E3327]">محصولات من</h1>
              <p className="text-[13px] text-[#5B6B63] mt-1">
                مدیریت و ویرایش محصولات فروشگاه «مبلمان آریانا» — ۱۲۸ محصول
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white border border-[#E7EAE5] text-[#142019] text-sm font-semibold px-4 py-2.5 rounded-full">
                <Icon icon="solar:export-bold" width={17} /> خروجی اکسل
              </button>
              <button className="flex items-center gap-2 bg-[#146C48] hover:bg-[#1C8557] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition">
                <Icon icon="solar:add-circle-bold" width={18} /> افزودن محصول جدید
              </button>
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {miniStats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#E7EAE5] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg, color: s.color }}>
                  <Icon icon={s.icon} width={20} />
                </div>
                <div>
                  <p className="text-lg font-extrabold">{s.value}</p>
                  <p className="text-[12px] text-[#5B6B63]">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-[#E7EAE5] p-4 mb-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {filterTabs.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={
                    "text-sm font-semibold px-4 py-2 rounded-full transition " +
                    (activeTab === i ? "bg-[#146C48] text-white" : "font-medium text-[#5B6B63] hover:bg-[#F7F8F4]")
                  }
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select className="text-sm border border-[#E7EAE5] rounded-full px-4 py-2 text-[#142019] outline-none bg-white">
                <option>همه دسته‌ها</option>
                <option>Furniture</option>
                <option>Lighting</option>
                <option>Living Room</option>
              </select>
              <button className="w-9 h-9 rounded-full border border-[#E7EAE5] flex items-center justify-center text-[#5B6B63]">
                <Icon icon="solar:sort-vertical-bold" width={17} />
              </button>
            </div>
          </div>

          {/* Products table */}
          <div className="bg-white rounded-2xl border border-[#E7EAE5] overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#5B6B63] text-[12px] border-b border-[#E7EAE5] bg-[#F7F8F4]">
                    <th className="text-right font-medium py-3 px-4 w-8">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="text-right font-medium py-3 px-4">محصول</th>
                    <th className="text-right font-medium py-3 px-4">قیمت</th>
                    <th className="text-right font-medium py-3 px-4">موجودی</th>
                    <th className="text-right font-medium py-3 px-4">فروش</th>
                    <th className="text-right font-medium py-3 px-4">امتیاز</th>
                    <th className="text-right font-medium py-3 px-4">وضعیت</th>
                    <th className="text-right font-medium py-3 px-4">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EAE5]">
                  {products.map((product) => (
                    <ProductRow key={product.name} product={product} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E7EAE5]">
              <p className="text-[12px] text-[#5B6B63]">نمایش ۱ تا ۵ از ۱۲۸ محصول</p>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg border border-[#E7EAE5] flex items-center justify-center text-[#5B6B63]">
                  <Icon icon="solar:alt-arrow-right-linear" width={16} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#146C48] text-white text-[12px] font-semibold flex items-center justify-center">۱</button>
                <button className="w-8 h-8 rounded-lg text-[12px] font-medium text-[#5B6B63] hover:bg-[#F7F8F4] flex items-center justify-center">۲</button>
                <button className="w-8 h-8 rounded-lg text-[12px] font-medium text-[#5B6B63] hover:bg-[#F7F8F4] flex items-center justify-center">۳</button>
                <button className="w-8 h-8 rounded-lg border border-[#E7EAE5] flex items-center justify-center text-[#5B6B63]">
                  <Icon icon="solar:alt-arrow-left-linear" width={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}