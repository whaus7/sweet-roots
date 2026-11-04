"use client";

import { useCart } from "@/app/contexts/CartContext";

export function CartButton() {
  const { count, hydrated, toggleCart, isOpen } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative rounded-md p-2 text-gray-700 transition-colors duration-200 hover:text-green-600"
      aria-label={count ? `Cart, ${count} items` : "Cart"}
      aria-expanded={isOpen}
      aria-controls="cart-drawer"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M6 7h15l-1.4 8.4a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.5L5 5H3"
        />
        <circle cx="9" cy="20" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="18" cy="20" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      {hydrated && count > 0 ? (
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#00340c] px-1 text-[10px] font-semibold leading-none text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
