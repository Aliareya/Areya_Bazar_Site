import React, { useState, useMemo, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

// ---------------------------------------------------------------------------
// Product data
// ---------------------------------------------------------------------------
const PRODUCTS = [
  { id: 1, name: "Wooden Sofa Chair", category: "Living Room", color: "Brown", material: "Wood", price: 80, oldPrice: 160, discount: "50% off", rating: 4.9, inStock: true, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&q=80" },
  { id: 2, name: "Circular Sofa Chair", category: "Living Room", color: "Gray", material: "Upholstered", price: 108, oldPrice: 120, discount: "10% off", rating: 5.0, inStock: true, image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80" },
  { id: 3, name: "Wooden Nightstand", category: "Bedroom", color: "Brown", material: "Wood", price: 54, oldPrice: 60, discount: "10% off", rating: 4.8, inStock: true, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&q=80" },
  { id: 4, name: "Bean Bag chair", category: "Living Room", color: "Orange", material: "Upholstered", price: 72, oldPrice: 80, discount: "10% off", rating: 4.8, inStock: true, image: "https://images.unsplash.com/photo-1622287527421-b60748a63b26?w=500&q=80" },
  { id: 5, name: "Wingback Chair", category: "Office", color: "Brown", material: "Upholstered", price: 160, oldPrice: 200, discount: "20% off", rating: 4.9, inStock: false, image: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=500&q=80" },
  { id: 6, name: "Gaming Chair", category: "Office", color: "Black", material: "Metal", price: 90, oldPrice: 100, discount: "10% off", rating: 4.9, inStock: true, image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&q=80" },
  { id: 7, name: "Swivel Chair", category: "Office", color: "Black", material: "Metal", price: 60, oldPrice: 100, discount: "40% off", rating: 4.8, inStock: true, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80" },
  { id: 8, name: "Table Lamp", category: "Lighting", color: "White", material: "Glass", price: 40, oldPrice: 80, discount: "30% off", rating: 4.9, inStock: true, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80" },
  { id: 9, name: "Nightstand Wooden", category: "Bedroom", color: "Brown", material: "Wood", price: 45, oldPrice: 60, discount: "10% off", rating: 4.9, inStock: true, image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&q=80" },
  { id: 10, name: "Bar Stool", category: "Kitchen", color: "Brown", material: "Wood", price: 48, oldPrice: 60, discount: "20% off", rating: 4.8, inStock: true, image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&q=80" },
  { id: 11, name: "Bentwood Chair", category: "Living Room", color: "Brown", material: "Wood", price: 40, oldPrice: 60, discount: "10% off", rating: 4.9, inStock: false, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80" },
  { id: 12, name: "Brown Bean Bag Chair", category: "Living Room", color: "Brown", material: "Upholstered", price: 90, oldPrice: 100, discount: "10% off", rating: 4.9, inStock: true, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&q=80" },
  { id: 13, name: "Rattan Outdoor Chair", category: "Outdoor", color: "Brown", material: "Wood", price: 95, oldPrice: 120, discount: "20% off", rating: 4.7, inStock: true, image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=500&q=80" },
  { id: 14, name: "Decorative Vase", category: "Decor", color: "White", material: "Glass", price: 30, oldPrice: 45, discount: "15% off", rating: 4.6, inStock: true, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80" },
];

const CATEGORIES = ["Bedroom", "Living Room", "Office", "Lighting", "Kitchen", "Outdoor", "Decor"];
const COLORS = [
  { name: "Brown", hex: "#8B5E3C" },
  { name: "Gray", hex: "#9CA3AF" },
  { name: "Black", hex: "#111827" },
  { name: "Green", hex: "#22C55E" },
  { name: "Red", hex: "#EF4444" },
  { name: "Orange", hex: "#F97316" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "White", hex: "#FFFFFF" },
];
const MATERIALS = ["Metal", "Wood", "Upholstered", "Glass", "Plastic"];
const PRICE_BOUNDS = { min: 0, max: 200 };
const PAGE_SIZE = 6;

const SORT_OPTIONS = [
  { value: "default", label: "Default Sorting" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        <Icon
          icon="mdi:chevron-down"
          className={`w-4 h-4 text-gray-400 transition-transform group-hover:text-gray-600 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && children}
    </div>
  );
}

function DualRangeSlider({ min, max, values, onChange }) {
  const [minVal, maxVal] = values;
  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div>
      <style>{`
        .range-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: transparent;
          margin: 0;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #15803d;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #15803d;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          cursor: pointer;
        }
        .range-thumb::-webkit-slider-runnable-track { background: transparent; }
        .range-thumb::-moz-range-track { background: transparent; }
      `}</style>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
        <div
          className="absolute h-1.5 bg-green-700 rounded-full"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), maxVal - 5);
            onChange([v, maxVal]);
          }}
          className="range-thumb"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), minVal + 5);
            onChange([minVal, v]);
          }}
          className="range-thumb"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
        <span className="px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
          ${minVal.toFixed(2)}
        </span>
        <span className="px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
          ${maxVal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 text-sm px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <Icon icon="mdi:close" className="w-3.5 h-3.5 cursor-pointer hover:text-orange-800" />
      </button>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Product card
// ---------------------------------------------------------------------------
function ProductCard({ product, wishlisted, onToggleWishlist, onQuickView, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-3 group">
      <div className="relative rounded-xl overflow-hidden bg-gray-100">
        <span className="absolute top-3 left-3 z-10 bg-green-700 text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {product.discount}
        </span>
        {!product.inStock && (
          <span className="absolute bottom-3 left-3 z-10 bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Out of stock
          </span>
        )}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => onToggleWishlist(product.id)}
            aria-label="Add to wishlist"
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
          >
            <Icon
              icon={wishlisted ? "mdi:heart" : "mdi:heart-outline"}
              className={`w-4 h-4 ${wishlisted ? "text-red-500" : "text-gray-700"}`}
            />
          </button>
          <button
            onClick={() => onQuickView(product)}
            aria-label="Quick view"
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors"
          >
            <Icon icon="mdi:arrow-expand" className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            aria-label="Add to cart"
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon icon="mdi:cart-outline" className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <img src={product.image} alt={product.name} className="w-full h-44 object-cover" />
      </div>

      <div className="pt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500">{product.category}</span>
        <span className="flex items-center gap-1 text-gray-700">
          <Icon icon="mdi:star" className="w-4 h-4 text-yellow-400" />
          {product.rating}
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 mt-1">{product.name}</h3>

      <div className="flex items-center gap-2 mt-1">
        <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
        <span className="text-gray-400 text-sm line-through">${product.oldPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter content — shared by the desktop sidebar AND the mobile drawer
// ---------------------------------------------------------------------------
function FilterContent({ filters, setFilters, resultCount, compact = false }) {
  const toggleInArray = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  const resetFilters = () =>
    setFilters({
      category: null,
      price: [PRICE_BOUNDS.min, PRICE_BOUNDS.max],
      colors: [],
      materials: [],
      availability: [],
    });

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Filter Options</h2>
            <p className="text-xs text-gray-400 mt-0.5">{resultCount} results found</p>
          </div>
          <button
            onClick={resetFilters}
            title="Reset filters"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors"
          >
            <Icon icon="mdi:refresh" className="w-4 h-4" />
          </button>
        </div>
      )}

      <FilterSection title="Category" defaultOpen={!compact}>
        <ul className="space-y-1 text-sm">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat;
            return (
              <li key={cat}>
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: prev.category === cat ? null : cat,
                    }))
                  }
                  className={`w-full text-left px-3 py-1.5 rounded-lg border-l-2 transition-colors ${
                    active
                      ? "border-green-700 bg-green-50 text-green-700 font-medium"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {cat}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterSection>

      <FilterSection title="Price" defaultOpen={!compact}>
        <DualRangeSlider
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          values={filters.price}
          onChange={(v) => setFilters((prev) => ({ ...prev, price: v }))}
        />
      </FilterSection>

      <FilterSection title="Color" defaultOpen={!compact}>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => {
            const active = filters.colors.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggleInArray("colors", c.name)}
                title={c.name}
                className={`relative w-7 h-7 rounded-full border transition-transform ${
                  active ? "ring-2 ring-offset-2 ring-green-700 scale-105" : "border-gray-200"
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {active && (
                  <Icon
                    icon="mdi:check"
                    className={`w-3.5 h-3.5 absolute inset-0 m-auto ${
                      ["White"].includes(c.name) ? "text-gray-800" : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Material" defaultOpen={!compact}>
        <ul className="space-y-2 text-sm text-gray-600">
          {MATERIALS.map((m) => (
            <li key={m}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={filters.materials.includes(m)}
                  onChange={() => toggleInArray("materials", m)}
                  className="accent-green-700 rounded w-4 h-4"
                />
                {m}
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Availability" defaultOpen>
        <ul className="space-y-2 text-sm text-gray-600">
          {["In Stock", "Out of Stock"].map((label) => (
            <li key={label}>
              <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(label)}
                  onChange={() => toggleInArray("availability", label)}
                  className="accent-green-700 rounded w-4 h-4"
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      {compact && (
        <button
          onClick={resetFilters}
          className="w-full text-sm text-gray-500 hover:text-gray-800 underline pt-1"
        >
          Reset all filters
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop sidebar (lg and up)
// ---------------------------------------------------------------------------
function FilterSidebar({ filters, setFilters, resultCount }) {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <FilterContent filters={filters} setFilters={setFilters} resultCount={resultCount} />
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Mobile filter bar + bottom-sheet drawer (below lg breakpoint)
// ---------------------------------------------------------------------------
function MobileFilterBar({ onOpen, activeCount, sort, setSort }) {
  return (
    <div className="flex lg:hidden items-center gap-3 mb-6">
      <button
        onClick={onOpen}
        className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 relative"
      >
        <Icon icon="mdi:tune-variant" className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-700 text-white text-[11px] flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg py-2.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MobileFilterDrawer({ open, onClose, filters, setFilters, resultCount }) {
  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-opacity ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Filter Options</h2>
            <p className="text-xs text-gray-400 mt-0.5">{resultCount} results found</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1">
          <FilterContent
            filters={filters}
            setFilters={setFilters}
            resultCount={resultCount}
            compact
          />
        </div>
        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-green-700 text-white font-medium py-2.5 rounded-lg hover:bg-green-800 transition-colors"
          >
            Show {resultCount} results
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick view modal
// ---------------------------------------------------------------------------
function QuickViewModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow"
          >
            <Icon icon="mdi:close" className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{product.category}</span>
            <span className="flex items-center gap-1">
              <Icon icon="mdi:star" className="w-4 h-4 text-yellow-400" />
              {product.rating}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mt-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
            <span className="text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
            <span className="text-green-700 text-sm font-medium">{product.discount}</span>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {product.material} · {product.color} ·{" "}
            {product.inStock ? "In stock" : "Out of stock"}
          </p>
          <button
            disabled={!product.inStock}
            className="mt-5 w-full bg-green-700 text-white font-medium py-2.5 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Shop page
// ---------------------------------------------------------------------------
export default function Shop() {
  const [filters, setFilters] = useState({
    category: null,
    price: [PRICE_BOUNDS.min, PRICE_BOUNDS.max],
    colors: [],
    materials: [],
    availability: [],
  });
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (filters.category && p.category !== filters.category) return false;
      if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
      if (filters.colors.length && !filters.colors.includes(p.color)) return false;
      if (filters.materials.length && !filters.materials.includes(p.material)) return false;
      if (filters.availability.length) {
        const wantsInStock = filters.availability.includes("In Stock");
        const wantsOutOfStock = filters.availability.includes("Out of Stock");
        if (wantsInStock && !wantsOutOfStock && !p.inStock) return false;
        if (wantsOutOfStock && !wantsInStock && p.inStock) return false;
      }
      return true;
    });
  }, [filters]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    else if (sort === "rating") arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [filteredProducts, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to page 1 whenever filters or sort change
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const activePriceChanged =
    filters.price[0] !== PRICE_BOUNDS.min || filters.price[1] !== PRICE_BOUNDS.max;

  const removeFilter = (type, value) => {
    setFilters((prev) => {
      if (type === "category") return { ...prev, category: null };
      if (type === "price") return { ...prev, price: [PRICE_BOUNDS.min, PRICE_BOUNDS.max] };
      if (type === "color") return { ...prev, colors: prev.colors.filter((c) => c !== value) };
      if (type === "material")
        return { ...prev, materials: prev.materials.filter((m) => m !== value) };
      if (type === "availability")
        return { ...prev, availability: prev.availability.filter((a) => a !== value) };
      return prev;
    });
  };

  const clearAll = () =>
    setFilters({
      category: null,
      price: [PRICE_BOUNDS.min, PRICE_BOUNDS.max],
      colors: [],
      materials: [],
      availability: [],
    });

  const hasActiveFilters =
    filters.category ||
    activePriceChanged ||
    filters.colors.length ||
    filters.materials.length ||
    filters.availability.length;

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (activePriceChanged ? 1 : 0) +
    filters.colors.length +
    filters.materials.length +
    filters.availability.length;

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const isIn = prev.includes(id);
      showToast(isIn ? "Removed from wishlist" : "Added to wishlist");
      return isIn ? prev.filter((w) => w !== id) : [...prev, id];
    });
  };

  const addToCart = (product) => {
    if (!product.inStock) return;
    setCartCount((c) => c + 1);
    showToast(`${product.name} added to cart`);
  };

  const start = sortedProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, sortedProducts.length);

  return (
    <div className="bg-white relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {/* Cart indicator */}
      <div className="fixed top-6 right-6 z-40 hidden sm:flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2">
        <Icon icon="mdi:cart-outline" className="w-4 h-4 text-gray-700" />
        <span className="text-sm text-gray-700">{cartCount}</span>
      </div>

      {/* Page title */}
      <div className="text-center py-10 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
        <p className="text-sm text-gray-500 mt-2">Home / Shop</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10">
        <FilterSidebar filters={filters} setFilters={setFilters} resultCount={sortedProducts.length} />

        <div className="flex-1">
          {/* Mobile filter bar (Filters + Sort, hidden on lg+) */}
          <MobileFilterBar
            onOpen={() => setMobileFiltersOpen(true)}
            activeCount={activeFilterCount}
            sort={sort}
            setSort={setSort}
          />

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <p className="text-sm text-gray-500">
              {sortedProducts.length === 0
                ? "No results found"
                : `Showing ${start}-${end} of ${sortedProducts.length} results`}
            </p>
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort by :</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {filters.category && (
                <FilterPill label={filters.category} onRemove={() => removeFilter("category")} />
              )}
              {activePriceChanged && (
                <FilterPill
                  label={`Price : $${filters.price[0].toFixed(2)} - $${filters.price[1].toFixed(2)}`}
                  onRemove={() => removeFilter("price")}
                />
              )}
              {filters.colors.map((c) => (
                <FilterPill key={c} label={c} onRemove={() => removeFilter("color", c)} />
              ))}
              {filters.materials.map((m) => (
                <FilterPill key={m} label={m} onRemove={() => removeFilter("material", m)} />
              ))}
              {filters.availability.map((a) => (
                <FilterPill key={a} label={a} onRemove={() => removeFilter("availability", a)} />
              ))}
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-gray-800 underline ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {paginatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  wishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={setQuickViewProduct}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
              <Icon icon="mdi:sofa-outline" className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No products match your filters.</p>
              <button
                onClick={clearAll}
                className="mt-3 text-green-700 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon icon="mdi:chevron-left" className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    n === currentPage
                      ? "bg-orange-500 text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon icon="mdi:chevron-right" className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feature strip */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center">
              <Icon icon="mdi:truck-fast-outline" className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Free Shipping</p>
              <p className="text-sm text-gray-500">Free shipping for order above $150</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center">
              <Icon icon="mdi:credit-card-outline" className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Flexible Payment</p>
              <p className="text-sm text-gray-500">Multiple secure payment options</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center">
              <Icon icon="mdi:headset" className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">24×7 Support</p>
              <p className="text-sm text-gray-500">We support online all days</p>
            </div>
          </div>
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        resultCount={sortedProducts.length}
      />
    </div>
  );
}