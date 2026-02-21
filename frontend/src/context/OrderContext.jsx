import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../api/client.js";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const createOrder = useCallback(async (payload) => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/orders", payload);
      return { ok: true, data: data.data };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Failed to place order."
      };
    } finally {
      setSubmitting(false);
    }
  }, []);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders/my");
      const list = data.data || [];
      setMyOrders(list);
      return { ok: true, data: list };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load your orders.";
      return { ok: false, message, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}`);
      return { ok: true, data: data.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load order.";
      return { ok: false, message, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      myOrders,
      loading,
      submitting,
      createOrder,
      fetchMyOrders,
      fetchOrderById
    }),
    [
      createOrder,
      fetchMyOrders,
      fetchOrderById,
      loading,
      myOrders,
      submitting
    ]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrders must be used inside OrderProvider");
  }
  return ctx;
};
