"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  PRODUCTS,
  cartCount,
  cartSubtotalCents,
  getProduct,
  parseCartItems,
  type CartLine,
  type Product,
  type ProductId,
} from "@/app/lib/store/catalog";

const STORAGE_KEY = "jordhaus-cart-v1";

export type CartEntry = CartLine & { product: Product };

type CartContextValue = {
  items: CartLine[];
  lines: CartEntry[];
  count: number;
  subtotalCents: number;
  hydrated: boolean;
  isOpen: boolean;
  checkoutReady: boolean;
  addItem: (productId: string, quantity?: number) => boolean;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { v?: number; items?: unknown };
    if (parsed.v !== 1) return [];
    return parseCartItems(parsed.items);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: 1, items }),
    );
  }, [hydrated, items]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/checkout")
      .then((res) => res.json())
      .then((data: { ready?: boolean }) => {
        if (!cancelled) setCheckoutReady(Boolean(data?.ready));
      })
      .catch(() => {
        if (!cancelled) setCheckoutReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback((productId: string, quantity = 1) => {
    const product = getProduct(productId);
    if (!product) return false;

    setItems((prev) => {
      const existing = prev.find((line) => line.productId === product.id);
      const nextQty = Math.min(
        product.maxQty,
        (existing?.quantity ?? 0) + Math.max(1, Math.floor(quantity)),
      );
      if (existing) {
        return prev.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: nextQty }
            : line,
        );
      }
      return [
        ...prev,
        { productId: product.id as ProductId, quantity: nextQty },
      ];
    });
    setIsOpen(true);
    return true;
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const product = getProduct(productId);
    if (!product) return;
    const nextQty = Math.min(product.maxQty, Math.max(0, Math.floor(quantity)));
    setItems((prev) => {
      if (nextQty <= 0) {
        return prev.filter((line) => line.productId !== product.id);
      }
      return prev.map((line) =>
        line.productId === product.id ? { ...line, quantity: nextQty } : line,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((line) => line.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const lines = useMemo<CartEntry[]>(
    () =>
      items.map((item) => ({
        ...item,
        product: PRODUCTS[item.productId],
      })),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      lines,
      count: cartCount(items),
      subtotalCents: cartSubtotalCents(items),
      hydrated,
      isOpen,
      checkoutReady,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      lines,
      hydrated,
      isOpen,
      checkoutReady,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
