import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

const STORAGE_KEY = "areya_wishlist";

function loadWishlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load wishlist from storage:", err);

    return [];
  }
}

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(loadWishlist);

  // Keep localStorage in sync whenever the wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.error("Failed to save wishlist to storage:", err);
    }
  }, [wishlist]);

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.id === productId);

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }

      return [
        ...prev,
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
        },
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }

      return [
        ...prev,
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
        },
      ];
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);