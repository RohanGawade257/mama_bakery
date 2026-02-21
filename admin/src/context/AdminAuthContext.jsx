import { createContext, useContext, useMemo, useState } from "react";

const AdminAuthContext = createContext(null);
const STORAGE_KEY = "mama_admin_authenticated";

const getInitialState = () => localStorage.getItem(STORAGE_KEY) === "true";

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialState);

  const login = (username, password) => {
    const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME || "admin";
    const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

    if (username === expectedUsername && password === expectedPassword) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      return { ok: true };
    }

    return { ok: false, message: "Invalid credentials" };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout
    }),
    [isAuthenticated]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return ctx;
};

