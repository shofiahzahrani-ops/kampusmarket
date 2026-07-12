import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]); // array of product objects

  const isInWishlist = useCallback(
    (productId) => items.some((p) => p.id === productId),
    [items]
  );

  const toggleWishlist = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const value = useMemo(
    () => ({ items, isInWishlist, toggleWishlist, removeFromWishlist }),
    [items, isInWishlist, toggleWishlist, removeFromWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
