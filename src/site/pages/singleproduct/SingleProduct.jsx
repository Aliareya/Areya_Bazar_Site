import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import { useCart } from "../../../context/CartContext";

const API_URL = "http://localhost:3000";

function formatPrice(price) {
  if (price === null || price === undefined) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AFN",
  }).format(Number(price));
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function StarRating({ rating = 0, size = 14 }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <span className="inline-flex items-center gap-0.5 text-[#e0a638]">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) {
          return (
            <Icon
              key={i}
              icon="mdi:star"
              width={size}
              height={size}
            />
          );
        }

        if (i === full && hasHalf) {
          return (
            <Icon
              key={i}
              icon="mdi:star-half-full"
              width={size}
              height={size}
            />
          );
        }

        return (
          <Icon
            key={i}
            icon="mdi:star-outline"
            width={size}
            height={size}
          />
        );
      })}
    </span>
  );
}

export default function SingleProduct() {
  const { cart, setCart } = useCart();
  const { apiurl } = useApi();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${apiurl}/products/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();

        setProduct(data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7]">
        <div className="text-center">
          <Icon
            icon="mdi:loading"
            width={45}
            height={45}
            className="mx-auto animate-spin text-[#3f5d45]"
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7] px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <Icon
            icon="mdi:alert-circle-outline"
            width={50}
            height={50}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-xl font-semibold text-[#1f2d24]">
            Product Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "This product could not be found."}
          </p>
        </div>
      </div>
    );
  }

  const {
    name,
    category,
    brand,
    sku,
    barcode,
    tags = [],
    shortDescription,
    description,
    price,
    compareAtPrice,
    costPrice,
    trackInventory,
    stock,
    lowStockThreshold,
    allowBackorder,
    status,
    featured,
    image,
    createdAt,
    updatedAt,
    user,
  } = product;

  const discount =
    compareAtPrice && Number(compareAtPrice) > Number(price)
      ? Math.round(
          ((Number(compareAtPrice) - Number(price)) /
            Number(compareAtPrice)) *
            100
        )
      : 0;

  const isInStock =
    status === "active" &&
    (!trackInventory || stock > 0);

  const canIncreaseQuantity =
    !trackInventory ||
    allowBackorder ||
    qty < Number(stock || 0);

  // ===================== Add To Cart =====================
  const handleAddToCart = () => {
    if (!isInStock) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name,
          image,
          price,
          compareAtPrice,
          sku,
          brand,
          category,
          stock,
          trackInventory,
          qty,
        },
      ];
    });

    setAddedMessage(`${name} added to cart!`);
    setTimeout(() => setAddedMessage(""), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] font-sans text-[#2c2c2c]">

      <div className="relative overflow-hidden bg-[#f6f4ef] py-10 text-center">
        <h1 className="text-3xl font-semibold tracking-wide text-[#1f2d24]">
          Shop
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          <span>Home</span>
          <span className="mx-1">/</span>
          <span>Shop</span>
          <span className="mx-1">/</span>
          <span>{name}</span>
        </p>
      </div>

      {/* ===================== Main Product Section ===================== */}
      <div className="mx-auto max-w-6xl px-4 py-10">

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

          {/* ===================== Product Image ===================== */}
          <div>
            <div className="relative overflow-hidden rounded-xl bg-[#f1efe9]">

              {discount > 0 && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-[#3f5d45] px-4 py-2 text-sm font-medium text-white">
                  {discount}% OFF
                </span>
              )}

              {featured && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-[#e0a638] px-4 py-2 text-sm font-medium text-white">
                  Featured
                </span>
              )}

              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="h-[500px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[500px] items-center justify-center">
                  <Icon
                    icon="mdi:image-off-outline"
                    width={70}
                    height={70}
                    className="text-gray-300"
                  />
                </div>
              )}
            </div>

            {/* ===================== Seller ===================== */}
            {user && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Seller
                </p>

                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6f4ef]">
                      <Icon
                        icon="mdi:account"
                        width={24}
                        height={24}
                        className="text-gray-400"
                      />
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-[#1f2d24]">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>

                    <p className="mt-1 text-xs capitalize text-gray-400">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================== Product Details ===================== */}
          <div>

            {/* Category */}
            <p className="text-sm text-gray-500">
              {category || "Uncategorized"}
            </p>

            {/* Product Name + Status */}
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-[#1f2d24]">
                {name}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isInStock
                    ? "bg-[#e7f3ea] text-[#3f5d45]"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isInStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Brand */}
            {brand && (
              <p className="mt-2 text-sm text-gray-500">
                Brand:{" "}
                <span className="font-medium text-gray-700">
                  {brand}
                </span>
              </p>
            )}

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={0} />

              <span className="text-sm text-gray-400">
                No reviews yet
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold text-[#1f2d24]">
                {formatPrice(price)}
              </span>

              {compareAtPrice &&
                Number(compareAtPrice) > Number(price) && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(compareAtPrice)}
                  </span>
                )}
            </div>

            {/* Short Description */}
            {shortDescription && (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
                {shortDescription}
              </p>
            )}

            {/* ===================== Quantity ===================== */}
            {isInStock && (
              <div className="mt-6">

                <p className="mb-2 text-sm font-medium text-gray-700">
                  Quantity
                </p>

                <div className="flex items-center gap-3">

                  <div className="flex items-center rounded-md border border-gray-300 bg-white">

                    <button
                      onClick={() =>
                        setQty(Math.max(1, qty - 1))
                      }
                      disabled={qty <= 1}
                      className="px-3 py-2 text-gray-500 hover:text-[#1f2d24] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon
                        icon="mdi:minus"
                        width={16}
                        height={16}
                      />
                    </button>

                    <span className="w-10 text-center text-sm">
                      {qty}
                    </span>

                    <button
                      onClick={() =>
                        canIncreaseQuantity &&
                        setQty(qty + 1)
                      }
                      disabled={!canIncreaseQuantity}
                      className="px-3 py-2 text-gray-500 hover:text-[#1f2d24] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Icon
                        icon="mdi:plus"
                        width={16}
                        height={16}
                      />
                    </button>

                  </div>

                  {trackInventory && (
                    <span className="text-sm text-gray-500">
                      {stock} available
                    </span>
                  )}

                </div>
              </div>
            )}

            {/* ===================== Actions ===================== */}
            <div className="mt-6 flex flex-wrap items-center gap-3">

              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className="flex items-center gap-2 rounded-md bg-[#3f5d45] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#334c39] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Icon
                  icon="mdi:cart-outline"
                  width={18}
                  height={18}
                />

                Add To Cart
              </button>

              <button
                disabled={!isInStock}
                className="rounded-md bg-[#e0a638] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#cf9630] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Buy Now
              </button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`rounded-md border border-gray-300 p-2.5 transition ${
                  isFavorite
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500"
                }`}
                aria-label="Add to wishlist"
              >
                <Icon
                  icon={
                    isFavorite
                      ? "mdi:heart"
                      : "mdi:heart-outline"
                  }
                  width={20}
                  height={20}
                />
              </button>

            </div>

            {/* Added to cart feedback message */}
            {addedMessage && (
              <p className="mt-3 text-sm font-medium text-[#3f5d45]">
                {addedMessage}
              </p>
            )}

            {/* ===================== Product Meta ===================== */}
            <div className="mt-7 space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-500">

              {sku && (
                <p>
                  <span className="font-medium text-gray-700">
                    SKU:
                  </span>{" "}
                  {sku}
                </p>
              )}

              {barcode && (
                <p>
                  <span className="font-medium text-gray-700">
                    Barcode:
                  </span>{" "}
                  {barcode}
                </p>
              )}

              {brand && (
                <p>
                  <span className="font-medium text-gray-700">
                    Brand:
                  </span>{" "}
                  {brand}
                </p>
              )}

              <p>
                <span className="font-medium text-gray-700">
                  Category:
                </span>{" "}
                {category || "N/A"}
              </p>

              <p>
                <span className="font-medium text-gray-700">
                  Status:
                </span>{" "}
                <span className="capitalize">
                  {status}
                </span>
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-gray-700">
                    Tags:
                  </span>

                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-[#f1efe9] px-3 py-1 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            </div>

          </div>
        </div>

        {/* ===================== Tabs ===================== */}
        <div className="mt-16">

          <div className="flex justify-center gap-10 border-b border-gray-200">

            {[
              {
                key: "description",
                label: "Description",
              },
              {
                key: "additional",
                label: "Additional Information",
              },
              {
                key: "review",
                label: "Review",
              },
            ].map((tab) => (

              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative pb-4 text-sm font-medium ${
                  activeTab === tab.key
                    ? "text-[#1f2d24]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}

                {activeTab === tab.key && (
                  <span className="absolute -bottom-[1px] left-0 h-[2px] w-full bg-[#3f5d45]" />
                )}
              </button>

            ))}

          </div>

          {/* Description */}
          {activeTab === "description" && (
            <div className="mx-auto mt-8 max-w-4xl text-sm leading-relaxed text-gray-500">

              <h3 className="mb-3 text-lg font-semibold text-[#1f2d24]">
                Product Description
              </h3>

              <p>
                {description ||
                  "No description available for this product."}
              </p>

              {shortDescription && (
                <p className="mt-4">
                  {shortDescription}
                </p>
              )}

            </div>
          )}

          {/* Additional Information */}
          {activeTab === "additional" && (
            <div className="mx-auto mt-8 max-w-4xl">

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                <div className="grid grid-cols-1 border-b border-gray-200 sm:grid-cols-2">

                  <div className="p-4">
                    <p className="text-xs text-gray-400">
                      Product ID
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-gray-700">
                      {product.id}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 p-4 sm:border-l sm:border-t-0">
                    <p className="text-xs text-gray-400">
                      SKU
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {sku || "N/A"}
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 border-b border-gray-200 sm:grid-cols-2">

                  <div className="p-4">
                    <p className="text-xs text-gray-400">
                      Stock
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {trackInventory
                        ? stock
                        : "Inventory not tracked"}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 p-4 sm:border-l sm:border-t-0">
                    <p className="text-xs text-gray-400">
                      Low Stock Threshold
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {lowStockThreshold}
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 border-b border-gray-200 sm:grid-cols-2">

                  <div className="p-4">
                    <p className="text-xs text-gray-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(createdAt)}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 p-4 sm:border-l sm:border-t-0">
                    <p className="text-xs text-gray-400">
                      Last Updated
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {formatDate(updatedAt)}
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2">

                  <div className="p-4">
                    <p className="text-xs text-gray-400">
                      Backorders
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-gray-700">
                      {allowBackorder ? "Allowed" : "Not Allowed"}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 p-4 sm:border-l sm:border-t-0">
                    <p className="text-xs text-gray-400">
                      Featured
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {featured ? "Yes" : "No"}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Reviews */}
          {activeTab === "review" && (
            <div className="mx-auto mt-8 max-w-4xl text-center">

              <Icon
                icon="mdi:comment-text-outline"
                width={50}
                height={50}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 text-lg font-semibold text-[#1f2d24]">
                No Reviews Yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                There are no customer reviews for this product yet.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* ===================== Footer Features ===================== */}
      <div className="border-t border-gray-200 bg-white">

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3">

          {[
            {
              icon: "mdi:truck-fast-outline",
              title: "Fast Shipping",
              desc: "Fast and reliable delivery",
            },
            {
              icon: "mdi:credit-card-outline",
              title: "Flexible Payment",
              desc: "Multiple secure payment options",
            },
            {
              icon: "mdi:headset",
              title: "24×7 Support",
              desc: "We support online all days.",
            },
          ].map((feature, i) => (

            <div
              key={i}
              className="flex items-center gap-4"
            >

              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#f6f4ef] text-[#3f5d45]">
                <Icon
                  icon={feature.icon}
                  width={24}
                  height={24}
                />
              </div>

              <div>
                <p className="font-medium text-[#1f2d24]">
                  {feature.title}
                </p>

                <p className="text-sm text-gray-500">
                  {feature.desc}
                </p>
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}