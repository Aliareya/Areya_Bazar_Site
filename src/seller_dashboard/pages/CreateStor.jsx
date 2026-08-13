// src/pages/CreateStore.jsx
import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useSeller } from "../../context/SellerContext";

/* ─────────────────────── static options ─────────────────── */
const CITIES = [
  "کابل", "هرات", "مزار شریف", "قندهار", "جلال‌آباد",
  "کندز", "غزنی", "بامیان", "پلخمری", "فیض‌آباد",
];

const COUNTRIES = ["افغانستان"];

const CATEGORIES = [
  { value: "supermarket", label: "سوپرمارکت",      icon: "solar:cart-large-bold" },
  { value: "clothes",     label: "پوشاک",           icon: "solar:t-shirt-bold"    },
  { value: "digital",     label: "دیجیتال",         icon: "solar:smartphone-bold" },
  { value: "furniture",   label: "مبلمان",          icon: "solar:armchair-bold"   },
  { value: "lighting",    label: "روشنایی",         icon: "solar:lamp-bold"       },
  { value: "home",        label: "لوازم خانه",      icon: "solar:home-2-bold"     },
  { value: "food",        label: "مواد غذایی",      icon: "solar:cup-bold"        },
  { value: "beauty",      label: "زیبایی و بهداشت", icon: "solar:mirror-bold"     },
  { value: "sports",      label: "ورزشی",           icon: "solar:dumbbell-bold"   },
  { value: "other",       label: "سایر",            icon: "solar:box-bold"        },
];

const API_URL   = "http://localhost:3000/api/stores";
const TOKEN_KEY = "accessToken";
const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const REDIRECT_DELAY = 1800; // ms — مدت نمایش پیام موفقیت قبل از ریدایرکت

/* ─────────────────────── reusable field wrapper ──────────── */
function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-gray-400">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1 animate-fadeIn">
          <Icon icon="solar:danger-circle-bold" className="text-xs shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/* ─────────────────────── full-screen loading overlay ─────── */
function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white rounded-3xl shadow-xl px-10 py-8 border border-gray-100">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <Icon
            icon="solar:shop-bold"
            className="absolute inset-0 m-auto text-emerald-500 text-lg"
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">در حال ایجاد فروشگاه...</p>
          <p className="text-xs text-gray-400 mt-1">لطفاً چند لحظه صبر کنید</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── full-screen success overlay ─────── */
