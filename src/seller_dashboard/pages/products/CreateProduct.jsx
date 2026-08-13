// src/pages/seller-dashboard/CreateProduct.jsx

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import { useSeller } from "../../../context/SellerContext";

/* =========================================================
   STATIC DATA
========================================================= */

const CATEGORIES = [
  {
    value: "supermarket",
    label: "سوپرمارکت",
    icon: "solar:cart-large-bold",
  },
  {
    value: "clothes",
    label: "پوشاک",
    icon: "solar:t-shirt-bold",
  },
  {
    value: "digital",
    label: "دیجیتال",
    icon: "solar:smartphone-bold",
  },
  {
    value: "furniture",
    label: "مبلمان",
    icon: "solar:armchair-bold",
  },
  {
    value: "lighting",
    label: "روشنایی",
    icon: "solar:lamp-bold",
  },
  {
    value: "home",
    label: "لوازم خانه",
    icon: "solar:home-2-bold",
  },
  {
    value: "food",
    label: "مواد غذایی",
    icon: "solar:cup-bold",
  },
  {
    value: "beauty",
    label: "زیبایی و بهداشت",
    icon: "solar:mirror-bold",
  },
  {
    value: "sports",
    label: "ورزشی",
    icon: "solar:dumbbell-bold",
  },
  {
    value: "other",
    label: "سایر",
    icon: "solar:box-bold",
  },
];

const STATUS_OPTIONS = [
  {
    value: "active",
    label: "فعال (قابل فروش)",
  },
  {
    value: "draft",
    label: "پیش‌نویس (مخفی)",
  },
  {
    value: "archived",
    label: "بایگانی‌شده",
  },
];

const TOKEN_KEY = "accessToken";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const REDIRECT_DELAY = 1800;

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  required = false,
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
            <span className="text-red-400 text-xs">
              *
            </span>
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

/* =========================================================
   LOADING
========================================================= */

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

/* =========================================================
   SUCCESS
========================================================= */

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

/* =========================================================
   INPUT STYLES
========================================================= */

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

/* =========================================================
   TOGGLE
========================================================= */

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

/* =========================================================
   MAIN
========================================================= */

