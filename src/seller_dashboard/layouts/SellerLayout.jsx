// src/components/seller-dashboard/SellerLayout.jsx
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import SellerDashboard from "../pages/SellerDashboard";
import SellerSidebar   from "./SellerSidebar";
import SellerTopbar    from "./SellerTopbar";
import CreateStore     from "../pages/CreateStor";
import { useSeller }   from "../../context/SellerContext";

/* ─────────────────────── No Store Card ──────────────────── */
function NoStoreCard({ onCreateClick }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-140px)]">
      <div className="w-full max-w-md mx-auto text-center space-y-6 px-4">

        {/* ── Animated icon ── */}
        <div className="relative inline-flex items-center justify-center">
          <span className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-emerald-100 animate-ping opacity-30" />
          <span className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-50 animate-pulse opacity-50" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-200/50">
            <Icon icon="solar:shop-bold-duotone" className="text-white text-4xl sm:text-5xl" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-lg border-4 border-[#f1f1ec]">
            <Icon icon="solar:add-circle-bold" className="text-[#14532d] text-lg sm:text-xl" />
          </div>
        </div>

        {/* ── Text ── */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            هنوز فروشگاهی ندارید!
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
            برای شروع فروش در آریا بازار، ابتدا فروشگاه خود را ایجاد کنید.
            فقط چند دقیقه طول می‌کشد! 🚀
          </p>
        </div>

        {/* ── Steps preview ── */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          {[
            { icon: "solar:shop-bold",         label: "ایجاد فروشگاه", step: "۱" },
            { icon: "solar:box-bold",          label: "افزودن محصول",  step: "۲" },
            { icon: "solar:wallet-money-bold", label: "شروع فروش",     step: "۳" },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Icon icon={s.icon} className="text-emerald-600 text-base" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-tight">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── CTA Button ── */}
        <button
          onClick={onCreateClick}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#15803d] text-white text-sm sm:text-base font-bold hover:bg-[#166534] active:scale-95 transition-all duration-200 shadow-lg shadow-emerald-200/60 hover:shadow-xl hover:shadow-emerald-200/80"
        >
          <Icon icon="solar:add-circle-bold" className="text-xl" />
          ایجاد فروشگاه
        </button>

        <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
          <Icon icon="solar:info-circle-bold" className="text-xs" />
          سوالی دارید؟ با پشتیبانی تماس بگیرید
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── Content Loading Skeleton ───────── */
function ContentLoadingSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5 animate-pulse">

      {/* ── Heading skeleton ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-16 bg-gray-200 rounded-md" />
            <div className="h-3 w-3 bg-gray-200 rounded-md" />
            <div className="h-3 w-20 bg-gray-200 rounded-md" />
          </div>
          <div className="h-7 w-40 bg-gray-200 rounded-lg" />
          <div className="h-3 w-64 bg-gray-100 rounded-md" />
        </div>
        <div className="flex gap-2.5">
          <div className="h-10 w-24 bg-gray-200 rounded-xl" />
          <div className="h-10 w-32 bg-gray-200 rounded-xl" />
        </div>
      </div>

      {/* ─ Stat cards skeleton ── */}
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded-md" />
                <div className="h-6 w-28 bg-gray-200 rounded-lg" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-14 bg-gray-100 rounded-md" />
              <div className="h-3 w-24 bg-gray-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts skeleton ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
        <div className="xl:col-span-7 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-3">
              <div className="h-3 w-16 bg-gray-200 rounded-md" />
              <div className="h-3 w-12 bg-gray-200 rounded-md" />
            </div>
            <div className="h-4 w-28 bg-gray-200 rounded-md" />
          </div>
          <div className="h-52 bg-gray-50 rounded-xl" />
        </div>
        <div className="xl:col-span-5 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="h-4 w-24 bg-gray-200 rounded-md mb-4 ml-auto" />
          <div className="flex justify-center py-4">
            <div className="w-36 h-36 rounded-full bg-gray-100" />
          </div>
          <div className="space-y-3 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 w-8 bg-gray-100 rounded-md" />
                <div className="flex items-center gap-2">
                  <div className="h-3 w-16 bg-gray-100 rounded-md" />
                  <div className="w-2.5 h-2.5 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row skeleton ── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4">
        <div className="xl:col-span-7 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="h-4 w-24 bg-gray-200 rounded-md mb-4 ml-auto" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div className="h-4 w-16 bg-gray-100 rounded-md" />
                <div className="flex items-center gap-3">
                  <div className="h-3 w-20 bg-gray-100 rounded-md" />
                  <div className="h-3 w-16 bg-gray-100 rounded-md" />
                  <div className="h-5 w-20 bg-gray-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="xl:col-span-5 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="h-4 w-28 bg-gray-200 rounded-md mb-4 ml-auto" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full mt-1 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-full bg-gray-100 rounded-md" />
                  <div className="h-2.5 w-24 bg-gray-100 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Full Page Loading ──────────────── */
function FullPageLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-140px)]">
      <div className="flex flex-col items-center gap-4">
        {/* spinner */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon icon="solar:shop-bold-duotone" className="text-emerald-600 text-lg" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-gray-700">در حال بارگذاری...</p>
          <p className="text-xs text-gray-400">اطلاعات فروشگاه در حال دریافت است</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Main Layout ────────────────────── */
export default function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { getSellerData, seller, loading } = useSeller();
  const navigate = useNavigate();
  
  useEffect(() => {
    getSellerData();
    console.log(seller)
  }, []);

  const hasStore = !!seller?.store;

  const handleCreateStore = () => {
    navigate("/seller/createstor");
    setSidebarOpen(false);
  };

  /* ── چه چیزی رندر شود؟ ── */
  const renderContent = () => {
    // 1️⃣ در حال لودینگ → اسکلتون کامل صفحه
    if (loading) {
      return <FullPageLoading />;
    }

    // 2️⃣ فروشگاه ندارد
    if (!hasStore) {
      return (
        <Routes>
          {/* صفحه ایجاد فروشگاه حتی بدون فروشگاه قابل دسترسی است */}
          <Route path="/seller/createstor" element={<CreateStore />} />
          {/* هر مسیر دیگر → کارت «فروشگاه ندارید» */}
          <Route path="*" element={<NoStoreCard onCreateClick={handleCreateStore} />} />
        </Routes>
      );
    }

    // 3️⃣ فروشگاه دارد → مسیرهای عادی
    return (
      <Routes>
        <Route path="/seller/dashboard"  element={<SellerDashboard />} />
        <Route path="/seller/createstor" element={<CreateStore />} />
        {/* سایر مسیرها را اینجا اضافه کنید */}
        <Route path="*" element={<SellerDashboard />} />
      </Routes>
    );
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f1f1ec] font-sans">

      {/* ══ Sidebar ══ */}
      <SellerSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        hasStore={hasStore}
      />

      {/* ══ Main wrapper ══ */}
      <main className="flex-1 lg:mr-60 flex flex-col min-h-screen min-w-0">

        {/* ── Topbar ── */}
        <SellerTopbar onMenuClick={() => setSidebarOpen(true)} />

        {/* ── Page content ── */}
        <div className="flex-1 p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {renderContent()}
        </div>

      </main>
    </div>
  );
}