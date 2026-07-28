import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { useCheckout } from "../../../context/CheckoutContext";

function formatPrice(price) {
  if (price === null || price === undefined) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AFN",
  }).format(Number(price));
}

export default function Cart() {
  const { checkout, setCheckout } = useCheckout();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  const isEmpty = !cart || cart.length === 0;

  // Which line items the user wants to pay for right now.
  // Selected by default so "Proceed to Checkout" works with no extra taps.
  const [selectedIds, setSelectedIds] = useState(() => cart.map((item) => item.id));

  // Keep selection in sync when items are added/removed from the cart
  useEffect(() => {
    setSelectedIds((prev) => {
      const cartIds = cart.map((item) => item.id);

      const stillValid = prev.filter((id) => cartIds.includes(id));

      const newIds = cartIds.filter((id) => !prev.includes(id));

      return [...stillValid, ...newIds];
    });
  }, [cart]);

  const selectedItems = useMemo(
    () => cart.filter((item) => selectedIds.includes(item.id)),
    [cart, selectedIds],
  );

  const allSelected = cart.length > 0 && selectedIds.length === cart.length;
  const noneSelected = selectedIds.length === 0;

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0,
  );

  const totalItems = selectedItems.reduce((sum, item) => sum + item.qty, 0);

  const toggleSelected = (itemId) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : cart.map((item) => item.id));
  };

  const handleIncrease = (item) => {
    setCart((prev) =>
      prev.map((p) => {
        if (p.id !== item.id) return p;

        const canIncrease =
          !p.trackInventory || p.qty < Number(p.stock || 0);

        return canIncrease ? { ...p, qty: p.qty + 1 } : p;
      })
    );
  };

  const handleDecrease = (item) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === item.id
          ? { ...p, qty: Math.max(1, p.qty - 1) }
          : p
      )
    );
  };

  const handleRemove = (item) => {
    setCart((prev) => prev.filter((p) => p.id !== item.id));

    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
  };

  const handleClearCart = () => {
    setCart([]);

    setSelectedIds([]);
  };

  const handleProceedToCheckout = () => {
    if (noneSelected) return;

    setCheckout(selectedItems);

    navigate("/checkout");
  };

  // ===================== Empty State =====================
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] font-sans text-[#2c2c2c]">
        <div className="relative overflow-hidden bg-[#f6f4ef] py-10 text-center">
          <h1 className="text-3xl font-semibold tracking-wide text-[#1f2d24]">
            Your Cart
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-1">/</span>
            <span>Cart</span>
          </p>
        </div>

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f1efe9]">
            <Icon
              icon="mdi:cart-outline"
              width={40}
              height={40}
              className="text-gray-400"
            />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-[#1f2d24]">
            Your cart is empty
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Items you add to your cart will show up here. Start
            browsing to find something you'll love.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-8 flex items-center gap-2 rounded-md bg-[#3f5d45] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#334c39]"
          >
            <Icon icon="mdi:arrow-left" width={18} height={18} />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ===================== Cart With Items =====================
  return (
    <div className="min-h-screen bg-[#fbfaf7] font-sans text-[#2c2c2c]">
      <div className="relative overflow-hidden bg-[#f6f4ef] py-10 text-center">
        <h1 className="text-3xl font-semibold tracking-wide text-[#1f2d24]">
          Your Cart
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          <span>Home</span>
          <span className="mx-1">/</span>
          <span>Cart</span>
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ===================== Cart Items ===================== */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <label className="flex items-center gap-2 text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 accent-[#3f5d45]"
                />
                {totalItems} of{" "}
                {cart.reduce((sum, item) => sum + item.qty, 0)}{" "}
                {cart.reduce((sum, item) => sum + item.qty, 0) === 1
                  ? "item"
                  : "items"}{" "}
                selected
              </label>

              <button
                onClick={handleClearCart}
                className="flex items-center gap-1 text-sm text-gray-400 transition hover:text-red-500"
              >
                <Icon
                  icon="mdi:trash-can-outline"
                  width={16}
                  height={16}
                />
                Clear cart
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {cart.map((item) => {
                const canIncrease =
                  !item.trackInventory ||
                  item.qty < Number(item.stock || 0);

                const isSelected = selectedIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col gap-4 py-6 sm:flex-row sm:items-center ${
                      isSelected ? "" : "opacity-60"
                    }`}
                  >
                    {/* Select */}
                    <div className="flex items-center justify-center sm:pr-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelected(item.id)}
                        aria-label={`Select ${item.name} for checkout`}
                        className="h-4 w-4 rounded border-gray-300 accent-[#3f5d45]"
                      />
                    </div>

                    {/* Image */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#f1efe9]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Icon
                            icon="mdi:image-off-outline"
                            width={30}
                            height={30}
                            className="text-gray-300"
                          />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">
                        {item.category || "Uncategorized"}
                      </p>

                      <h3 className="text-base font-medium text-[#1f2d24]">
                        {item.name}
                      </h3>

                      {item.brand && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          Brand:{" "}
                          <span className="text-gray-700">
                            {item.brand}
                          </span>
                        </p>
                      )}

                      {item.sku && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          SKU: {item.sku}
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1f2d24]">
                          {formatPrice(item.price)}
                        </span>

                        {item.compareAtPrice &&
                          Number(item.compareAtPrice) >
                            Number(item.price) && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(item.compareAtPrice)}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center rounded-md border border-gray-300 bg-white">
                      <button
                        onClick={() => handleDecrease(item)}
                        disabled={item.qty <= 1}
                        className="px-3 py-2 text-gray-500 hover:text-[#1f2d24] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Icon icon="mdi:minus" width={16} height={16} />
                      </button>

                      <span className="w-10 text-center text-sm">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => handleIncrease(item)}
                        disabled={!canIncrease}
                        className="px-3 py-2 text-gray-500 hover:text-[#1f2d24] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Icon icon="mdi:plus" width={16} height={16} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="w-24 text-right text-sm font-semibold text-[#1f2d24]">
                      {formatPrice(Number(item.price) * item.qty)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item)}
                      aria-label="Remove item"
                      className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Icon
                        icon="mdi:close"
                        width={18}
                        height={18}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-[#3f5d45] hover:text-[#334c39]"
            >
              <Icon icon="mdi:arrow-left" width={16} height={16} />
              Continue Shopping
            </button>
          </div>

          {/* ===================== Order Summary ===================== */}
          <div>
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-[#1f2d24]">
                Order Summary
              </h3>

              {noneSelected && (
                <p className="mt-3 text-xs text-amber-600">
                  Select at least one item to check out.
                </p>
              )}

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <span>
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                  <span className="text-gray-700">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-gray-700">Calculated at checkout</span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-semibold text-[#1f2d24]">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                disabled={noneSelected}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#3f5d45] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#334c39] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Proceed to Checkout
                <Icon icon="mdi:arrow-right" width={18} height={18} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <Icon icon="mdi:lock-outline" width={14} height={14} />
                Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}