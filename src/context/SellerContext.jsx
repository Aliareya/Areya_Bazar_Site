import { createContext, useContext, useState } from "react";

const SellerContext = createContext(null);

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSellerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("You are not logged in");
      }

      const response = await fetch(
        "https://areyabazaarapi.vercel.app/api/sellers/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data?.message)
            ? data.message.join(", ")
            : data?.message || "Failed to get seller data"
        );
      }

      setSeller(data.seller);

      return data.seller;
    } catch (error) {
      console.error("Get seller data error:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerContext.Provider
      value={{
        seller,
        setSeller,
        getSellerData,
        loading,
        error,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);

  if (!context) {
    throw new Error("useSeller must be used inside SellerProvider");
  }

  return context;
};