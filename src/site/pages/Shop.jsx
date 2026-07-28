import React, { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const API_URL = "http://localhost:3000/products";
const PAGE_SIZE = 6;

const FILTER_BG = "#23633a";
const FILTER_BG_SOFT = "#1c4f2f";
const ACCENT = "#f97316";

function getProductStock(product) {
  return Number(product.stock || 0);
}

function isProductInStock(product) {
  return getProductStock(product) > 0 || product.allowBackorder === true;
}

function getDiscountPercentage(product) {
  const price = Number(product.price || 0);
  const compareAtPrice = Number(product.compareAtPrice || 0);

  if (!compareAtPrice || compareAtPrice <= price) {
    return null;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .flatMap((tag) => {
      if (typeof tag !== "string") {
        return [];
      }

      return tag
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((item) => item.replace(/^["']|["']$/g, "").trim())
        .filter(Boolean);
    })
    .filter(Boolean);
}

function getSellerName(user) {
  if (!user) {
    return "Unknown Seller";
  }

  const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return name || "Unknown Seller";
}

function SortSelect({ value, onChange, className = "" }) {
  const options = [
    {
      value: "default",
      label: "Default Sorting",
    },
    {
      value: "price-asc",
      label: "Price: Low to High",
    },
    {
      value: "price-desc",
      label: "Price: High to Low",
    },
    {
      value: "name-asc",
      label: "Name: A to Z",
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <Icon
        icon="mdi:sort-variant"
        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort products"
        className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-9 pr-9 py-2.5 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Icon
        icon="mdi:chevron-down"
        className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  );
}


function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/15 pb-4">
      <button
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <h3 className="font-medium text-white tracking-wide text-sm uppercase">
          {title}
        </h3>

        <Icon
          icon="mdi:chevron-down"
          className={`w-4 h-4 text-white/50 transition-transform ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {open && children}
    </div>
  );
}

function DualRangeSlider({ min, max, values, onChange }) {
  const [minVal, maxVal] = values;
  const range = max - min || 1;

  const minPercent = ((minVal - min) / range) * 100;

  const maxPercent = ((maxVal - min) / range) * 100;

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
          background: ${ACCENT};
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
          cursor: pointer;
        }

        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: ${ACCENT};
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
          cursor: pointer;
        }
      `}</style>

      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-white/20 rounded-full" />

        <div
          className="absolute h-1.5 rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
            background: ACCENT,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(e) => {
            const value = Math.min(Number(e.target.value), maxVal);

            onChange([value, maxVal]);
          }}
          className="range-thumb"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(e) => {
            const value = Math.max(Number(e.target.value), minVal);

            onChange([minVal, value]);
          }}
          className="range-thumb"
        />
      </div>

      <div className="flex items-center justify-between text-sm text-white mt-2">
        <span
          className="px-2 py-1 rounded-md border border-white/15"
          style={{
            background: FILTER_BG_SOFT,
          }}
        >
          ${Number(minVal).toFixed(2)}
        </span>

        <span
          className="px-2 py-1 rounded-md border border-white/15"
          style={{
            background: FILTER_BG_SOFT,
          }}
        >
          ${Number(maxVal).toFixed(2)}
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
        <Icon icon="mdi:close" className="w-3.5 h-3.5 hover:text-orange-800" />
      </button>
    </span>
  );
}

function ProductCard({
  product,
  wishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) {
  const navigate = useNavigate()
  const inStock = isProductInStock(product);

  const discount = getDiscountPercentage(product);

  const seller = product.user;

  const sellerName = getSellerName(seller);

  return (
    <div className="bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-lg transition-shadow p-3 group">
      {/* Product Image */}
      <div
        className="relative rounded-xl overflow-hidden bg-gray-100">
        {discount && (
          <span className="absolute top-3 left-3 z-10 bg-green-700 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {discount}% off
          </span>
        )}

        {!inStock && (
          <span className="absolute bottom-3 left-3 z-10 bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Out of stock
          </span>
        )}

        {product.featured && (
          <span className="absolute bottom-3 right-3 z-10 bg-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => onToggleWishlist(product)}
            aria-label="Add to wishlist"
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white"
          >
            <Icon
              icon={wishlisted ? "mdi:heart" : "mdi:heart-outline"}
              className={`w-4 h-4 ${wishlisted ? "text-red-500" : "text-gray-700"
                }`}
            />
          </button>

          <button
            onClick={() => onQuickView(product)}
            aria-label="Quick view"
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white"
          >
            <Icon icon="mdi:arrow-expand" className="w-4 h-4 text-gray-700" />
          </button>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            aria-label="Add to cart"
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon icon="mdi:cart-outline" className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <img onClick={() => navigate(`/shop/${product.id}`)}
          src={
            product.image || "https://via.placeholder.com/500x500?text=No+Image"
          }
          alt={product.name}
          className="w-full h-44 object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/500x500?text=No+Image";
          }}
        />
      </div>



      {/* Category / Brand */}
      <div className="pt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {product.category || "Uncategorized"}
        </span>

        {product.brand && (
          <span className="text-gray-400">{product.brand}</span>
        )}
      </div>

      {/* Product Name */}
      <h3 onClick={() => navigate(`/shop/${product.id}`)} className="font-semibold text-gray-900 mt-1 line-clamp-1">
        {product.name}
      </h3>

      {/* Description
      {product.shortDescription && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.shortDescription}
        </p>
      )} */}

      {/* Price */}
      <div className="flex items-center gap-2 mt-2">
        <span className="font-semibold text-gray-900">
          {Number(product.price || 0).toFixed(2)} AFN
        </span>

        {Number(product.compareAtPrice) > Number(product.price) && (
          <span className="text-gray-400 text-sm line-through">
            ${Number(product.compareAtPrice).toFixed(2)}
          </span>
        )}
      </div>

      {/* Seller Profile */}
      <div className="flex items-center gap-2.5 mt-4 ">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
          {seller?.image ? (
            <img
              src={seller.image}
              alt={sellerName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <Icon icon="mdi:account" className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[11px] text-gray-400">Sold by</p>

          <p className="text-sm font-medium text-gray-800 truncate">
            {sellerName}
          </p>
        </div>
      </div>

    </div>
  );
}

// -----------------------------------------------------------------------------
// Filter Content
// -----------------------------------------------------------------------------

function FilterContent({
  filters,
  setFilters,
  resultCount,
  categories,
  brands,
  tags,
  priceBounds,
  compact = false,
}) {
  const toggleArrayValue = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];

      const exists = current.includes(value);

      return {
        ...prev,
        [key]: exists
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      category: null,
      brand: null,
      price: [priceBounds.min, priceBounds.max],
      tags: [],
      availability: [],
    });
  };

  return (
    <div className="space-y-5">
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Filter Options</h2>

            <p className="text-xs text-white/60 mt-0.5">
              {resultCount} results found
            </p>
          </div>

          <button
            onClick={resetFilters}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
          >
            <Icon icon="mdi:refresh" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Category */}
      <FilterSection title="Category">
        <ul className="space-y-1 text-sm">
          {categories.map((category) => {
            const active = filters.category === category;

            return (
              <li key={category}>
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: active ? null : category,
                    }))
                  }
                  className={`w-full text-left px-3 py-1.5 rounded-lg border-l-2 ${active
                    ? "border-orange-400 bg-white/10 text-white font-medium"
                    : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {category}
                </button>
              </li>
            );
          })}

          {categories.length === 0 && (
            <li className="text-white/50">No categories</li>
          )}
        </ul>
      </FilterSection>

      {/* Brand */}
      {brands.length > 0 && (
        <FilterSection title="Brand">
          <ul className="space-y-1 text-sm">
            {brands.map((brand) => {
              const active = filters.brand === brand;

              return (
                <li key={brand}>
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        brand: active ? null : brand,
                      }))
                    }
                    className={`w-full text-left px-3 py-1.5 rounded-lg border-l-2 ${active
                      ? "border-orange-400 bg-white/10 text-white font-medium"
                      : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {brand}
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterSection>
      )}

      {/* Price */}
      <FilterSection title="Price">
        <DualRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          values={filters.price}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              price: value,
            }))
          }
        />
      </FilterSection>

      {/* Tags */}
      {tags.length > 0 && (
        <FilterSection title="Tags">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = filters.tags.includes(tag);

              return (
                <button
                  key={tag}
                  onClick={() => toggleArrayValue("tags", tag)}
                  className={`px-2.5 py-1 rounded-full text-xs border ${active
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Availability */}
      <FilterSection title="Availability">
        {["In Stock", "Out of Stock"].map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 text-sm text-white/80 mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.availability.includes(item)}
              onChange={() => toggleArrayValue("availability", item)}
              className="accent-orange-500 w-4 h-4"
            />

            {item}
          </label>
        ))}
      </FilterSection>

      {compact && (
        <button
          onClick={resetFilters}
          className="w-full text-sm text-white/70 hover:text-white underline"
        >
          Reset all filters
        </button>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Desktop Sidebar
// -----------------------------------------------------------------------------

function FilterSidebar(props) {
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div
        className="sticky top-20 rounded-2xl shadow-sm p-5"
        style={{
          background: FILTER_BG,
        }}
      >
        <FilterContent {...props} />
      </div>
    </aside>
  );
}

// -----------------------------------------------------------------------------
// Mobile Filters
// -----------------------------------------------------------------------------

function MobileFilterDrawer({ open, onClose, ...props }) {
  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? "visible" : "invisible"
        }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl flex flex-col transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"
          }`}
        style={{
          background: FILTER_BG,
        }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/15">
          <h2 className="text-lg font-semibold text-white">Filters</h2>

          <button onClick={onClose} className="text-white">
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5">
          <FilterContent {...props} compact />
        </div>

        <div className="p-5 border-t border-white/15">
          <button
            onClick={onClose}
            className="w-full bg-white text-green-800 font-medium py-3 rounded-lg"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Quick View Modal
// -----------------------------------------------------------------------------

function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) {
    return null;
  }

  const seller = product.user;

  const sellerName = getSellerName(seller);

  const inStock = isProductInStock(product);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={
              product.image ||
              "https://via.placeholder.com/500x500?text=No+Image"
            }
            alt={product.name}
            className="w-full h-72 object-cover"
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Seller */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {seller?.image ? (
                <img
                  src={seller.image}
                  alt={sellerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon icon="mdi:account" className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div>
              <p className="text-xs text-gray-400">Sold by</p>

              <p className="font-semibold text-gray-800">{sellerName}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-5">{product.category}</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {product.name}
          </h2>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-xl font-bold">
              ${Number(product.price || 0).toFixed(2)}
            </span>

            {Number(product.compareAtPrice) > Number(product.price) && (
              <span className="text-gray-400 line-through">
                ${Number(product.compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 text-sm leading-6 mt-5">
              {product.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">SKU</p>

              <p className="text-sm font-medium">{product.sku || "N/A"}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Stock</p>

              <p className="text-sm font-medium">{product.stock || 0}</p>
            </div>
          </div>

          <button
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            disabled={!inStock}
            className="w-full mt-6 bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main Shop Page
// -----------------------------------------------------------------------------

export default function Shop() {
  const { cart, setCart } = useCart()
  const { isInWishlist, toggleWishlist: toggleWishlistItem } = useWishlist()
  const { apiurl } = useApi()
  // API
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    category: null,
    brand: null,
    price: [0, 0],
    tags: [],
    availability: [],
  });

  // UI
  const [sort, setSort] = useState("default");

  const [page, setPage] = useState(1);

  const [toast, setToast] = useState("");

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toastTimer = useRef(null);

  // ---------------------------------------------------------------------------
  // Cart count (derived from shared CartContext)
  // ---------------------------------------------------------------------------

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.qty || 0), 0),
    [cart],
  );

  // ---------------------------------------------------------------------------
  // Fetch products
  // ---------------------------------------------------------------------------

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${apiurl}/products`);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
          ? data.products
          : [];

      setProducts(productList);
    } catch (err) {
      console.error("Products API Error:", err);

      setError(
        "Could not load products. Please make sure your backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------------------------------------------------------------------
  // Price bounds
  // ---------------------------------------------------------------------------

  const priceBounds = useMemo(() => {
    if (!products.length) {
      return {
        min: 0,
        max: 1000,
      };
    }

    const prices = products
      .map((product) => Number(product.price))
      .filter((price) => Number.isFinite(price));

    if (!prices.length) {
      return {
        min: 0,
        max: 1000,
      };
    }

    const min = Math.floor(Math.min(...prices));

    const max = Math.ceil(Math.max(...prices));

    return {
      min,
      max: min === max ? min + 1 : max,
    };
  }, [products]);

  useEffect(() => {
    if (products.length) {
      setFilters((prev) => ({
        ...prev,
        price: [priceBounds.min, priceBounds.max],
      }));
    }
  }, [products.length, priceBounds.min, priceBounds.max]);

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------

  const categories = useMemo(
    () =>
      [
        ...new Set(products.map((product) => product.category).filter(Boolean)),
      ].sort(),
    [products],
  );

  // ---------------------------------------------------------------------------
  // Brands
  // ---------------------------------------------------------------------------

  const brands = useMemo(
    () =>
      [
        ...new Set(products.map((product) => product.brand).filter(Boolean)),
      ].sort(),
    [products],
  );

  // ---------------------------------------------------------------------------
  // Tags
  // ---------------------------------------------------------------------------

  const tags = useMemo(() => {
    const allTags = products.flatMap((product) => normalizeTags(product.tags));

    return [...new Set(allTags)].sort();
  }, [products]);

  // ---------------------------------------------------------------------------
  // Filter
  // ---------------------------------------------------------------------------

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Status
      if (product.status && product.status !== "active") {
        return false;
      }

      // Category
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Brand
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Price
      const price = Number(product.price || 0);

      if (price < filters.price[0] || price > filters.price[1]) {
        return false;
      }

      // Tags
      if (filters.tags.length) {
        const productTags = normalizeTags(product.tags);

        const matches = filters.tags.some((tag) => productTags.includes(tag));

        if (!matches) {
          return false;
        }
      }

      // Availability
      if (filters.availability.length) {
        const inStock = isProductInStock(product);

        const wantsInStock = filters.availability.includes("In Stock");

        const wantsOutOfStock = filters.availability.includes("Out of Stock");

        if (wantsInStock && !wantsOutOfStock && !inStock) {
          return false;
        }

        if (wantsOutOfStock && !wantsInStock && inStock) {
          return false;
        }
      }

      return true;
    });
  }, [products, filters]);

  // ---------------------------------------------------------------------------
  // Sort
  // ---------------------------------------------------------------------------

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    if (sort === "price-asc") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sort === "price-desc") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sort === "name-asc") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || "")),
      );
    }

    return result;
  }, [filteredProducts, sort]);

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));

  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  // ---------------------------------------------------------------------------
  // Toast
  // ---------------------------------------------------------------------------

  const showToast = (message) => {
    setToast(message);

    clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 2000);
  };

  // ---------------------------------------------------------------------------
  // Wishlist
  // ---------------------------------------------------------------------------

  const toggleWishlist = (product) => {
    const exists = isInWishlist(product.id);

    toggleWishlistItem(product);

    showToast(exists ? "Removed from wishlist" : "Added to wishlist");
  };

  // ---------------------------------------------------------------------------
  // Cart
  // ---------------------------------------------------------------------------

  const addToCart = (product) => {
    if (!isProductInStock(product)) {
      showToast("Product is out of stock");

      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          sku: product.sku,
          brand: product.brand,
          category: product.category,
          stock: product.stock,
          allowBackorder: product.allowBackorder,
          qty: 1,
        },
      ];
    });

    showToast(`${product.name} added to cart`);
  };

  // ---------------------------------------------------------------------------
  // Active filters
  // ---------------------------------------------------------------------------

  const priceChanged =
    filters.price[0] !== priceBounds.min ||
    filters.price[1] !== priceBounds.max;

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    (filters.brand ? 1 : 0) +
    (priceChanged ? 1 : 0) +
    filters.tags.length +
    filters.availability.length;

  const hasActiveFilters = activeFilterCount > 0;

  // ---------------------------------------------------------------------------
  // Clear filters
  // ---------------------------------------------------------------------------

  const clearFilters = () => {
    setFilters({
      category: null,
      brand: null,
      price: [priceBounds.min, priceBounds.max],
      tags: [],
      availability: [],
    });
  };

  // ---------------------------------------------------------------------------
  // Remove filter
  // ---------------------------------------------------------------------------

  const removeFilter = (type, value) => {
    if (type === "category") {
      setFilters((prev) => ({
        ...prev,
        category: null,
      }));
    }

    if (type === "brand") {
      setFilters((prev) => ({
        ...prev,
        brand: null,
      }));
    }

    if (type === "price") {
      setFilters((prev) => ({
        ...prev,
        price: [priceBounds.min, priceBounds.max],
      }));
    }

    if (type === "tag") {
      setFilters((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== value),
      }));
    }

    if (type === "availability") {
      setFilters((prev) => ({
        ...prev,
        availability: prev.availability.filter((item) => item !== value),
      }));
    }
  };

  // ---------------------------------------------------------------------------
  // Pagination numbers
  // ---------------------------------------------------------------------------

  const start =
    sortedProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const end = Math.min(currentPage * PAGE_SIZE, sortedProducts.length);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="bg-white min-h-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-xl">
          {toast}
        </div>
      )}

      {/* Cart Counter */}
      <div className="fixed top-6 right-6 z-40 bg-white border border-gray-100 shadow-md rounded-full px-4 py-2 flex items-center gap-2">
        <Icon icon="mdi:cart-outline" className="w-5 h-5 text-gray-700" />

        <span className="font-medium text-gray-700">{cartCount}</span>
      </div>

      {/* Page Header */}
      <div className="text-center py-12 bg-[#1f513830]">
        <h1 className="text-3xl font-bold text-[#1f5138]">Shop</h1>

        <p className="text-sm text-gray-500 mt-2">Home / Shop</p>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile Toolbar */}
        <div className="flex lg:hidden gap-3 mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 text-white py-2.5 rounded-lg"
            style={{
              background: FILTER_BG,
            }}
          >
            <Icon icon="mdi:tune-variant" className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-orange-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SortSelect value={sort} onChange={setSort} className="flex-1" />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            resultCount={filteredProducts.length}
            categories={categories}
            brands={brands}
            tags={tags}
            priceBounds={priceBounds}
          />

          {/* Products */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-3 bg-[#23633a] rounded-lg">
              <p className="text-sm text-white">
                {loading
                  ? "Loading products..."
                  : `Showing ${start}-${end} of ${sortedProducts.length} results`}
              </p>

              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm text-white">Sort by:</span>

                <SortSelect value={sort} onChange={setSort} className="w-56" />
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <FilterPill
                    label={filters.category}
                    onRemove={() => removeFilter("category")}
                  />
                )}

                {filters.brand && (
                  <FilterPill
                    label={filters.brand}
                    onRemove={() => removeFilter("brand")}
                  />
                )}

                {priceChanged && (
                  <FilterPill
                    label={`Price: $${filters.price[0]} - $${filters.price[1]}`}
                    onRemove={() => removeFilter("price")}
                  />
                )}

                {filters.tags.map((tag) => (
                  <FilterPill
                    key={tag}
                    label={tag}
                    onRemove={() => removeFilter("tag", tag)}
                  />
                ))}

                {filters.availability.map((item) => (
                  <FilterPill
                    key={item}
                    label={item}
                    onRemove={() => removeFilter("availability", item)}
                  />
                ))}

                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {Array.from({
                  length: PAGE_SIZE,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-80 bg-gray-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="py-20 text-center border border-red-100 rounded-2xl">
                <Icon
                  icon="mdi:alert-circle-outline"
                  className="w-12 h-12 text-red-400 mx-auto"
                />

                <p className="text-red-500 mt-3">{error}</p>

                <button
                  onClick={fetchProducts}
                  className="mt-4 text-green-700 font-medium underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && paginatedProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    wishlisted={isInWishlist(product.id)}
                    onToggleWishlist={toggleWishlist}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && paginatedProducts.length === 0 && (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl">
                <Icon
                  icon="mdi:package-variant-closed"
                  className="w-12 h-12 text-gray-300 mx-auto"
                />

                <p className="text-gray-500 mt-3">No products found.</p>

                <button
                  onClick={clearFilters}
                  className="mt-3 text-green-700 font-medium underline"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => value - 1)}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center disabled:opacity-40"
                >
                  <Icon icon="mdi:chevron-left" className="w-5 h-5" />
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                ).map((number) => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`w-9 h-9 rounded-lg ${currentPage === number
                      ? "bg-orange-500 text-white"
                      : "border text-gray-600"
                      }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((value) => value + 1)}
                  className="w-9 h-9 rounded-lg border flex items-center justify-center disabled:opacity-40"
                >
                  <Icon icon="mdi:chevron-right" className="w-5 h-5" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        resultCount={filteredProducts.length}
        categories={categories}
        brands={brands}
        tags={tags}
        priceBounds={priceBounds}
      />

      {/* Quick View */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />

      {/* Features */}
      <div className="border-t border-gray-100 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center">
              <Icon
                icon="mdi:truck-fast-outline"
                className="w-6 h-6 text-orange-500"
              />
            </div>

            <div>
              <p className="font-semibold">Free Shipping</p>

              <p className="text-sm text-gray-500">
                Free shipping for orders above $150
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center">
              <Icon
                icon="mdi:credit-card-outline"
                className="w-6 h-6 text-orange-500"
              />
            </div>

            <div>
              <p className="font-semibold">Flexible Payment</p>

              <p className="text-sm text-gray-500">
                Multiple secure payment options
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center">
              <Icon icon="mdi:headset" className="w-6 h-6 text-orange-500" />
            </div>

            <div>
              <p className="font-semibold">24×7 Support</p>

              <p className="text-sm text-gray-500">
                We support online all days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}