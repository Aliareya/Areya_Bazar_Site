// src/pages/seller-dashboard/CreateProduct.jsx
import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────── static options ─────────────────── */
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

const UNITS = ["عدد", "کیلوگرم", "گرم", "لیتر", "بسته", "جفت"];

const API_URL   = "http://localhost:3000/api/products";
const TOKEN_KEY = "accessToken";
const MAX_IMAGE_SIZE  = 5 * 1024 * 1024; // 5MB per image
const MAX_IMAGES      = 6;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const REDIRECT_DELAY = 1800;

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

/* ─────────────────────── overlays ─────────────────────── */
function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white rounded-3xl shadow-xl px-10 py-8 border border-gray-100">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <Icon icon="solar:box-bold" className="absolute inset-0 m-auto text-emerald-500 text-lg" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">در حال ثبت محصول...</p>
          <p className="text-xs text-gray-400 mt-1">لطفاً چند لحظه صبر کنید</p>
        </div>
      </div>
    </div>
  );
}

function SuccessOverlay({ visible, productName }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white rounded-3xl shadow-xl px-10 py-9 border border-emerald-100 animate-scaleIn">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
          <Icon icon="solar:check-circle-bold" className="text-emerald-500 text-4xl animate-popIn" />
        </div>
        <div className="text-center">
          <p className="text-base font-extrabold text-gray-900">محصول با موفقیت اضافه شد!</p>
          {productName && (
            <p className="text-xs text-gray-400 mt-1">«{productName}» ثبت شد</p>
          )}
          <p className="text-xs text-emerald-600 mt-3 flex items-center justify-center gap-1.5">
            <Icon icon="solar:arrow-right-linear" className="text-sm rotate-180" />
            در حال انتقال...
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
const chevronBg = { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%239ca3af' d='m7 10l5 5l5-5z'/%3E%3C/svg%3E")` };

/* ─────────────────────── main component ──────────────────── */
export default function CreateProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const errorBannerRef = useRef(null);

  const [form, setForm] = useState({
    name:          "",
    description:   "",
    category:      "",
    price:         "",
    discountPrice: "",
    quantity:      "",
    unit:          "عدد",
    sku:           "",
    available:     true,
  });

  const [images, setImages]             = useState([]); // [{file, preview}]
  const [errors, setErrors]             = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [apiError, setApiError]         = useState("");

  const isLoading = submitStatus === "loading";
  const isSuccess = submitStatus === "success";
  const isBusy    = isLoading || isSuccess;

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

  /* ── images ── */
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setErrors((p) => ({ ...p, images: `حداکثر ${MAX_IMAGES} تصویر مجاز است` }));
      e.target.value = "";
      return;
    }

    const validFiles = [];
    let localError = "";

    for (const file of files.slice(0, remainingSlots)) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        localError = "فقط فایل‌های JPG، PNG یا WEBP مجاز هستند";
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        localError = "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد";
        continue;
      }
      validFiles.push({ file, preview: URL.createObjectURL(file) });
    }

    if (localError) {
      setErrors((p) => ({ ...p, images: localError }));
    } else {
      setErrors((p) => {
        const next = { ...p };
        delete next.images;
        return next;
      });
    }

    if (validFiles.length) {
      setImages((prev) => [...prev, ...validFiles]);
    }
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const setCoverImage = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [chosen] = next.splice(index, 1);
      next.unshift(chosen);
      return next;
    });
  };

  /* ── validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name        = "نام محصول الزامی است";
    if (!form.description.trim())  e.description = "توضیحات محصول الزامی است";
    if (!form.category)            e.category    = "انتخاب دسته‌بندی الزامی است";

    if (!form.price)               e.price       = "قیمت الزامی است";
    else if (Number(form.price) <= 0) e.price    = "قیمت باید بیشتر از صفر باشد";

    if (
      form.discountPrice &&
      Number(form.discountPrice) >= Number(form.price)
    ) {
      e.discountPrice = "قیمت تخفیف باید کمتر از قیمت اصلی باشد";
    }

    if (form.quantity === "")      e.quantity    = "موجودی الزامی است";
    else if (Number(form.quantity) < 0) e.quantity = "موجودی نمی‌تواند منفی باشد";

    if (images.length === 0)       e.images      = "حداقل یک تصویر برای محصول لازم است";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

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
    if (!validate()) {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

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
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("category", form.category);
      formData.append("price", form.price);
      if (form.discountPrice) formData.append("discountPrice", form.discountPrice);
      formData.append("quantity", form.quantity);
      formData.append("unit", form.unit);
      if (form.sku.trim()) formData.append("sku", form.sku.trim());
      formData.append("available", form.available);

      images.forEach(({ file }) => {
        formData.append("images", file);
      });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
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

      setSubmitStatus("success");
      setTimeout(() => navigate("/seller/dashboard"), REDIRECT_DELAY);

    } catch (err) {
      console.error("Product creation failed:", err);
      setSubmitStatus("error");
      setApiError(err.message || "مشکلی در ارتباط با سرور پیش آمد");
    }
  };

  const selectedCat = CATEGORIES.find((c) => c.value === form.category);

  /* ─────────────────────── render ─────────────────────── */
  return (
    <div className="space-y-5 max-w-4xl mx-auto">

      <LoadingOverlay visible={isLoading} />
      <SuccessOverlay visible={isSuccess} productName={form.name.trim()} />

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
            <span>پنل فروشنده</span>
            <Icon icon="solar:alt-arrow-left-linear" className="text-[10px]" />
            <span className="text-gray-500">محصولات</span>
            <Icon icon="solar:alt-arrow-left-linear" className="text-[10px]" />
            <span className="text-gray-700 font-medium">افزودن محصول</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            افزودن محصول جدید
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            اطلاعات محصول جدید را وارد کنید
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

        {/* ══════ ROW 0 – Images ══════ */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
              <Icon icon="solar:gallery-wide-bold-duotone" className="text-emerald-600 text-lg" />
              تصاویر محصول
            </div>
            <span className="text-[11px] text-gray-400">{images.length}/{MAX_IMAGES}</span>
          </div>

          <Field error={errors.images} hint="فرمت‌های مجاز: JPG, PNG, WEBP — حداکثر ۵ مگابایت هر تصویر. اولین تصویر به‌عنوان تصویر اصلی نمایش داده می‌شود">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
              {images.map((img, index) => (
                <div
                  key={img.preview}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group"
                >
                  <img src={img.preview} alt={`تصویر ${index + 1}`} className="w-full h-full object-cover" />

                  {index === 0 && (
                    <span className="absolute top-1 right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      اصلی
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => setCoverImage(index)}
                        title="تنظیم به‌عنوان تصویر اصلی"
                        disabled={isBusy}
                        className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-emerald-600 hover:bg-white"
                      >
                        <Icon icon="solar:star-bold" className="text-sm" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      title="حذف"
                      disabled={isBusy}
                      className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center text-red-500 hover:bg-white"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <label
                  className={[
                    "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors",
                    errors.images ? "border-red-300 bg-red-50/30" : "border-gray-200 bg-gray-50/50 hover:border-emerald-300 hover:bg-emerald-50/30",
                    isBusy ? "opacity-50 pointer-events-none" : "",
                  ].join(" ")}
                >
                  <Icon icon="solar:add-circle-bold" className="text-xl text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-medium">افزودن</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImagesChange}
                    disabled={isBusy}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </Field>
        </div>

        {/* ══════ ROW 1 – Name + Description ══════ */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon icon="solar:box-bold-duotone" className="text-emerald-600 text-lg" />
            اطلاعات پایه
          </div>

          <div className="flex flex-col gap-4">
            <Field label="نام محصول" required error={errors.name}>
              <div className="relative">
                <Icon icon="solar:tag-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="مثال: کفش ورزشی نایک ایر مکس"
                  disabled={isBusy}
                  className={`${inputBase} pr-10 ${errors.name ? errorInputClass : ""} disabled:opacity-60`}
                />
              </div>
            </Field>

            <Field label="توضیحات" required error={errors.description} hint="حداکثر ۵۰۰ کاراکتر">
              <div className="relative">
                <Icon icon="solar:pen-bold" className="absolute right-3 top-3 text-gray-400 text-base pointer-events-none" />
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value.slice(0, 500))}
                  placeholder="مشخصات، ویژگی‌ها و توضیح کامل محصول..."
                  rows={4}
                  disabled={isBusy}
                  className={`${inputBase} pr-10 resize-none ${errors.description ? errorInputClass : ""} disabled:opacity-60`}
                />
                <span className="absolute bottom-2 left-3 text-[10px] text-gray-300">
                  {form.description.length}/۵۰۰
                </span>
              </div>
            </Field>

            <Field label="دسته‌بندی" required error={errors.category}>
              <div className="relative">
                <Icon icon="solar:folder-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none z-10" />
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  disabled={isBusy}
                  className={`${selectBase} pr-10 ${errors.category ? errorInputClass : ""} ${!form.category ? "text-gray-400" : "text-gray-800"} disabled:opacity-60`}
                  style={chevronBg}
                >
                  <option value="">انتخاب دسته‌بندی...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              {selectedCat && !errors.category && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 text-xs text-emerald-700 mt-1">
                  <Icon icon={selectedCat.icon} className="text-emerald-500 text-sm shrink-0" />
                  دسته‌بندی <strong className="mx-1">«{selectedCat.label}»</strong> انتخاب شد
                </div>
              )}
            </Field>
          </div>
        </div>

        {/* ══════ ROW 2 – Pricing ══════ */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon icon="solar:wallet-money-bold-duotone" className="text-emerald-600 text-lg" />
            قیمت‌گذاری
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="قیمت (افغانی)" required error={errors.price}>
              <div className="relative">
                <Icon icon="solar:tag-price-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="مثال: 2500000"
                  disabled={isBusy}
                  className={`${inputBase} pr-10 ${errors.price ? errorInputClass : ""} disabled:opacity-60`}
                />
              </div>
            </Field>

            <Field label="قیمت با تخفیف (اختیاری)" error={errors.discountPrice} hint="اگر محصول تخفیف دارد">
              <div className="relative">
                <Icon icon="solar:tag-horizontal-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={form.discountPrice}
                  onChange={(e) => set("discountPrice", e.target.value)}
                  placeholder="مثال: 2200000"
                  disabled={isBusy}
                  className={`${inputBase} pr-10 ${errors.discountPrice ? errorInputClass : ""} disabled:opacity-60`}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* ══════ ROW 3 – Inventory ══════ */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon icon="solar:box-minimalistic-bold-duotone" className="text-emerald-600 text-lg" />
            موجودی و انبار
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="موجودی" required error={errors.quantity}>
              <div className="relative">
                <Icon icon="solar:layers-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={form.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                  placeholder="مثال: 25"
                  disabled={isBusy}
                  className={`${inputBase} pr-10 ${errors.quantity ? errorInputClass : ""} disabled:opacity-60`}
                />
              </div>
            </Field>

            <Field label="واحد شمارش">
              <div className="relative">
                <Icon icon="solar:ruler-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none z-10" />
                <select
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  disabled={isBusy}
                  className={`${selectBase} pr-10 disabled:opacity-60`}
                  style={chevronBg}
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </Field>

            <Field label="کد محصول / SKU (اختیاری)">
              <div className="relative">
                <Icon icon="solar:hashtag-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                  placeholder="مثال: SHO-1023"
                  disabled={isBusy}
                  className={`${inputBase} pr-10 disabled:opacity-60`}
                />
              </div>
            </Field>
          </div>

          {/* ── Availability toggle ── */}
          <div className="flex items-center justify-between bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Icon
                icon={form.available ? "solar:check-circle-bold" : "solar:close-circle-bold"}
                className={form.available ? "text-emerald-500 text-lg" : "text-gray-400 text-lg"}
              />
              <div>
                <p className="text-sm font-semibold text-gray-700">وضعیت نمایش</p>
                <p className="text-[11px] text-gray-400">
                  {form.available ? "محصول برای مشتریان قابل مشاهده و خرید است" : "محصول در حال حاضر مخفی است"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => set("available", !form.available)}
              disabled={isBusy}
              className={[
                "relative w-12 h-6.5 rounded-full transition-colors shrink-0 disabled:opacity-50",
                form.available ? "bg-emerald-500" : "bg-gray-300",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 w-5.5 h-5.5 bg-white rounded-full shadow-sm transition-transform",
                  form.available ? "translate-x-[-1.5rem] right-0.5" : "right-0.5",
                ].join(" ")}
              />
            </button>
          </div>
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
                  <span>ثبت شد</span>
                </>
              ) : (
                <>
                  <Icon icon="solar:add-circle-bold" className="text-base" />
                  ثبت محصول
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}