function SuccessOverlay({ visible, storeName }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white rounded-3xl shadow-xl px-10 py-9 border border-emerald-100 animate-scaleIn">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
          <Icon icon="solar:check-circle-bold" className="text-emerald-500 text-4xl animate-popIn" />
        </div>
        <div className="text-center">
          <p className="text-base font-extrabold text-gray-900">فروشگاه با موفقیت ایجاد شد!</p>
          {storeName && (
            <p className="text-xs text-gray-400 mt-1">«{storeName}» آماده است</p>
          )}
          <p className="text-xs text-emerald-600 mt-3 flex items-center justify-center gap-1.5">
            <Icon icon="solar:arrow-right-linear" className="text-sm rotate-180" />
            در حال انتقال به داشبورد...
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── input base classes ──────────────── */
const inputBase = [
  "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800",
  "placeholder-gray-400 outline-none transition-all duration-150",
  "focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400",
  "border-gray-200 hover:border-gray-300",
].join(" ");

const selectBase = [
  inputBase,
  "appearance-none cursor-pointer",
  "bg-[length:1.1rem] bg-[left_0.75rem_center] bg-no-repeat pr-4 pl-10",
].join(" ");

const errorInputClass = "border-red-300 ring-1 ring-red-200 focus:ring-red-200 focus:border-red-400";

/* ─────────────────────── main component ──────────────────── */
export default function CreateStore() {
  const { getSellerData } = useSeller();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const errorBannerRef = useRef(null);

  const [form, setForm] = useState({
    name:        "",
    description: "",
    street:      "",
    shopNumber:  "",
    city:        "",
    country:     "افغانستان",
    category:    "",
  });

  const [logoFile, setLogoFile]         = useState(null);
  const [logoPreview, setLogoPreview]   = useState(null);
  const [errors, setErrors]             = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError]         = useState("");

  /* ── auto redirect after success ── */
  useEffect(() => {
    if (submitStatus !== "success") return;
    const timer = setTimeout(() => {
      navigate("/seller/dashboard");
    }, REDIRECT_DELAY);
    return () => clearTimeout(timer);
  }, [submitStatus, navigate]);

  /* ── scroll to error banner when it appears ── */
  useEffect(() => {
    if (submitStatus === "error" && errorBannerRef.current) {
      errorBannerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitStatus]);

  /* ── helpers ── */
  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => {
      if (!p[key]) return p;
      const next = { ...p };
      delete next[key];
      return next;
    });
    if (submitStatus === "error") {
      setSubmitStatus("idle");
      setApiError("");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setErrors((p) => ({ ...p, logo: "فقط فایل‌های JPG، PNG یا WEBP مجاز هستند" }));
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setErrors((p) => ({ ...p, logo: "حجم لوگو نباید بیشتر از ۵ مگابایت باشد" }));
      return;
    }

    setErrors((p) => {
      const next = { ...p };
      delete next.logo;
      return next;
    });

    setLogoFile(file);
    setLogoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const removeLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── frontend validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = "نام فروشگاه الزامی است";
    if (!form.description.trim()) e.description = "توضیحات فروشگاه الزامی است";
    if (!form.city)               e.city        = "انتخاب شهر الزامی است";
    if (!form.country)            e.country     = "انتخاب کشور الزامی است";
    if (!form.category)           e.category    = "انتخاب دسته‌بندی الزامی است";
    setErrors((prev) => ({ ...e, ...(prev.logo ? { logo: prev.logo } : {}) }));
    return Object.keys(e).length === 0 && !errors.logo;
  };

  /**
   * Maps backend validation errors to form field errors.
   */
  const mapBackendErrors = (errData) => {
    const mapped = {};
    if (errData?.errors && typeof errData.errors === "object") {
      for (const [key, msgs] of Object.entries(errData.errors)) {
        mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
      }
    } else if (Array.isArray(errData?.message)) {
      errData.message.forEach((item) => {
        if (item.field && item.message) mapped[item.field] = item.message;
      });
    } else if (typeof errData?.message === "string") {
      setApiError(errData.message);
    }
    return mapped;
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setSubmitStatus("error");
      setApiError("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
      return;
    }

    setSubmitStatus("loading");
    setApiError("");
    setErrors({});

    try {
      // ✅ multipart/form-data payload — backend expects field "logo" for the file
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("city", form.city);
      formData.append("country", form.country);
      formData.append("address", `${form.city}/${form.country}`);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          // Content-Type را عمداً ست نمی‌کنیم؛ مرورگر خودش boundary درست را اضافه می‌کند
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          throw new Error("دسترسی غیرمجاز. لطفاً دوباره وارد شوید.");
        }
        const errData = await response.json().catch(() => null);
        const fieldErrors = mapBackendErrors(errData);

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          setSubmitStatus("error");
          setApiError("لطفاً خطاهای فرم را برطرف کنید.");
          return;
        }
        throw new Error(errData?.message || `خطای سرور: ${response.status}`);
      }

      // موفقیت — به‌روزرسانی seller و نمایش پیام؛ ریدایرکت با useEffect بالا انجام می‌شود
      setSubmitStatus("success");
      getSellerData();

    } catch (err) {
      console.error("Store creation failed:", err);
      setSubmitStatus("error");
      setApiError(err.message || "مشکلی در ارتباط با سرور پیش آمد");
    }
  };

  const selectedCat = CATEGORIES.find((c) => c.value === form.category);
  const isLoading   = submitStatus === "loading";
  const isSuccess   = submitStatus === "success";
  const isBusy      = isLoading || isSuccess;

  /* ─────────────────────── render ─────────────────────── */
  return (
    <div className="space-y-5 max-w-4xl mx-auto">

      <LoadingOverlay visible={isLoading} />
      <SuccessOverlay visible={isSuccess} storeName={form.name.trim()} />

      {/* ── Global error banner ── */}
      {submitStatus === "error" && apiError && (
        <div
          ref={errorBannerRef}
          className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 flex items-start gap-3 animate-fadeIn"
        >
          <Icon icon="solar:danger-triangle-bold" className="text-red-500 text-lg shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">{apiError}</p>
            {Object.keys(errors).length > 0 && (
              <ul className="mt-2 space-y-1">
                {Object.entries(errors).map(([key, msg]) => (
                  <li key={key} className="text-xs text-red-600 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                    {msg}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={() => { setSubmitStatus("idle"); setApiError(""); }}
            className="text-red-400 hover:text-red-600 transition-colors shrink-0"
          >
            <Icon icon="solar:close-circle-bold" className="text-lg" />
          </button>
        </div>
      )}

      {/* ── Page heading ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <span>پنل مدیریت</span>
            <Icon icon="solar:alt-arrow-left-linear" className="text-[10px]" />
            <span className="text-gray-500">فروشگاه‌ها</span>
            <Icon icon="solar:alt-arrow-left-linear" className="text-[10px]" />
            <span className="text-gray-700 font-medium">ایجاد فروشگاه</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            ایجاد فروشگاه جدید
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            اطلاعات فروشگاه جدید را وارد کنید
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          disabled={isBusy}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium shrink-0 self-start disabled:opacity-50"
        >
          <Icon icon="solar:alt-arrow-right-linear" className="text-sm" />
          بازگشت
        </button>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ══════ ROW 0 – Logo ══════ */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon icon="solar:gallery-bold-duotone" className="text-emerald-600 text-lg" />
            لوگوی فروشگاه
          </div>

          <Field error={errors.logo} hint="فرمت‌های مجاز: JPG, PNG, WEBP — حداکثر ۵ مگابایت">
            <div className="flex items-center gap-4">
              <div
                className={[
                  "w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 bg-gray-50",
                  errors.logo ? "border-red-300" : "border-gray-200",
                ].join(" ")}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="پیش‌نمایش لوگو" className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="solar:shop-bold" className="text-2xl text-gray-300" />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label
                    className={[
                      "cursor-pointer px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all",
                      isBusy ? "opacity-50 pointer-events-none" : "",
                    ].join(" ")}
                  >
                    <Icon icon="solar:upload-bold" className="inline-block ml-1.5 text-sm" />
                    انتخاب لوگو
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleLogoChange}
                      disabled={isBusy}
                      className="hidden"
                    />
                  </label>

                  {logoFile && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      disabled={isBusy}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" className="text-sm" />
                      حذف
                    </button>
                  )}
                </div>
                {logoFile && (
                  <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                    {logoFile.name}
                  </span>
                )}
              </div>
            </div>
          </Field>
        </div>

        {/* ══════ ROW 1 – Name + Description ══════ */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon icon="solar:shop-bold-duotone" className="text-emerald-600 text-lg" />
            اطلاعات پایه
          </div>

          <div className="flex flex-col gap-4">
            <Field label="نام فروشگاه" required error={errors.name}>
              <div className="relative">
                <Icon icon="solar:shop-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="مثال: قلب آسیا بیگ استور"
                  disabled={isBusy}
                  className={`${inputBase} pr-10 ${errors.name ? errorInputClass : ""} disabled:opacity-60`}
                />
              </div>
            </Field>

            <Field label="توضیحات" required error={errors.description} hint="حداکثر ۳۰۰ کاراکتر">
              <div className="relative">
                <Icon icon="solar:pen-bold" className="absolute right-3 top-3 text-gray-400 text-base pointer-events-none" />
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value.slice(0, 300))}
                  placeholder="توضیح کوتاهی درباره فروشگاه..."
                  rows={3}
                  disabled={isBusy}
                  className={`${inputBase} pr-10 resize-none ${errors.description ? errorInputClass : ""} disabled:opacity-60`}
                />
                <span className="absolute bottom-2 left-3 text-[10px] text-gray-300">
                  {form.description.length}/۳۰۰
                </span>
              </div>
            </Field>
          </div>
        </div>

        {/* ══════ ROW 2 – Address ══════ */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon icon="solar:map-point-bold-duotone" className="text-emerald-600 text-lg" />
            آدرس فروشگاه
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="شهر" required error={errors.city}>
              <div className="relative">
                <Icon icon="solar:buildings-2-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none z-10" />
                <select
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  disabled={isBusy}
                  className={`${selectBase} pr-10 ${errors.city ? errorInputClass : ""} ${!form.city ? "text-gray-400" : "text-gray-800"} disabled:opacity-60`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%239ca3af' d='m7 10l5 5l5-5z'/%3E%3C/svg%3E")` }}
                >
                  <option value="">انتخاب شهر...</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </Field>

            <Field label="کشور" required error={errors.country}>
              <div className="relative">
                <Icon icon="solar:global-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none z-10" />
                <select
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  disabled={isBusy}
                  className={`${selectBase} pr-10 ${errors.country ? errorInputClass : ""} disabled:opacity-60`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%239ca3af' d='m7 10l5 5l5-5z'/%3E%3C/svg%3E")` }}
                >
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </Field>
          </div>
        </div>

        {/* ══════ ROW 3 – Category ══════ */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon icon="solar:folder-with-files-bold-duotone" className="text-emerald-600 text-lg" />
            دسته‌بندی فروشگاه
          </div>

          <Field error={errors.category}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {CATEGORIES.map((cat) => {
                const active = form.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    disabled={isBusy}
                    onClick={() => set("category", cat.value)}
                    className={[
                      "flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-150 relative",
                      active
                        ? "border-emerald-500 bg-emerald-50 shadow-sm shadow-emerald-100"
                        : errors.category
                          ? "border-red-200 bg-red-50/30 hover:border-red-300"
                          : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50",
                      isBusy ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    <div className={[
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors",
                      active ? "bg-emerald-500 text-white" : "bg-white text-gray-400 border border-gray-100",
                    ].join(" ")}>
                      <Icon icon={cat.icon} className="text-lg sm:text-xl" />
                    </div>
                    <span className={[
                      "text-[11px] sm:text-xs font-semibold text-center leading-tight",
                      active ? "text-emerald-700" : "text-gray-500",
                    ].join(" ")}>
                      {cat.label}
                    </span>
                    {active && (
                      <Icon
                        icon="solar:check-circle-bold"
                        className="text-emerald-500 text-sm absolute top-2 left-2"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </Field>

          {selectedCat && !errors.category && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-xs text-emerald-700">
              <Icon icon="solar:check-circle-bold" className="text-emerald-500 text-base shrink-0" />
              دسته‌بندی <strong className="mx-1">«{selectedCat.label}»</strong> انتخاب شد
            </div>
          )}
        </div>

        {/* ══════ Submit row ══════ */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <p className="text-[11px] text-gray-400 flex items-center gap-1">
            <Icon icon="solar:info-circle-bold" className="text-xs" />
            فیلدهای ستاره‌دار الزامی هستند
          </p>
          <div className="flex items-center gap-2.5 justify-end">
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={isBusy}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#15803d] text-white text-sm hover:bg-[#166534] active:scale-95 transition-all font-semibold shadow-sm shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed min-w-[140px] justify-center"
            >
              {isLoading ? (
                <>
                  <Icon icon="solar:spinner-bold" className="text-base animate-spin" />
                  <span>در حال ارسال...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Icon icon="solar:check-circle-bold" className="text-base" />
                  <span>ایجاد شد</span>
                </>
              ) : (
                <>
                  <Icon icon="solar:add-circle-bold" className="text-base" />
                  ایجاد فروشگاه
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}