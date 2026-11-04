"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/contexts/CartContext";
import { formatUsd } from "@/app/lib/store/catalog";

export function CartDrawer() {
  const {
    lines,
    count,
    subtotalCents,
    isOpen,
    closeCart,
    setQuantity,
    removeItem,
    checkoutReady,
  } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setCheckingOut(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function checkout() {
    if (!lines.length || checkingOut) return;
    setCheckingOut(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
          })),
        }),
      });
      const data = (await res.json()) as {
        url?: string;
        error?: string;
        code?: string;
      };
      if (!res.ok || !data.url) {
        setError(
          data.code === "not_configured"
            ? "Checkout isn't taking cards yet. Your cart is saved — use Get in Touch to order in the meantime."
            : data.error || "Unable to start checkout. Try again.",
        );
        setCheckingOut(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Unable to start checkout. Try again.");
      setCheckingOut(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-[#1c1812]/40"
        onClick={closeCart}
      />
      <aside
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="relative flex h-full w-full max-w-md flex-col bg-[#fcfcfc] shadow-2xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#00340c]/10 bg-white px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00340c]/60">
              JördHaus
            </p>
            <h2 id="cart-title" className="mt-1 text-lg font-semibold text-[#00340c]">
              Cart{count ? ` · ${count}` : ""}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="rounded p-1 text-[#00340c]/70 hover:bg-[#00340c]/5 hover:text-[#00340c]"
            aria-label="Close cart"
          >
            <span aria-hidden className="block text-2xl leading-none">
              ×
            </span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="space-y-4 pt-6 text-sm text-gray-600">
              <p>Your cart is empty.</p>
              <ul className="space-y-2 font-semibold text-[#00340c]">
                <li>
                  <Link href="/" onClick={closeCart} className="hover:text-[#d4a017]">
                    Microgreen trays
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store/composting-worms"
                    onClick={closeCart}
                    className="hover:text-[#d4a017]"
                  >
                    Composting worms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store/raised-bed-panels"
                    onClick={closeCart}
                    className="hover:text-[#d4a017]"
                  >
                    Raised bed panels
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={line.productId}
                  className="flex gap-3 border-b border-[#00340c]/10 pb-4"
                >
                  <Link
                    href={line.product.href}
                    onClick={closeCart}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-[#f4efe4]"
                  >
                    <Image
                      src={line.product.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={line.product.href}
                      onClick={closeCart}
                      className="block text-sm font-semibold text-[#00340c] hover:text-[#d4a017]"
                    >
                      {line.product.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {formatUsd(line.product.priceCents)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-[#00340c]/15">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-[#00340c]"
                          aria-label={`Decrease ${line.product.name}`}
                          onClick={() =>
                            setQuantity(line.productId, line.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-2.5 py-1 text-[#00340c]"
                          aria-label={`Increase ${line.product.name}`}
                          disabled={line.quantity >= line.product.maxQty}
                          onClick={() =>
                            setQuantity(line.productId, line.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-xs uppercase tracking-[0.14em] text-gray-500 hover:text-[#00340c]"
                        onClick={() => removeItem(line.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-[#00340c]/10 bg-white px-5 py-4">
          {lines.length > 0 ? (
            <>
              <div className="flex items-baseline justify-between text-[#00340c]">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Subtotal
                </span>
                <span className="text-xl font-semibold">
                  {formatUsd(subtotalCents)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Pickup from the Bellevue farm, or we will follow up about
                delivery after checkout. Cards run through Stripe.
              </p>
              {error ? (
                <p className="mt-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
              {!checkoutReady && !error ? (
                <p className="mt-3 text-sm text-gray-600">
                  Cards will run through Stripe once payment is switched on.
                  Your cart is saved on this device.
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => void checkout()}
                disabled={checkingOut}
                className="mt-4 w-full bg-[#00340c] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#004d12] disabled:opacity-60"
              >
                {checkingOut ? "Starting checkout…" : "Checkout"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={closeCart}
              className="w-full border border-[#00340c] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00340c] transition hover:bg-[#00340c] hover:text-white"
            >
              Keep shopping
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
