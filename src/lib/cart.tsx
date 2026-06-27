"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  priceGbp: number;
  imageUrl: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ap_cart");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("ap_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.priceGbp * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, itemCount, total,
      addItem, removeItem, clearCart,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
