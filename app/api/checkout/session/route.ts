import { NextResponse } from "next/server";
import { formatUsd } from "@/app/lib/store/catalog";
import { getStripe, stripeConfigured } from "@/app/lib/stripe/client";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not configured yet." },
      { status: 503 },
    );
  }

  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Missing session." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const paid =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required";

    const lines =
      session.line_items?.data.map((item) => ({
        name: item.description || "Item",
        quantity: item.quantity ?? 1,
        amount: formatUsd(item.amount_total ?? 0),
      })) ?? [];

    return NextResponse.json({
      paid,
      status: session.status,
      paymentStatus: session.payment_status,
      email: session.customer_details?.email ?? session.customer_email,
      name: session.customer_details?.name,
      amount: formatUsd(session.amount_total ?? 0),
      lines,
    });
  } catch (error) {
    console.error("[checkout] retrieve failed", error);
    return NextResponse.json(
      { error: "Unable to load this order." },
      { status: 404 },
    );
  }
}
