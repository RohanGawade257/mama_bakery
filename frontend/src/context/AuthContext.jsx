import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

const parseUserFromStorage = () => {
  const raw = localStorage.getItem("mama_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("mama_token"));
  const [user, setUser] = useState(parseUserFromStorage);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(Boolean(localStorage.getItem("mama_token")));

  const persistSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("mama_token", nextToken);
    localStorage.setItem("mama_user", JSON.stringify(nextUser));
  };

  const clearSession = () => {
    setToken(null);
    setUser(null);
    setAuthChecking(false);
    localStorage.removeItem("mama_token");
    localStorage.removeItem("mama_user");
  };

  const authenticate = async (url, payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(url, payload);
      persistSession(data.token, data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: error.response?.data?.message || "Authentication failed." };
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload) => authenticate("/auth/login", payload);

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      persistSession(data.token, data.user);
      return { ok: true, user: data.user };
    } catch (error) {
      return { ok: false, message: error.response?.data?.message || "Sign up failed." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setAuthChecking(false);
        return;
      }

      setAuthChecking(true);
      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem("mama_user", JSON.stringify(data.user));
        setUser(data.user);
      } catch (_error) {
        clearSession();
      } finally {
        setAuthChecking(false);
      }
    };

    verifySession();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      authChecking,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout
    }),
    [authChecking, loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
