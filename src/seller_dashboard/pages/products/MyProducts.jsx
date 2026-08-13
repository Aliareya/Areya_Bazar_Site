// src/pages/customer-dashboard/MyProducts.jsx
import { useState } from "react";
import { Icon } from "@iconify/react";

/* ─────────────────────── static mock data ─────────────────────── */
const STATUS_MAP = {
  delivered:  { label: "تحویل داده شده", color: "emerald", icon: "solar:check-circle-bold" },
  shipping:   { label: "در حال ارسال",   color: "blue",    icon: "solar:delivery-bold" },
  processing: { label: "در حال پردازش",  color: "amber",   icon: "solar:clock-circle-bold" },
  cancelled:  { label: "لغو شده",        color: "red",     icon: "solar:close-circle-bold" },
};

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "کفش ورزشی نایک ایر مکس",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
    store: "فروشگاه ورزشی البرز",
    price: 2450000,
    quantity: 1,
    status: "delivered",
    orderDate: "۱۴۰۴/۰۳/۱۲",
    orderNumber: "AB-10234",
  },
  {
    id: 2,
    name: "هدفون بی‌سیم سونی WH-1000XM4",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    store: "دیجی‌کالای آریا",
    price: 8900000,
    quantity: 1,
    status: "shipping",
    orderDate: "۱۴۰۴/۰۴/۰۲",
    orderNumber: "AB-10391",
  },
  {
    id: 3,
    name: "مبل راحتی سه‌نفره مدل وینتیج",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=300&fit=crop",
    store: "مبلمان کابل چوب",
    price: 15200000,
    quantity: 1,
    status: "processing",
    orderDate: "۱۴۰۴/۰۴/۰۸",
    orderNumber: "AB-10412",
  },
  {
    id: 4,
    name: "کتری برقی فیلیپس",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=300&h=300&fit=crop",
    store: "لوازم خانگی هرات",
    price: 1350000,
    quantity: 2,
    status: "delivered",
    orderDate: "۱۴۰۴/۰۲/۲۰",
    orderNumber: "AB-09876",
  },
  {
    id: 5,
    name: "پیراهن مردانه کلاسیک",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop",
    store: "پوشاک مزار مد",
    price: 680000,
    quantity: 1,
    status: "cancelled",
    orderDate: "۱۴۰۴/۰۳/۲۸",
    orderNumber: "AB-10187",
  },
  {
    id: 6,
    name: "لپ‌تاپ ایسوس ویووبوک ۱۵",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop",
    store: "دیجیتال مارکت قندهار",
    price: 32500000,
    quantity: 1,
    status: "shipping",
    orderDate: "۱۴۰۴/۰۴/۱۰",
    orderNumber: "AB-10455",
  },
];

const FILTERS = [
  { value: "all",        label: "همه" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipping",   label: "در حال ارسال" },
  { value: "delivered",  label: "تحویل شده" },
  { value: "cancelled",  label: "لغو شده" },
];

const COLOR_CLASSES = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  blue:    "bg-blue-50 text-blue-700 border-blue-100",
  amber:   "bg-amber-50 text-amber-700 border-amber-100",
  red:     "bg-red-50 text-red-700 border-red-100",
};

/* ─────────────────────── helpers ─────────────────────── */
const formatPrice = (num) =>
  num.toLocaleString("fa-IR") + " افغانی";

