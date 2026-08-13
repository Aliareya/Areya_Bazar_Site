// src/pages/customer-dashboard/MyProducts.jsx
import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useSeller } from "../../../context/SellerContext";

/* ─────────────────────── config ─────────────────────── */
const API_URL = "https://areyabazaarapi.vercel.app/api/products/myproducts";
const TOKEN_KEY = "accessToken";

const STATUS_MAP = {
  active: { label: "فعال", color: "emerald", icon: "solar:check-circle-bold" },
  draft: { label: "پیش‌نویس", color: "amber", icon: "solar:pen-new-square-bold" },
  archived: { label: "بایگانی", color: "gray", icon: "solar:archive-bold" },
};

const COLOR_CLASSES = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  gray: "bg-gray-100 text-gray-500 border-gray-200",
  red: "bg-red-50 text-red-700 border-red-100",
};

const FILTERS = [
  { value: "all", label: "همه" },
  { value: "active", label: "فعال" },
  { value: "draft", label: "پیش‌نویس" },
  { value: "archived", label: "بایگانی" },
  { value: "lowstock", label: "موجودی کم" },
];

/* ─────────────────────── helpers ─────────────────────── */
const formatPrice = (val) => {
  const num = Number(val);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("fa-IR") + " افغانی";
};

const getMainImage = (product) =>
  product.images?.[0]?.url ||
  product.store?.logo ||
  null;

const isLowStock = (product) =>
  product.trackInventory &&
  Number(product.stock) <= Number(product.lowStockThreshold ?? 0);

const isOutOfStock = (product) =>
  product.trackInventory && Number(product.stock) <= 0;

/* ─────────────────────── status badge ─────────────────────── */
function StatusBadge({ product }) {
  const s = STATUS_MAP[product.status];
  const outOfStock = isOutOfStock(product);

  if (outOfStock) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${COLOR_CLASSES.red}`}>
        <Icon icon="solar:close-circle-bold" className="text-sm" />
        ناموجود
      </span>
    );
  }
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${COLOR_CLASSES[s.color]}`}>
      <Icon icon={s.icon} className="text-sm" />
      {s.label}
    </span>
  );
}

/* ─────────────────────── skeleton loading card ─────────────────────── */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="flex gap-4 p-4 sm:p-5">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2.5 py-1">
          <div className="h-4 w-3/4 bg-gray-100 rounded-md" />
          <div className="h-3 w-1/2 bg-gray-100 rounded-md" />
          <div className="flex gap-2 mt-3">
            <div className="h-5 w-16 bg-gray-100 rounded-lg" />
            <div className="h-5 w-14 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-gray-50 bg-gray-50/50">
        <div className="h-3 w-24 bg-gray-100 rounded-md" />
        <div className="h-4 w-20 bg-gray-100 rounded-md" />
      </div>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

