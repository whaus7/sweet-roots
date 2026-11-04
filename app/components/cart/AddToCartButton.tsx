"use client";

import { useState } from "react";
import { useCart } from "@/app/contexts/CartContext";

type AddToCartButtonProps = {
  productId: string;
  variant?: "catalog" | "solid";
};

export function AddToCartButton({
  productId,
  variant = "catalog",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const className =
    variant === "catalog"
      ? "inline-block border border-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-black"
      : "inline-block bg-[#00340c] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#004d12]";

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (!addItem(productId)) return;
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1400);
      }}
    >
      {justAdded ? "Added" : "Add to cart"}
    </button>
  );
}
