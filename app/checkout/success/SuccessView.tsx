"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/contexts/CartContext";

type OrderSummary = {
  paid: boolean;
  email?: string | null;
  name?: string | null;
  amount?: string;
  lines?: { name: string; quantity: number; amount: string }[];
};

export function SuccessView({ sessionId }: { sessionId?: string }) {
  const { clearCart } = useCart();
  const [summary, setSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: OrderSummary | null) => {
        if (cancelled || !data) return;
        setSummary(data);
        if (data.paid) clearCart();
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#00340c]/60">
        Store
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[#00340c]">
        {summary?.paid === false ? "Payment still processing" : "Order received"}
      </h1>
      <p className="mt-4 text-gray-700">
        Thank you{summary?.name ? `, ${summary.name}` : ""}. We will follow up
        about Bellevue pickup or delivery
        {summary?.email ? ` at ${summary.email}` : ""}.
      </p>
      {summary?.lines?.length ? (
        <ul className="mt-6 space-y-2 border-t border-[#00340c]/10 pt-4 text-sm text-[#00340c]">
          {summary.lines.map((line) => (
            <li key={`${line.name}-${line.quantity}`} className="flex justify-between gap-4">
              <span>
                {line.quantity} × {line.name}
              </span>
              <span>{line.amount}</span>
            </li>
          ))}
          {summary.amount ? (
            <li className="flex justify-between gap-4 border-t border-[#00340c]/10 pt-2 font-semibold">
              <span>Total</span>
              <span>{summary.amount}</span>
            </li>
          ) : null}
        </ul>
      ) : null}
      <Link
        href="/"
        className="mt-8 inline-block bg-[#00340c] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#004d12]"
      >
        Back to the farm
      </Link>
    </div>
  );
}
