import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

const HEADER_BG = "#1f513830";
const HEADER_TEXT = "#1f5138";
const PANEL_BG = "#23633a";

function isProductInStock(product) {
  const stock = Number(product.stock || 0);

  return stock > 0 || product.allowBackorder === true;
}

function WishlistCard({ product, onRemove, onAddToCart }) {
  const navigate = useNavigate();
  const inStock = isProductInStock(product);

  const hasDiscount =
    Number(product.compareAtPrice) > Number(product.price || 0);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-3 group">
      <div className="relative rounded-xl overflow-hidden bg-gray-100">
        {!inStock && (
          <span className="absolute bottom-3 left-3 z-10 bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Out of stock
          </span>
        )}

        <button
          onClick={() => onRemove(product)}
          aria-label="Remove from wishlist"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white"
        >
          <Icon icon="mdi:heart" className="w-4 h-4 text-red-500" />
        </button>

        <img
          onClick={() => navigate(`/shop/${product.id}`)}
          src={
            product.image || "https://via.placeholder.com/500x500?text=No+Image"
          }
          alt={product.name}
          className="w-full h-44 object-cover cursor-pointer"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/500x500?text=No+Image";
          }}
        />
      </div>

      <div className="pt-3 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {product.category || "Uncategorized"}
        </span>

        {product.brand && (
          <span className="text-gray-400">{product.brand}</span>
        )}
      </div>

      <h3
        onClick={() => navigate(`/shop/${product.id}`)}
        className="font-semibold text-gray-900 mt-1 line-clamp-1 cursor-pointer"
      >
        {product.name}
      </h3>

      <div className="flex items-center gap-2 mt-2">
        <span className="font-semibold text-gray-900">
          {Number(product.price || 0).toFixed(2)} AFN
        </span>

        {hasDiscount && (
          <span className="text-gray-400 text-sm line-through">
            ${Number(product.compareAtPrice).toFixed(2)}
          </span>
        )}
      </div>

      <button
        onClick={() => onAddToCart(product)}
        disabled={!inStock}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-green-700 text-white py-2.5 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-800 transition"
      >
        <Icon icon="mdi:cart-outline" className="w-4 h-4" />
        {inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}

export default function Wishlist() {
  const navigate = useNavigate();
  const { setCart } = useCart();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToast(message);

    clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 2000);
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id);

    showToast(`${product.name} removed from wishlist`);
  };

  const handleAddToCart = (product) => {
    if (!isProductInStock(product)) {
      showToast("Product is out of stock");

      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
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

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-xl">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="text-center py-12" style={{ background: HEADER_BG }}>
        <h1 className="text-3xl font-bold" style={{ color: HEADER_TEXT }}>
          Wishlist
        </h1>

        <p className="text-sm text-gray-500 mt-2">Home / Wishlist</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Toolbar */}
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-3 rounded-lg"
          style={{ background: PANEL_BG }}
        >
          <p className="text-sm text-white">
            {wishlist.length === 0
              ? "Your wishlist is empty"
              : `${wishlist.length} item${wishlist.length === 1 ? "" : "s"} saved`}
          </p>

          {wishlist.length > 0 && (
            <button
              onClick={() => {
                clearWishlist();
                showToast("Wishlist cleared");
              }}
              className="text-sm text-white/80 hover:text-white underline w-fit"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 && (
          <div className="py-20 text-center border border-dashed border-gray-200 rounded-2xl">
            <Icon
              icon="mdi:heart-outline"
              className="w-12 h-12 text-gray-300 mx-auto"
            />

            <p className="text-gray-500 mt-3">
              You haven&apos;t saved anything yet.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="mt-3 text-green-700 font-medium underline"
            >
              Browse the shop
            </button>
          </div>
        )}

        {/* Wishlist Grid */}
        {wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {wishlist.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                onRemove={handleRemove}
                onAddToCart={handleMoveToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}