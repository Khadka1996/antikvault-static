'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'antikvault-cart';

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  // Start empty so the pre-rendered static HTML is stable (no hydration
  // mismatch) — localStorage only exists on the client, so the real cart is
  // loaded in an effect after mount, same pattern as the URL-deep-link state
  // used elsewhere in this app.
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading persisted state from localStorage, only available on the client
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // don't clobber storage with the empty initial state before it's loaded
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable (private mode, quota, etc) — cart just won't persist
    }
  }, [items, hydrated]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          image: item.image,
          category: item.category,
          qty: 1,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback((id) => items.some((i) => i.id === id), [items]);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clear, isInCart, count }),
    [items, addItem, removeItem, updateQty, clear, isInCart, count],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