function DeleteConfirmModal({ product, isDeleting, onCancel, onConfirm }) {
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
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            onClick={() => onConfirm(product.id)}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 active:scale-95 transition-all font-semibold disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Icon icon="solar:spinner-bold" className="animate-spin text-sm" />
                در حال حذف...
              </>
            ) : (
              "حذف کن"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── product card ─────────────────────── */
function ProductCard({ product, onEdit, onDeleteRequest }) {
  const image = getMainImage(product);
  const hasDiscount =
    product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 group">
      <div className="flex gap-4 p-4 sm:p-5">
        {/* ── Image ── */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon icon="solar:gallery-bold" className="text-gray-300 text-2xl" />
            </div>
          )}
          {product.featured && (
            <span className="absolute top-1 right-1 w-5 h-5 rounded-md bg-amber-400 flex items-center justify-center">
              <Icon icon="solar:star-bold" className="text-white text-[10px]" />
            </span>
          )}
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
              {product.store?.name || "—"}
              {product.brand && (
                <>
                  <span className="mx-0.5">·</span>
                  {product.brand}
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <StatusBadge product={product} />
            {isLowStock(product) && !isOutOfStock(product) && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-semibold ${COLOR_CLASSES.amber}`}>
                <Icon icon="solar:danger-triangle-bold" className="text-xs" />
                موجودی کم
              </span>
            )}
            <span className="text-[11px] text-gray-400">
              موجودی: {product.trackInventory ? Number(product.stock).toLocaleString("fa-IR") : "نامحدود"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          {product.sku && (
            <span className="flex items-center gap-1">
              <Icon icon="solar:hashtag-bold" className="text-xs" />
              {product.sku}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-sm font-extrabold text-gray-800">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              ٪{discountPercent.toLocaleString("fa-IR")}-
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── empty / error states ─────────────────────── */
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

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Icon icon="solar:danger-triangle-bold" className="text-red-400 text-2xl" />
      </div>
      <p className="text-sm font-semibold text-gray-700">مشکلی در دریافت محصولات پیش آمد</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#15803d] text-white text-xs font-semibold hover:bg-[#166534] transition-all"
      >
        <Icon icon="solar:refresh-bold" className="text-sm" />
        تلاش مجدد
      </button>
    </div>
  );
}

/* ─────────────────────── main page ─────────────────────── */
export default function MyProducts() {
  const navigate = useNavigate();
  const { seller } = useSeller();
  const storeId = seller?.store?.id;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /* ── fetch products ── */
  const fetchProducts = useCallback(async () => {
    if (!storeId) {
      setIsLoading(false);
      setFetchError("فروشگاهی برای این حساب یافت نشد.");
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      setFetchError("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
      return;
    }

    setIsLoading(true);
    setFetchError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ store_id: storeId }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          throw new Error("دسترسی غیرمجاز. لطفاً دوباره وارد شوید.");
        }
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || `خطای سرور: ${response.status}`);
      }

      const data = await response.json();
      // API might return array directly or { products: [...] }
      const list = Array.isArray(data) ? data : data.products || [];
      setProducts(list);
    } catch (err) {
      console.error("Failed to load products:", err);
      setFetchError(err.message || "مشکلی در ارتباط با سرور پیش آمد");
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ── derived data ── */
  const filteredProducts = products.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "lowstock") return isLowStock(p) && !isOutOfStock(p);
    return p.status === activeFilter;
  });

  const totalStockValue = products
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + Number(p.price) * (Number(p.stock) || 0), 0);

  /* ── actions ── */
  const handleAddNew = () => {
    navigate("/seller/myproducts/create");
  };

  const handleEdit = (product) => {
    navigate(`/seller/products/${product.id}/edit`);
  };

  const handleDeleteRequest = (product) => {
    setDeleteError("");
    setProductToDelete(product);
  };

  const handleDeleteConfirm = async (id) => {
    const token = localStorage.getItem(TOKEN_KEY);
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "حذف محصول با خطا مواجه شد");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setProductToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleteError(err.message || "مشکلی در حذف محصول پیش آمد");
    } finally {
      setIsDeleting(false);
    }
  };

  /* ─────────────────────── render ─────────────────────── */
  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* ── Delete confirm modal ── */}
      <DeleteConfirmModal
        product={productToDelete}
        isDeleting={isDeleting}
        onCancel={() => { setProductToDelete(null); setDeleteError(""); }}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Delete error toast ── */}
      {deleteError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 flex items-center gap-2.5 animate-fadeIn">
          <Icon icon="solar:danger-triangle-bold" className="text-red-500 text-base shrink-0" />
          <p className="text-xs font-medium text-red-700 flex-1">{deleteError}</p>
          <button onClick={() => setDeleteError("")} className="text-red-400 hover:text-red-600">
            <Icon icon="solar:close-circle-bold" className="text-base" />
          </button>
        </div>
      )}

      {/* ── Page heading ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <span>پنل فروشنده</span>
            <Icon icon="solar:alt-arrow-left-linear" className="text-[10px]" />
            <span className="text-gray-700 font-medium">محصولات من</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            محصولات من
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            مدیریت محصولات فروشگاه شما
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Icon icon="solar:wallet-money-bold" className="text-emerald-600 text-base" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400">ارزش موجودی فعال</p>
              <p className="text-sm font-extrabold text-gray-800">{formatPrice(totalStockValue)}</p>
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
      {!isLoading && !fetchError && (
        <div className="flex flex-wrap gap-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          {FILTERS.map((f) => {
            const count =
              f.value === "all"
                ? products.length
                : f.value === "lowstock"
                  ? products.filter((p) => isLowStock(p) && !isOutOfStock(p)).length
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
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <LoadingGrid />
      ) : fetchError ? (
        <ErrorState message={fetchError} onRetry={fetchProducts} />
      ) : filteredProducts.length === 0 ? (
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