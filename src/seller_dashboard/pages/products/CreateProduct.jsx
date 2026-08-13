// src/pages/seller-dashboard/CreateProduct.jsx

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import { useSeller } from "../../../context/SellerContext";

const CATEGORIES = [
  { value: "supermarket", label: "سوپرمارکت", icon: "solar:cart-large-bold" },
  { value: "clothes", label: "پوشاک", icon: "solar:t-shirt-bold" },
  { value: "digital", label: "دیجیتال", icon: "solar:smartphone-bold" },
  { value: "furniture", label: "مبلمان", icon: "solar:armchair-bold" },
  { value: "lighting", label: "روشنایی", icon: "solar:lamp-bold" },
  { value: "home", label: "لوازم خانه", icon: "solar:home-2-bold" },
  { value: "food", label: "مواد غذایی", icon: "solar:cup-bold" },
  { value: "beauty", label: "زیبایی و بهداشت", icon: "solar:mirror-bold" },
  { value: "sports", label: "ورزشی", icon: "solar:dumbbell-bold" },
  { value: "other", label: "سایر", icon: "solar:box-bold" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "فعال (قابل فروش)" },
  { value: "draft", label: "پیش‌نویس (مخفی)" },
  { value: "archived", label: "بایگانی‌شده" },
];

const TOKEN_KEY = "accessToken";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const REDIRECT_DELAY = 1800;

function Field({
  label,
  required,
  hint,
  error,
  children,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          {label}
          {required && (
            <span className="text-red-400 text-xs">*</span>
          )}
        </label>
      )}

      {children}

      {hint && !error && (
        <p className="text-[11px] text-gray-400">
          {hint}
        </p>
      )}

      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <Icon
            icon="solar:danger-circle-bold"
            className="text-xs shrink-0"
          />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white rounded-3xl shadow-xl px-10 py-8 border border-gray-100">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <Icon
            icon="solar:box-bold"
            className="absolute inset-0 m-auto text-emerald-500 text-lg"
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">
            در حال ثبت محصول...
          </p>
          <p className="text-xs text-gray-400 mt-1">
            لطفاً چند لحظه صبر کنید
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessOverlay({
  visible,
  productName,
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 bg-white rounded-3xl shadow-xl px-10 py-9 border border-emerald-100">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
          <Icon
            icon="solar:check-circle-bold"
            className="text-emerald-500 text-4xl"
          />
        </div>

        <div className="text-center">
          <p className="text-base font-extrabold text-gray-900">
            محصول با موفقیت اضافه شد!
          </p>

          {productName && (
            <p className="text-xs text-gray-400 mt-1">
              «{productName}» ثبت شد
            </p>
          )}

          <p className="text-xs text-emerald-600 mt-3">
            در حال انتقال...
          </p>
        </div>
      </div>
    </div>
  );
}

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

const errorInputClass =
  "border-red-300 ring-1 ring-red-200 focus:ring-red-200 focus:border-red-400";

const chevronBg = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%239ca3af' d='m7 10l5 5l5-5z'/%3E%3C/svg%3E")`,
};

