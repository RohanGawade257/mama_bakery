import { createContext, useCallback, useContext, useMemo, useState } from "react";
import api from "../api/client.js";

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/products", { params });
      const list = data.data || [];
      setProducts(list);
      return { ok: true, data: list, meta: data.meta || {} };
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Failed to load products.";
      setError(message);
      return { ok: false, message, data: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get("/products/categories/list");
      const list = ["All", ...(data.data || [])];
      setCategories(list);
      return { ok: true, data: list };
    } catch (_error) {
      const fallback = ["All"];
      setCategories(fallback);
      return { ok: false, data: fallback };
    }
  }, []);

  const fetchFeaturedProducts = useCallback(async (limit = 4) => {
    try {
      const { data } = await api.get("/products", {
        params: { featured: true, limit }
      });
      const list = data.data || [];
      setFeaturedProducts(list);
      return { ok: true, data: list };
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Failed to load featured products.";
      setError(message);
      setFeaturedProducts([]);
      return { ok: false, message, data: [] };
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/products/${id}`);
      setActiveProduct(data.data || null);
      return { ok: true, data: data.data || null };
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Failed to load product.";
      setError(message);
      setActiveProduct(null);
      return { ok: false, message, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearActiveProduct = useCallback(() => {
    setActiveProduct(null);
  }, []);

  const value = useMemo(
    () => ({
      products,
      featuredProducts,
      categories,
      activeProduct,
      loading,
      error,
      fetchProducts,
      fetchFeaturedProducts,
      fetchCategories,
      fetchProductById,
      clearActiveProduct
    }),
    [
      activeProduct,
      categories,
      clearActiveProduct,
      error,
      featuredProducts,
      fetchCategories,
      fetchFeaturedProducts,
      fetchProductById,
      fetchProducts,
      loading,
      products
    ]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return ctx;
};

