"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartDrawer() {
  const { items, itemCount, total, removeItem, closeCart, isOpen } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-paper shadow-2xl transition-transform duration-400 ease-in-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-title text-base text-ink">
            Bag {itemCount > 0 && <span className="ml-1 text-graphite">({itemCount})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="text-graphite transition-colors hover:text-ink"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-line">
                <path d="M8 10h24l-3 18H11L8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M15 10V8a5 5 0 0110 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-sm text-graphite">Your bag is empty.</p>
              <button onClick={closeCart} className="label mt-2 underline underline-offset-4 text-graphite hover:text-ink transition-colors">
                Continue browsing
              </button>
            </div>
          ) : (
            <ul className="grid gap-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-line pb-5">
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-mist">
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="64px" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm text-ink leading-snug">{item.title}</p>
                    <p className="label text-graphite">£{item.priceGbp} × {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-graphite hover:text-ink transition-colors"
                    aria-label="Remove item"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-line px-6 py-6 grid gap-4">
            <div className="flex items-center justify-between">
              <span className="label text-graphite">Total</span>
              <span className="font-title text-base text-ink">£{total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-ink py-4 text-center font-title text-xs font-bold uppercase tracking-[0.14em] text-chalk transition-colors hover:bg-graphite"
            >
              Checkout
            </Link>
            <button
              onClick={closeCart}
              className="label w-full text-center text-graphite underline underline-offset-4 hover:text-ink transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
