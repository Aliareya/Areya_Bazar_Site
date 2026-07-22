import {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [is_login, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication when app starts
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      // No token
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true)
        const response = await fetch(
          "http://localhost:3000/auth/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Token is invalid");
        }

        const userData = await response.json();

        setUser(userData);
        setIsLogin(true);
      } catch (error) {
        console.log("Authentication failed");

        localStorage.removeItem("accessToken");

        setUser(null);
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Called after successful login
  const login = (userData, token) => {
    localStorage.setItem("accessToken", token);

    setUser(userData);
    setIsLogin(true);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("accessToken");

    setUser(null);
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        is_login,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};