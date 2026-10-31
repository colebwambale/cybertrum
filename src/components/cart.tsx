"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { productId: string; slug: string; name: string; sku: string; price: number; currency: "UGX" | "USD"; qty: number };
type Ctx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (l: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "sentinel-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Storage throws when the browser blocks site data; the cart then just lives in memory.
  useEffect(() => {
    try { setLines(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* blocked or corrupt data */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return; // don't overwrite the saved cart with the empty initial state
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* blocked */ }
  }, [lines, loaded]);

  const value = useMemo<Ctx>(() => ({
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((s, l) => s + l.price * l.qty, 0),
    add: (l, qty = 1) => setLines((cur) => {
      const hit = cur.find((x) => x.productId === l.productId);
      return hit ? cur.map((x) => (x === hit ? { ...x, qty: x.qty + qty } : x)) : [...cur, { ...l, qty }];
    }),
    setQty: (id, qty) => setLines((cur) => cur.map((x) => (x.productId === id ? { ...x, qty: Math.max(1, qty) } : x))),
    remove: (id) => setLines((cur) => cur.filter((x) => x.productId !== id)),
    clear: () => setLines([]),
  }), [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
