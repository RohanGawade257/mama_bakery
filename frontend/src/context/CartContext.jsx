import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

const getInitialCart = () => {
  const raw = localStorage.getItem("mama_cart");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(getInitialCart);

  const sync = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem("mama_cart", JSON.stringify(nextItems));
  };

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(Number(quantity) || 1, 1);
    const existing = items.find((item) => item._id === product._id);
    const maxStock = Number(product.stock) || 0;

    if (maxStock <= 0) {
      return;
    }

    if (existing) {
      const updated = items.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: Math.min(item.quantity + qty, maxStock)
            }
          : item
      );
      sync(updated);
      return;
    }

    sync([...items, { ...product, quantity: Math.min(qty, maxStock) }]);
  };

  const removeFromCart = (productId) => {
    sync(items.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Math.max(Number(quantity) || 1, 1);
    sync(
      items.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.min(qty, Math.max(Number(item.stock) || qty, 1)) }
          : item
      )
    );
  };

  const clearCart = () => sync([]);

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      totalItems,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};
