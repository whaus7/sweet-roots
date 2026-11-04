"use client";

import Link from "next/link";
import { useCart } from "@/app/contexts/CartContext";

export function CancelView() {
  const { openCart } = useCart();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00340c]/60">
        Store
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[#00340c]">
        Checkout canceled
      </h1>
      <p className="mt-4 text-gray-700">
        No charge was made. Your cart is still saved on this device.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={openCart}
          className="bg-[#00340c] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#004d12]"
        >
          Review cart
        </button>
        <Link
          href="/"
          className="border border-[#00340c] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00340c] transition hover:bg-[#00340c] hover:text-white"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