export default function CreateProduct() {
  const navigate = useNavigate();

  const { apiurl } = useApi();

  const { seller } = useSeller();

  const fileInputRef = useRef(null);
  const errorBannerRef = useRef(null);

  /* =======================================================
     FORM
  ======================================================= */

  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
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

  /* =======================================================
     TAGS
  ======================================================= */

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  /* =======================================================
     IMAGE
  ======================================================= */

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  /* =======================================================
     STATUS
  ======================================================= */

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [apiError, setApiError] = useState("");

  const isLoading = submitStatus === "loading";
  const isSuccess = submitStatus === "success";
  const isBusy = isLoading || isSuccess;

  /* =======================================================
     STORE NAME -> BRAND
  ======================================================= */

  useEffect(() => {
    if (seller?.store?.name) {
      setForm((prev) => ({
        ...prev,
        brand: prev.brand || seller.store.name,
      }));
    }
  }, [seller?.store?.name]);

  /* =======================================================
     ERROR SCROLL
  ======================================================= */

  useEffect(() => {
    if (
      submitStatus === "error" &&
      errorBannerRef.current
    ) {
      errorBannerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [submitStatus]);

  /* =======================================================
     SET FORM VALUE
  ======================================================= */

  const set = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => {
      if (!prev[key]) return prev;

      const next = {
        ...prev,
      };

      delete next[key];

      return next;
    });

    if (submitStatus === "error") {
      setSubmitStatus("idle");
      setApiError("");
    }
  };

  /* =======================================================
     IMAGE
  ======================================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
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
      const next = {
        ...prev,
      };

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

  /* =======================================================
     TAGS
  ======================================================= */

  const addTag = () => {
    const value = tagInput.trim();

    if (!value) return;

    if (tags.includes(value)) {
      setTagInput("");
      return;
    }

    if (tags.length >= 10) {
      return;
    }

    setTags((prev) => [
      ...prev,
      value,
    ]);

    setTagInput("");
  };

  const handleTagKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();

      addTag();
    }
  };

  const removeTag = (tag) => {
    setTags((prev) =>
      prev.filter(
        (item) => item !== tag
      )
    );
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const validationErrors = {};

    if (!form.name.trim()) {
      validationErrors.name =
        "نام محصول الزامی است";
    }

    if (!form.category) {
      validationErrors.category =
        "انتخاب دسته‌بندی الزامی است";
    }

    if (!form.description.trim()) {
      validationErrors.description =
        "توضیحات محصول الزامی است";
    }

    if (!form.price) {
      validationErrors.price =
        "قیمت الزامی است";
    } else if (
      Number(form.price) <= 0
    ) {
      validationErrors.price =
        "قیمت باید بیشتر از صفر باشد";
    }

    if (
      form.compareAtPrice &&
      Number(form.compareAtPrice) <=
        Number(form.price)
    ) {
      validationErrors.compareAtPrice =
        "قیمت قبل از تخفیف باید بیشتر از قیمت فعلی باشد";
    }

    if (form.trackInventory) {
      if (form.stock === "") {
        validationErrors.stock =
          "موجودی الزامی است";
      } else if (
        Number(form.stock) < 0
      ) {
        validationErrors.stock =
          "موجودی نمی‌تواند منفی باشد";
      }
    }

    if (!imageFile) {
      validationErrors.image =
        "تصویر محصول الزامی است";
    }

    setErrors(validationErrors);

    return (
      Object.keys(
        validationErrors
      ).length === 0
    );
  };

  /* =======================================================
     BACKEND ERROR
  ======================================================= */

  const mapBackendErrors = (
    errorData
  ) => {
    const mapped = {};

    if (
      errorData?.errors &&
      typeof errorData.errors ===
        "object"
    ) {
      for (const [
        key,
        messages,
      ] of Object.entries(
        errorData.errors
      )) {
        mapped[key] =
          Array.isArray(messages)
            ? messages[0]
            : messages;
      }
    }

    if (
      Array.isArray(
        errorData?.message
      )
    ) {
      errorData.message.forEach(
        (item) => {
          if (
            item?.field &&
            item?.message
          ) {
            mapped[item.field] =
              item.message;
          }
        }
      );
    }

    return mapped;
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validate()) {
      errorBannerRef.current?.scrollIntoView(
        {
          behavior: "smooth",
          block: "center",
        }
      );

      return;
    }

    /* -----------------------------------------------------
       GET TOKEN
    ----------------------------------------------------- */

    const token =
      localStorage.getItem(
        TOKEN_KEY
      );

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
      /* ---------------------------------------------------
         FORMDATA
      --------------------------------------------------- */

      const formData =
        new FormData();

      /* BASIC */

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "category",
        form.category
      );

      if (form.brand?.trim()) {
        formData.append(
          "brand",
          form.brand.trim()
        );
      }

      if (form.sku?.trim()) {
        formData.append(
          "sku",
          form.sku.trim()
        );
      }

      if (form.barcode?.trim()) {
        formData.append(
          "barcode",
          form.barcode.trim()
        );
      }

      if (
        form.shortDescription?.trim()
      ) {
        formData.append(
          "shortDescription",
          form.shortDescription.trim()
        );
      }

      formData.append(
        "description",
        form.description.trim()
      );

      /* PRICE */

      formData.append(
        "price",
        String(form.price)
      );

      if (form.compareAtPrice) {
        formData.append(
          "compareAtPrice",
          String(
            form.compareAtPrice
          )
        );
      }

      if (form.costPrice) {
        formData.append(
          "costPrice",
          String(form.costPrice)
        );
      }

      /* INVENTORY */

      formData.append(
        "trackInventory",
        String(
          form.trackInventory
        )
      );

      if (form.trackInventory) {
        formData.append(
          "stock",
          String(form.stock)
        );

        formData.append(
          "lowStockThreshold",
          String(
            form.lowStockThreshold ||
              0
          )
        );
      }

      formData.append(
        "allowBackorder",
        String(
          form.allowBackorder
        )
      );

      /* STATUS */

      formData.append(
        "status",
        form.status
      );

      formData.append(
        "featured",
        String(form.featured)
      );

      /* ---------------------------------------------------
         IMPORTANT:
         PostgreSQL tags is text[]
         We send JSON string.
      --------------------------------------------------- */

      formData.append(
        "tags",
        JSON.stringify(tags)
      );

      /* IMAGE */

      formData.append(
        "image",
        imageFile
      );

      /* ---------------------------------------------------
         API
      --------------------------------------------------- */

      const response =
        await fetch(
          `https://areyabazaarapi.vercel.app/api/products`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            // DO NOT set Content-Type manually
            body: formData,
          }
        );

      /* ---------------------------------------------------
         ERROR
      --------------------------------------------------- */

      if (!response.ok) {
        if (
          response.status === 401
        ) {
          localStorage.removeItem(
            TOKEN_KEY
          );

          throw new Error(
            "دسترسی غیرمجاز. لطفاً دوباره وارد شوید."
          );
        }

        const errorData =
          await response
            .json()
            .catch(() => null);

        const backendErrors =
          mapBackendErrors(
            errorData
          );

        if (
          Object.keys(
            backendErrors
          ).length > 0
        ) {
          setErrors(
            backendErrors
          );

          setSubmitStatus(
            "error"
          );

          setApiError(
            "لطفاً خطاهای فرم را برطرف کنید."
          );

          return;
        }

        const message =
          Array.isArray(
            errorData?.message
          )
            ? errorData.message.join(
                ", "
              )
            : errorData?.message;

        throw new Error(
          message ||
            `خطای سرور: ${response.status}`
        );
      }

      /* ---------------------------------------------------
         SUCCESS
      --------------------------------------------------- */

      const result =
        await response
          .json()
          .catch(() => null);

      console.log(
        "Product created:",
        result
      );

      setSubmitStatus(
        "success"
      );

      setTimeout(() => {
        navigate(
          "/seller/myproducts"
        );
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

  /* =======================================================
     SELECTED CATEGORY
  ======================================================= */

  const selectedCategory =
    CATEGORIES.find(
      (item) =>
        item.value ===
        form.category
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-5 max-w-4xl mx-auto">

      {/* OVERLAYS */}

      <LoadingOverlay
        visible={isLoading}
      />

      <SuccessOverlay
        visible={isSuccess}
        productName={
          form.name.trim()
        }
      />

      {/* =================================================
          ERROR BANNER
      ================================================= */}

      {submitStatus === "error" &&
        apiError && (
          <div
            ref={errorBannerRef}
            className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3.5 flex items-start gap-3"
          >
            <Icon
              icon="solar:danger-triangle-bold"
              className="text-red-500 text-lg shrink-0 mt-0.5"
            />

            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">
                {apiError}
              </p>

              {Object.keys(
                errors
              ).length > 0 && (
                <ul className="mt-2 space-y-1">
                  {Object.entries(
                    errors
                  ).map(
                    ([
                      key,
                      message,
                    ]) => (
                      <li
                        key={key}
                        className="text-xs text-red-600 flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-red-400" />
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
                setSubmitStatus(
                  "idle"
                );

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

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
          <span>
            پنل فروشنده
          </span>

          <Icon
            icon="solar:alt-arrow-left-linear"
            className="text-[10px]"
          />

          <span>
            محصولات
          </span>

          <Icon
            icon="solar:alt-arrow-left-linear"
            className="text-[10px]"
          />

          <span className="text-gray-700 font-medium">
            افزودن محصول
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          افزودن محصول جدید
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          اطلاعات محصول جدید را وارد کنید
        </p>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-5"
      >

        {/* =================================================
            IMAGE
        ================================================= */}

        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon
              icon="solar:gallery-bold-duotone"
              className="text-emerald-600 text-lg"
            />

            تصویر محصول
          </div>

          <Field
            error={errors.image}
            hint="فرمت‌های مجاز: JPG, PNG, WEBP — حداکثر ۵ مگابایت"
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
                    src={
                      imagePreview
                    }
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
                <label
                  className={[
                    "cursor-pointer px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50",
                    isBusy
                      ? "opacity-50 pointer-events-none"
                      : "",
                  ].join(" ")}
                >
                  <Icon
                    icon="solar:upload-bold"
                    className="inline-block ml-1"
                  />

                  انتخاب تصویر

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    disabled={
                      isBusy
                    }
                    className="hidden"
                  />
                </label>

                {imageFile && (
                  <button
                    type="button"
                    onClick={
                      removeImage
                    }
                    disabled={
                      isBusy
                    }
                    className="text-xs text-red-500 text-right"
                  >
                    حذف تصویر
                  </button>
                )}

                {imageFile && (
                  <span className="text-[11px] text-gray-400 max-w-[220px] truncate">
                    {
                      imageFile.name
                    }
                  </span>
                )}
              </div>
            </div>
          </Field>

          <Toggle
            checked={
              form.featured
            }
            onChange={(value) =>
              set(
                "featured",
                value
              )
            }
            disabled={isBusy}
            icon="solar:star-bold"
            title="محصول ویژه"
            hint="محصول در بخش محصولات ویژه نمایش داده شود"
          />
        </div>

        {/* =================================================
            BASIC INFO
        ================================================= */}

        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon
              icon="solar:box-bold-duotone"
              className="text-emerald-600 text-lg"
            />

            اطلاعات پایه
          </div>

          <Field
            label="نام محصول"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                set(
                  "name",
                  event.target.value
                )
              }
              disabled={isBusy}
              className={[
                inputBase,
                errors.name
                  ? errorInputClass
                  : "",
              ].join(" ")}
              placeholder="مثال: لپ تاپ HP 15"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field
              label="دسته‌بندی"
              required
              error={errors.category}
            >
              <select
                value={
                  form.category
                }
                onChange={(event) =>
                  set(
                    "category",
                    event.target.value
                  )
                }
                disabled={isBusy}
                className={[
                  selectBase,
                  errors.category
                    ? errorInputClass
                    : "",
                ].join(" ")}
                style={
                  chevronBg
                }
              >
                <option value="">
                  انتخاب دسته‌بندی
                </option>

                {CATEGORIES.map(
                  (item) => (
                    <option
                      key={
                        item.value
                      }
                      value={
                        item.value
                      }
                    >
                      {
                        item.label
                      }
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field
              label="برند"
              hint="پیش‌فرض نام فروشگاه"
            >
              <input
                type="text"
                value={
                  form.brand
                }
                disabled
                className={inputBase}
              />
            </Field>
          </div>

          {selectedCategory && (
            <div className="text-xs bg-emerald-50 text-emerald-700 rounded-xl p-3 flex items-center gap-2">
              <Icon
                icon={
                  selectedCategory.icon
                }
                className="text-emerald-500"
              />

              دسته‌بندی
              <strong>
                «
                {
                  selectedCategory.label
                }
                »
              </strong>
              انتخاب شد
            </div>
          )}

          <Field
            label="توضیح کوتاه"
            error={
              errors.shortDescription
            }
            hint="حداکثر ۱۵۰ کاراکتر"
          >
            <input
              type="text"
              maxLength={150}
              value={
                form.shortDescription
              }
              onChange={(event) =>
                set(
                  "shortDescription",
                  event.target.value
                )
              }
              disabled={isBusy}
              className={
                inputBase
              }
              placeholder="مثلاً لپ تاپ قدرتمند برای کار و تحصیل"
            />
          </Field>

          <Field
            label="توضیحات کامل"
            required
            error={
              errors.description
            }
            hint="حداکثر ۵۰۰ کاراکتر"
          >
            <textarea
              rows={4}
              maxLength={500}
              value={
                form.description
              }
              onChange={(event) =>
                set(
                  "description",
                  event.target.value
                )
              }
              disabled={isBusy}
              className={`${inputBase} resize-none`}
              placeholder="مشخصات و توضیحات کامل محصول..."
            />

            <p className="text-[10px] text-gray-300 text-left">
              {
                form.description
                  .length
              }
              /500
            </p>
          </Field>

          {/* TAGS */}

          <Field
            label="برچسب‌ها"
            hint="Enter یا کاما برای اضافه‌کردن"
          >
            <div
              className={`${inputBase} flex flex-wrap items-center gap-1.5 min-h-[44px]`}
            >
              {tags.map(
                (tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-lg"
                  >
                    {tag}

                    <button
                      type="button"
                      onClick={() =>
                        removeTag(
                          tag
                        )
                      }
                      disabled={
                        isBusy
                      }
                      className="text-emerald-500"
                    >
                      <Icon
                        icon="solar:close-circle-bold"
                        className="text-xs"
                      />
                    </button>
                  </span>
                )
              )}

              <input
                type="text"
                value={
                  tagInput
                }
                onChange={(event) =>
                  setTagInput(
                    event.target
                      .value
                  )
                }
                onKeyDown={
                  handleTagKeyDown
                }
                onBlur={
                  addTag
                }
                disabled={
                  isBusy ||
                  tags.length >=
                    10
                }
                placeholder={
                  tags.length ===
                  0
                    ? "مثلاً لپ تاپ، HP"
                    : ""
                }
                className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
              />
            </div>
          </Field>
        </div>

        {/* =================================================
            PRICING
        ================================================= */}

        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon
              icon="solar:wallet-money-bold-duotone"
              className="text-emerald-600 text-lg"
            />

            قیمت‌گذاری
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Field
              label="قیمت فروش"
              required
              error={errors.price}
            >
              <input
                type="number"
                min="0"
                value={
                  form.price
                }
                onChange={(event) =>
                  set(
                    "price",
                    event.target
                      .value
                  )
                }
                disabled={isBusy}
                className={[
                  inputBase,
                  errors.price
                    ? errorInputClass
                    : "",
                ].join(" ")}
              />
            </Field>

            <Field
              label="قیمت قبل از تخفیف"
              error={
                errors.compareAtPrice
              }
            >
              <input
                type="number"
                min="0"
                value={
                  form.compareAtPrice
                }
                onChange={(event) =>
                  set(
                    "compareAtPrice",
                    event.target
                      .value
                  )
                }
                disabled={isBusy}
                className={
                  inputBase
                }
              />
            </Field>

            <Field label="قیمت تمام‌شده">
              <input
                type="number"
                min="0"
                value={
                  form.costPrice
                }
                onChange={(event) =>
                  set(
                    "costPrice",
                    event.target
                      .value
                  )
                }
                disabled={isBusy}
                className={
                  inputBase
                }
              />
            </Field>

          </div>
        </div>

        {/* =================================================
            INVENTORY
        ================================================= */}

        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon
              icon="solar:box-minimalistic-bold-duotone"
              className="text-emerald-600 text-lg"
            />

            موجودی و انبار
          </div>

          <Toggle
            checked={
              form.trackInventory
            }
            onChange={(value) =>
              set(
                "trackInventory",
                value
              )
            }
            disabled={isBusy}
            icon="solar:clipboard-list-bold"
            title="ردیابی موجودی"
            hint="موجودی محصول را کنترل کن"
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
                  value={
                    form.stock
                  }
                  onChange={(event) =>
                    set(
                      "stock",
                      event.target
                        .value
                    )
                  }
                  disabled={isBusy}
                  className={
                    inputBase
                  }
                />
              </Field>

              <Field label="آستانه موجودی کم">
                <input
                  type="number"
                  min="0"
                  value={
                    form.lowStockThreshold
                  }
                  onChange={(event) =>
                    set(
                      "lowStockThreshold",
                      event.target
                        .value
                    )
                  }
                  disabled={isBusy}
                  className={
                    inputBase
                  }
                />
              </Field>

            </div>
          )}

          <Toggle
            checked={
              form.allowBackorder
            }
            onChange={(value) =>
              set(
                "allowBackorder",
                value
              )
            }
            disabled={isBusy}
            icon="solar:cart-check-bold"
            title="پیش‌فروش بدون موجودی"
            hint="با موجودی صفر هم سفارش قبول شود"
          />

          <Field
            label="وضعیت محصول"
            required
          >
            <select
              value={
                form.status
              }
              onChange={(event) =>
                set(
                  "status",
                  event.target
                    .value
                )
              }
              disabled={isBusy}
              className={
                selectBase
              }
              style={
                chevronBg
              }
            >
              {STATUS_OPTIONS.map(
                (item) => (
                  <option
                    key={
                      item.value
                    }
                    value={
                      item.value
                    }
                  >
                    {
                      item.label
                    }
                  </option>
                )
              )}
            </select>
          </Field>
        </div>

        {/* =================================================
            IDENTIFIERS
        ================================================= */}

        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
            <Icon
              icon="solar:qr-code-bold-duotone"
              className="text-emerald-600 text-lg"
            />

            شناسه‌های محصول
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="SKU">
              <input
                type="text"
                value={
                  form.sku
                }
                onChange={(event) =>
                  set(
                    "sku",
                    event.target
                      .value
                  )
                }
                disabled={isBusy}
                className={
                  inputBase
                }
                placeholder="مثال: HP-15-2026"
              />
            </Field>

            <Field label="بارکد">
              <input
                type="text"
                value={
                  form.barcode
                }
                onChange={(event) =>
                  set(
                    "barcode",
                    event.target
                      .value
                  )
                }
                disabled={isBusy}
                className={
                  inputBase
                }
                placeholder="8901234567890"
              />
            </Field>

          </div>
        </div>

        {/* =================================================
            SUBMIT
        ================================================= */}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-[11px] text-gray-400">
            فیلدهای ستاره‌دار الزامی هستند
          </p>

          <div className="flex items-center gap-2.5">

            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              disabled={isBusy}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={isBusy}
              className="px-6 py-2.5 rounded-xl bg-[#15803d] text-white text-sm font-semibold shadow-sm disabled:opacity-60 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Icon
                    icon="solar:spinner-bold"
                    className="animate-spin"
                  />

                  در حال ارسال...
                </>
              ) : isSuccess ? (
                <>
                  <Icon icon="solar:check-circle-bold" />

                  ثبت شد
                </>
              ) : (
                <>
                  <Icon icon="solar:add-circle-bold" />

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