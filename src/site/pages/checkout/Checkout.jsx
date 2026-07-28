import React, { useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import { useCart } from "../../../context/CartContext";
import { useCheckout } from "../../../context/CheckoutContext";

const HEADER_BG = "#1f513830";
const HEADER_TEXT = "#1f5138";
const PANEL_BG = "#23633a";

const SHIPPING_FLAT_RATE = 150;
const FREE_SHIPPING_THRESHOLD = 5000;

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      <div className="mt-1.5">{children}</div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </label>
  );
}

const inputClasses =
  "w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300";

function PaymentOption({ id, title, description, icon, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`w-full flex items-start gap-3 text-left p-4 rounded-xl border-2 transition ${selected
        ? "border-orange-400 bg-orange-50"
        : "border-gray-200 hover:border-gray-300"
        }`}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${selected ? "bg-orange-100" : "bg-gray-100"
          }`}
      >
        <Icon
          icon={icon}
          className={`w-5 h-5 ${selected ? "text-orange-600" : "text-gray-500"}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>

      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selected ? "border-orange-500" : "border-gray-300"
          }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
      </div>
    </button>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { apiurl } = useApi();
  const { cart, setCart } = useCart();
  const { checkout, setCheckout } = useCheckout();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [toast, setToast] = useState("");

  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToast(message);

    clearTimeout(toastTimer.current);

    toastTimer.current = setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  // ---------------------------------------------------------------------------
  // Totals (based on the items selected for checkout, not the whole cart)
  // ---------------------------------------------------------------------------

  const subtotal = useMemo(
    () =>
      checkout.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
        0,
      ),
    [checkout],
  );

  const itemCount = useMemo(
    () => checkout.reduce((sum, item) => sum + Number(item.qty || 0), 0),
    [checkout],
  );

  const shippingFee =
    checkout.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FLAT_RATE;

  const total = subtotal + shippingFee;

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  const validate = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = "First name is required";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required";

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.country.trim()) nextErrors.country = "Country is required";

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // ---------------------------------------------------------------------------
  // Place order
  // ---------------------------------------------------------------------------

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (checkout.length === 0) {
      showToast("No items selected for checkout");
      return;
    }

    if (!validate()) {
      showToast("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);

    const payload = {
      customer: form,
      paymentMethod,
      items: checkout,
      subtotal,
      shippingFee,
      total,
    };

    try {
      const response = await fetch(`${apiurl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      setOrderNumber(data.orderNumber || data.id || `ORD-${Date.now()}`);
      setOrderPlaced(true);

      // Remove only the ordered items from the cart, leave the rest untouched
      const orderedIds = checkout.map((item) => item.id);

      setCart((prev) => prev.filter((item) => !orderedIds.includes(item.id)));

      setCheckout([]);
    } catch (err) {
      console.error("Order submission error:", err);
      showToast("Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Order confirmation view
  // ---------------------------------------------------------------------------

  if (orderPlaced) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-16">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <Icon icon="mdi:check-circle-outline" className="w-9 h-9 text-green-700" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-6">
            Order placed
          </h1>

          <p className="text-gray-500 mt-2">
            Thanks{form.firstName ? `, ${form.firstName}` : ""} — your order
            {orderNumber ? ` #${orderNumber}` : ""} has been received. A
            confirmation was sent to {form.email}.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => navigate("/shop")}
              className="bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-800 transition"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/")}
              className="border border-gray-200 px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Empty checkout view (nothing selected from the cart)
  // ---------------------------------------------------------------------------

  if (checkout.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="text-center py-12" style={{ background: HEADER_BG }}>
          <h1 className="text-3xl font-bold" style={{ color: HEADER_TEXT }}>
            Checkout
          </h1>

          <p className="text-sm text-gray-500 mt-2">Home / Cart / Checkout</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <Icon
            icon="mdi:cart-outline"
            className="w-12 h-12 text-gray-300 mx-auto"
          />

          <p className="text-gray-500 mt-3">
            {cart.length === 0
              ? "Your cart is empty, so there's nothing to check out yet."
              : "No items selected for checkout. Head back to your cart and pick what you'd like to pay for."}
          </p>

          <button
            onClick={() => navigate(cart.length === 0 ? "/shop" : "/cart")}
            className="mt-3 text-green-700 font-medium underline"
          >
            {cart.length === 0 ? "Browse the shop" : "Back to cart"}
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Checkout form
  // ---------------------------------------------------------------------------

  return (
    <div className="bg-white min-h-screen">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-gray-900 text-white text-sm px-5 py-3 rounded-full shadow-xl">
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="text-center py-12" style={{ background: HEADER_BG }}>
        <h1 className="text-3xl font-bold" style={{ color: HEADER_TEXT }}>
          Checkout
        </h1>

        <p className="text-sm text-gray-500 mt-2">Home / Cart / Checkout</p>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10"
      >
        {/* Left: Details */}
        <div className="flex-1 space-y-8">
          {/* Contact */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name" error={errors.firstName}>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={inputClasses}
                  placeholder="Jane"
                />
              </Field>

              <Field label="Last Name" error={errors.lastName}>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={inputClasses}
                  placeholder="Doe"
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={inputClasses}
                  placeholder="jane@example.com"
                />
              </Field>

              <Field label="Phone" error={errors.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={inputClasses}
                  placeholder="+93 70 000 0000"
                />
              </Field>
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <Field label="Street Address" error={errors.address}>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className={inputClasses}
                  placeholder="House number, street name"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="City" error={errors.city}>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={inputClasses}
                    placeholder="Kabul"
                  />
                </Field>

                <Field label="Postal Code" error={errors.postalCode}>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    className={inputClasses}
                    placeholder="1001"
                  />
                </Field>

                <Field label="Country" error={errors.country}>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className={inputClasses}
                    placeholder="Afghanistan"
                  />
                </Field>
              </div>

              <Field label="Order Notes (optional)">
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className={`${inputClasses} min-h-[90px] resize-y`}
                  placeholder="Delivery instructions, landmark, etc."
                />
              </Field>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h2>

            <div className="space-y-3">
              <PaymentOption
                id="cod"
                title="Cash on Delivery"
                description="Pay with cash when your order arrives"
                icon="mdi:cash"
                selected={paymentMethod === "cod"}
                onSelect={setPaymentMethod}
              />

              <PaymentOption
                id="card"
                title="Credit / Debit Card"
                description="Pay securely online with your card"
                icon="mdi:credit-card-outline"
                selected={paymentMethod === "card"}
                onSelect={setPaymentMethod}
              />

              <PaymentOption
                id="bank"
                title="Bank Transfer"
                description="Pay via direct bank transfer"
                icon="mdi:bank-outline"
                selected={paymentMethod === "bank"}
                onSelect={setPaymentMethod}
              />
            </div>
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="w-full lg:w-96 shrink-0">
          <div
            className="sticky top-20 rounded-2xl shadow-sm p-5"
            style={{ background: PANEL_BG }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {checkout.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white/10 shrink-0">
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/100x100?text=No+Image"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/100x100?text=No+Image";
                      }}
                    />

                    <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-white/60">
                      {Number(item.price || 0).toFixed(2)} AFN
                    </p>
                  </div>

                  <p className="text-sm font-medium text-white shrink-0">
                    {(Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/15 space-y-2 text-sm">
              <div className="flex items-center justify-between text-white/80">
                <span>Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})</span>
                <span>{subtotal.toFixed(2)} AFN</span>
              </div>

              <div className="flex items-center justify-between text-white/80">
                <span>Shipping</span>
                <span>
                  {shippingFee === 0 ? "Free" : `${shippingFee.toFixed(2)} AFN`}
                </span>
              </div>

              {shippingFee > 0 && (
                <p className="text-xs text-white/50">
                  Free shipping on orders over {FREE_SHIPPING_THRESHOLD} AFN
                </p>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="font-semibold text-white text-lg">
                {total.toFixed(2)} AFN
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-5 bg-white text-green-800 font-medium py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              {submitting && (
                <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
              )}
              {submitting ? "Placing Order..." : "Place Order"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="w-full mt-2 text-white/70 hover:text-white text-sm underline"
            >
              Continue Shopping
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}