/* ─────────────────────── status badge ─────────────────────── */
function StatusBadge({ status }) {
  const s = STATUS_MAP[status];
  if (!s) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${COLOR_CLASSES[s.color]}`}
    >
      <Icon icon={s.icon} className="text-sm" />
      {s.label}
    </span>
  );
}

/* ─────────────────────── delete confirm modal ─────────────────────── */
function DeleteConfirmModal({ product, onCancel, onConfirm }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-scaleIn">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <Icon icon="solar:trash-bin-trash-bold" className="text-red-500 text-2xl" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold text-gray-900">حذف محصول</h3>
          <p className="text-xs text-gray-400">
            آیا از حذف «{product.name}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.
          </p>
        </div>
        <div className="flex items-center gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium"
          >
            انصراف
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 active:scale-95 transition-all font-semibold"
          >
            حذف کن
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── product card ─────────────────────── */
function ProductCard({ product, onEdit, onDeleteRequest }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className="flex gap-4 p-4 sm:p-5">
        {/* ── Image ── */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* ── Info ── */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 leading-snug line-clamp-2">
                {product.name}
              </h3>

              {/* ── Edit / Delete actions ── */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEdit(product)}
                  title="ویرایش"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Icon icon="solar:pen-bold" className="text-sm" />
                </button>
                <button
                  onClick={() => onDeleteRequest(product)}
                  title="حذف"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Icon icon="solar:trash-bin-trash-bold" className="text-sm" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 flex items-center gap-1">
              <Icon icon="solar:shop-2-bold" className="text-xs" />
              {product.store}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusBadge status={product.status} />
            <span className="text-[11px] text-gray-400">
              تعداد: {product.quantity.toLocaleString("fa-IR")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Icon icon="solar:hashtag-bold" className="text-xs" />
            {product.orderNumber}
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="solar:calendar-bold" className="text-xs" />
            {product.orderDate}
          </span>
        </div>
        <span className="text-sm font-extrabold text-gray-800">
          {formatPrice(product.price)}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────── empty state ─────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        <Icon icon="solar:box-minimalistic-bold" className="text-gray-300 text-3xl" />
      </div>
      <p className="text-sm font-semibold text-gray-600">محصولی در این دسته یافت نشد</p>
      <p className="text-xs text-gray-400 mt-1">فیلتر دیگری را امتحان کنید</p>
    </div>
  );
}

/* ─────────────────────── main page ─────────────────────── */
export default function MyProducts() {
  const [products, setProducts]         = useState(INITIAL_PRODUCTS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.status === activeFilter);

  const totalSpent = products
    .filter((p) => p.status !== "cancelled")
    .reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleAddNew = () => {
    // TODO: به‌جای alert، ناوبری به صفحه/مودال افزودن محصول
    alert("رفتن به صفحه‌ی افزودن محصول جدید");
  };

  const handleEdit = (product) => {
    // TODO: به‌جای alert، ناوبری به صفحه/مودال ویرایش با product.id
    alert(`ویرایش محصول: ${product.name}`);
  };

  const handleDeleteRequest = (product) => {
    setProductToDelete(product);
  };

  const handleDeleteConfirm = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setProductToDelete(null);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* ── Delete confirm modal ── */}
      <DeleteConfirmModal
        product={productToDelete}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Page heading ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <span>حساب کاربری</span>
            <Icon icon="solar:alt-arrow-left-linear" className="text-[10px]" />
            <span className="text-gray-700 font-medium">محصولات من</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            محصولات من
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            تاریخچه سفارش‌ها و محصولات خریداری‌شده
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Icon icon="solar:wallet-money-bold" className="text-emerald-600 text-base" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400">مجموع خرید</p>
              <p className="text-sm font-extrabold text-gray-800">{formatPrice(totalSpent)}</p>
            </div>
          </div>

          {/* ── Add new product ── */}
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#15803d] text-white text-xs sm:text-sm font-semibold hover:bg-[#166534] active:scale-95 transition-all shadow-sm shadow-emerald-200 shrink-0"
          >
            <Icon icon="solar:add-circle-bold" className="text-base sm:text-lg" />
            افزودن محصول
          </button>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
        {FILTERS.map((f) => {
          const count =
            f.value === "all"
              ? products.length
              : products.filter((p) => p.status === f.value).length;
          const active = activeFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={[
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-150",
                active
                  ? "bg-[#15803d] text-white shadow-sm shadow-emerald-200"
                  : "text-gray-500 hover:bg-gray-50",
              ].join(" ")}
            >
              {f.label}
              <span
                className={[
                  "text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center",
                  active ? "bg-white/20" : "bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                {count.toLocaleString("fa-IR")}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Products list ── */}
      {filteredProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}