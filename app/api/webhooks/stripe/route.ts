import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/app/lib/stripe/client";
import { notifyPaidOrder } from "@/app/lib/store/notify-order";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 503 },
    );
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("[stripe webhook] signature failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    const full = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    await notifyPaidOrder({
      sessionId: full.id,
      email: full.customer_details?.email ?? full.customer_email ?? undefined,
      name: full.customer_details?.name ?? undefined,
      phone: full.customer_details?.phone ?? undefined,
      amountCents: full.amount_total ?? 0,
      paymentStatus: full.payment_status,
      lines:
        full.line_items?.data.map((item) => ({
          name: item.description || "Item",
          quantity: item.quantity ?? 1,
          amountCents: item.amount_total ?? 0,
        })) ?? [],
    });
  } catch (error) {
    console.error("[stripe webhook] order notify failed", error);
  }

  return NextResponse.json({ received: true });
}