function Toggle({
  checked,
  onChange,
  disabled,
  icon,
  title,
  hint,
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2.5">
        <Icon
          icon={icon}
          className={
            checked
              ? "text-emerald-500 text-lg"
              : "text-gray-400 text-lg"
          }
        />

        <div>
          <p className="text-sm font-semibold text-gray-700">
            {title}
          </p>

          {hint && (
            <p className="text-[11px] text-gray-400">
              {hint}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={[
          "relative w-12 h-6.5 rounded-full transition-colors shrink-0 disabled:opacity-50",
          checked ? "bg-emerald-500" : "bg-gray-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 w-5.5 h-5.5 bg-white rounded-full shadow-sm transition-transform duration-200",
            checked
              ? "right-[1.75rem]"
              : "right-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export default function CreateProduct() {
  const navigate = useNavigate();
  const { apiurl } = useApi();
  const {seller} = useSeller()

  const fileInputRef = useRef(null);
  const errorBannerRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: seller?.store?.name,
    sku: "",
    barcode: "",
    shortDescription: "",
    description: "",
    price: "",
    compareAtPrice: "",
    costPrice: "",
    trackInventory: true,
    stock: "",
    lowStockThreshold: "5",
    allowBackorder: false,
    status: "active",
    featured: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [apiError, setApiError] = useState("");

  const isLoading = submitStatus === "loading";
  const isSuccess = submitStatus === "success";
  const isBusy = isLoading || isSuccess;

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => {
      if (!prev[key]) return prev;

      const next = { ...prev };
      delete next[key];

      return next;
    });

    if (submitStatus === "error") {
      setSubmitStatus("idle");
      setApiError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image:
          "فقط فایل‌های JPG، PNG یا WEBP مجاز هستند",
      }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image:
          "حجم تصویر نباید بیشتر از ۵ مگابایت باشد",
      }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });

    setImageFile(file);

    setImagePreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }

      return URL.createObjectURL(file);
    });
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTag = () => {
    const value = tagInput.trim();

    if (!value) return;

    if (tags.includes(value)) {
      setTagInput("");
      return;
    }

    if (tags.length >= 10) return;

    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag) => {
    setTags((prev) =>
      prev.filter((item) => item !== tag)
    );
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "نام محصول الزامی است";
    }

    if (!form.category) {
      e.category = "انتخاب دسته‌بندی الزامی است";
    }

    if (!form.description.trim()) {
      e.description =
        "توضیحات محصول الزامی است";
    }

    if (!form.price) {
      e.price = "قیمت الزامی است";
    } else if (Number(form.price) <= 0) {
      e.price =
        "قیمت باید بیشتر از صفر باشد";
    }

    if (
      form.compareAtPrice &&
      Number(form.compareAtPrice) <=
        Number(form.price)
    ) {
      e.compareAtPrice =
        "قیمت قبل از تخفیف باید بیشتر از قیمت فعلی باشد";
    }

    if (form.trackInventory) {
      if (form.stock === "") {
        e.stock = "موجودی الزامی است";
      } else if (Number(form.stock) < 0) {
        e.stock =
          "موجودی نمی‌تواند منفی باشد";
      }
    }

    if (!imageFile) {
      e.image = "تصویر محصول الزامی است";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const mapBackendErrors = (errData) => {
    const mapped = {};

    if (
      errData?.errors &&
      typeof errData.errors === "object"
    ) {
      for (const [key, msgs] of Object.entries(
        errData.errors
      )) {
        mapped[key] = Array.isArray(msgs)
          ? msgs[0]
          : msgs;
      }
    } else if (
      Array.isArray(errData?.message)
    ) {
      errData.message.forEach((item) => {
        if (item.field && item.message) {
          mapped[item.field] = item.message;
        }
      });
    }

    return mapped;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      errorBannerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setSubmitStatus("error");
      setApiError(
        "نشست شما منقضی شده است. لطفاً دوباره وارد شوید."
      );
      return;
    }

    setSubmitStatus("loading");
    setApiError("");
    setErrors({});

    try {
      const formData = new FormData();

      // Basic
      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "category",
        form.category
      );

      if (form.sku.trim()) {
        formData.append(
          "sku",
          form.sku.trim()
        );
      }

      if (form.barcode.trim()) {
        formData.append(
          "barcode",
          form.barcode.trim()
        );
      }

      if (form.shortDescription.trim()) {
        formData.append(
          "shortDescription",
          form.shortDescription.trim()
        );
      }

      formData.append(
        "description",
        form.description.trim()
      );

      // Price
      formData.append(
        "price",
        String(form.price)
      );

      if (form.compareAtPrice) {
        formData.append(
          "compareAtPrice",
          String(form.compareAtPrice)
        );
      }

      if (form.costPrice) {
        formData.append(
          "costPrice",
          String(form.costPrice)
        );
      }

      // Inventory
      formData.append(
        "trackInventory",
        String(form.trackInventory)
      );

      if (form.trackInventory) {
        formData.append(
          "stock",
          String(form.stock)
        );

        formData.append(
          "lowStockThreshold",
          String(
            form.lowStockThreshold || 0
          )
        );
      }

      formData.append(
        "allowBackorder",
        String(form.allowBackorder)
      );

      // Status
      formData.append(
        "status",
        form.status
      );

      formData.append(
        "featured",
        String(form.featured)
      );

      // Tags
      tags.forEach((tag) => {
        formData.append("tags", tag);
      });

      // Image
      formData.append("image", imageFile);

      const response = await fetch(
        `${apiurl}/products`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(
            TOKEN_KEY
          );

          throw new Error(
            "دسترسی غیرمجاز. لطفاً دوباره وارد شوید."
          );
        }

        const errData = await response
          .json()
          .catch(() => null);

        const fieldErrors =
          mapBackendErrors(errData);

        if (
          Object.keys(fieldErrors).length > 0
        ) {
          setErrors(fieldErrors);
          setSubmitStatus("error");
          setApiError(
            "لطفاً خطاهای فرم را برطرف کنید."
          );
          return;
        }

        const message = Array.isArray(
          errData?.message
        )
          ? errData.message.join(", ")
          : errData?.message;

        throw new Error(
          message ||
            `خطای سرور: ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Product created:",
        data
      );

      setSubmitStatus("success");

      setTimeout(() => {
        navigate("/seller/dashboard");
      }, REDIRECT_DELAY);
    } catch (error) {
      console.error(
        "Product creation failed:",
        error
      );

      setSubmitStatus("error");

      setApiError(
        error?.message ||
          "مشکلی در ارتباط با سرور پیش آمد"
      );
    }
  };

  const selectedCat = CATEGORIES.find(
    (c) => c.value === form.category
  );

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <LoadingOverlay visible={isLoading} />

      <SuccessOverlay
        visible={isSuccess}
        productName={form.name.trim()}
      />

      {submitStatus === "error" &&
        apiError && (
          <div
            ref={errorBannerRef}
            className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 flex items-start gap-3"
          >
            <Icon
              icon="solar:danger-triangle-bold"
              className="text-red-500 text-lg shrink-0"
            />

            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">
                {apiError}
              </p>

              {Object.keys(errors).length > 0 && (
                <ul className="mt-2 space-y-1">
                  {Object.entries(errors).map(
                    ([key, message]) => (
                      <li
                        key={key}
                        className="text-xs text-red-600"
                      >
                        {message}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitStatus("idle");
                setApiError("");
              }}
              className="text-red-400 hover:text-red-600"
            >
              <Icon
                icon="solar:close-circle-bold"
                className="text-lg"
              />
            </button>
          </div>
        )}

      <div>
        <p className="text-xs text-gray-400 mb-1">
          پنل فروشنده ← محصولات ← افزودن محصول
        </p>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          افزودن محصول جدید
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          اطلاعات محصول جدید را وارد کنید
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Image */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon
              icon="solar:gallery-bold-duotone"
              className="text-emerald-600 text-lg"
            />
            تصویر محصول
          </div>

          <Field
            error={errors.image}
            hint="JPG, PNG, WEBP — حداکثر ۵ مگابایت"
          >
            <div className="flex items-center gap-4">
              <div
                className={[
                  "w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden bg-gray-50",
                  errors.image
                    ? "border-red-300"
                    : "border-gray-200",
                ].join(" ")}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon
                    icon="solar:box-bold"
                    className="text-2xl text-gray-300"
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="cursor-pointer px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <Icon
                    icon="solar:upload-bold"
                    className="inline-block ml-1"
                  />
                  انتخاب تصویر

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    disabled={isBusy}
                    className="hidden"
                  />
                </label>

                {imageFile && (
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={isBusy}
                    className="text-xs text-red-500"
                  >
                    حذف تصویر
                  </button>
                )}

                {imageFile && (
                  <span className="text-[11px] text-gray-400 max-w-[220px] truncate">
                    {imageFile.name}
                  </span>
                )}
              </div>
            </div>
          </Field>

          <Toggle
            checked={form.featured}
            onChange={(v) =>
              set("featured", v)
            }
            disabled={isBusy}
            icon="solar:star-bold"
            title="محصول ویژه"
            hint="محصول در بخش محصولات ویژه نمایش داده شود"
          />
        </div>

        {/* Basic */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-sm font-bold text-gray-800">
            اطلاعات پایه
          </h2>

          <Field
            label="نام محصول"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                set("name", e.target.value)
              }
              disabled={isBusy}
              className={`${inputBase} ${
                errors.name
                  ? errorInputClass
                  : ""
              }`}
              placeholder="مثال: کفش ورزشی نایک"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="دسته‌بندی"
              required
              error={errors.category}
            >
              <select
                value={form.category}
                onChange={(e) =>
                  set(
                    "category",
                    e.target.value
                  )
                }
                disabled={isBusy}
                className={`${selectBase} ${
                  errors.category
                    ? errorInputClass
                    : ""
                }`}
                style={chevronBg}
              >
                <option value="">
                  انتخاب دسته‌بندی
                </option>

                {CATEGORIES.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

          </div>

          {selectedCat && (
            <div className="text-xs bg-emerald-50 text-emerald-700 rounded-xl p-3">
              دسته‌بندی «{selectedCat.label}» انتخاب شد
            </div>
          )}

          <Field
            label="توضیح کوتاه"
            error={errors.shortDescription}
          >
            <input
              type="text"
              maxLength={150}
              value={form.shortDescription}
              onChange={(e) =>
                set(
                  "shortDescription",
                  e.target.value
                )
              }
              disabled={isBusy}
              className={inputBase}
            />
          </Field>

          <Field
            label="توضیحات کامل"
            required
            error={errors.description}
          >
            <textarea
              rows={4}
              maxLength={500}
              value={form.description}
              onChange={(e) =>
                set(
                  "description",
                  e.target.value
                )
              }
              disabled={isBusy}
              className={`${inputBase} resize-none`}
            />
          </Field>

          <Field label="برچسب‌ها">
            <div
              className={`${inputBase} flex flex-wrap gap-1.5 min-h-[44px]`}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-lg"
                >
                  {tag}

                  <button
                    type="button"
                    onClick={() =>
                      removeTag(tag)
                    }
                    className="mr-1"
                  >
                    ×
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={tagInput}
                onChange={(e) =>
                  setTagInput(e.target.value)
                }
                onKeyDown={
                  handleTagKeyDown
                }
                onBlur={addTag}
                disabled={
                  isBusy || tags.length >= 10
                }
                className="flex-1 bg-transparent outline-none text-sm"
                placeholder={
                  tags.length === 0
                    ? "مثال: پرفروش"
                    : ""
                }
              />
            </div>
          </Field>
        </div>

        {/* Price */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-sm font-bold text-gray-800">
            قیمت‌گذاری
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field
              label="قیمت فروش"
              required
              error={errors.price}
            >
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  set("price", e.target.value)
                }
                disabled={isBusy}
                className={`${inputBase} ${
                  errors.price
                    ? errorInputClass
                    : ""
                }`}
              />
            </Field>

            <Field
              label="قیمت قبل از تخفیف"
              error={errors.compareAtPrice}
            >
              <input
                type="number"
                min="0"
                value={form.compareAtPrice}
                onChange={(e) =>
                  set(
                    "compareAtPrice",
                    e.target.value
                  )
                }
                disabled={isBusy}
                className={inputBase}
              />
            </Field>

            <Field label="قیمت تمام‌شده">
              <input
                type="number"
                min="0"
                value={form.costPrice}
                onChange={(e) =>
                  set(
                    "costPrice",
                    e.target.value
                  )
                }
                disabled={isBusy}
                className={inputBase}
              />
            </Field>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-sm font-bold text-gray-800">
            موجودی و انبار
          </h2>

          <Toggle
            checked={form.trackInventory}
            onChange={(v) =>
              set("trackInventory", v)
            }
            disabled={isBusy}
            icon="solar:clipboard-list-bold"
            title="ردیابی موجودی"
          />

          {form.trackInventory && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="موجودی"
                required
                error={errors.stock}
              >
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    set(
                      "stock",
                      e.target.value
                    )
                  }
                  disabled={isBusy}
                  className={inputBase}
                />
              </Field>

              <Field label="آستانه موجودی کم">
                <input
                  type="number"
                  min="0"
                  value={
                    form.lowStockThreshold
                  }
                  onChange={(e) =>
                    set(
                      "lowStockThreshold",
                      e.target.value
                    )
                  }
                  disabled={isBusy}
                  className={inputBase}
                />
              </Field>
            </div>
          )}

          <Toggle
            checked={form.allowBackorder}
            onChange={(v) =>
              set(
                "allowBackorder",
                v
              )
            }
            disabled={isBusy}
            icon="solar:cart-check-bold"
            title="پیش‌فروش بدون موجودی"
          />

          <Field label="وضعیت">
            <select
              value={form.status}
              onChange={(e) =>
                set(
                  "status",
                  e.target.value
                )
              }
              disabled={isBusy}
              className={selectBase}
              style={chevronBg}
            >
              {STATUS_OPTIONS.map(
                (item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                )
              )}
            </select>
          </Field>
        </div>

        {/* Identifiers */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-sm font-bold text-gray-800">
            شناسه‌های محصول
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="SKU">
              <input
                type="text"
                value={form.sku}
                onChange={(e) =>
                  set("sku", e.target.value)
                }
                disabled={isBusy}
                className={inputBase}
              />
            </Field>

            <Field label="بارکد">
              <input
                type="text"
                value={form.barcode}
                onChange={(e) =>
                  set(
                    "barcode",
                    e.target.value
                  )
                }
                disabled={isBusy}
                className={inputBase}
              />
            </Field>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              window.history.back()
            }
            disabled={isBusy}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={isBusy}
            className="px-6 py-2.5 rounded-xl bg-[#15803d] text-white text-sm font-semibold disabled:opacity-60"
          >
            {isLoading
              ? "در حال ارسال..."
              : isSuccess
              ? "ثبت شد"
              : "ثبت محصول"}
          </button>
        </div>
      </form>
    </div>
  );
}