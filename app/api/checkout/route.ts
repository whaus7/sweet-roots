import { NextResponse } from "next/server";
import {
  PRODUCTS,
  WORM_SHIPPING_CENTS,
  cartIncludesWorms,
  parseCartItems,
  productTaxCode,
} from "@/app/lib/store/catalog";
import { getStripe, stripeConfigured } from "@/app/lib/stripe/client";
import { getSiteUrl, productImageUrl } from "@/app/lib/stripe/site-url";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ready: stripeConfigured() });
}

export async function POST(request: Request) {
  try {
    if (!stripeConfigured()) {
      return NextResponse.json(
        {
          error: "Checkout is not configured yet.",
          code: "not_configured",
        },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => null);
    const items = parseCartItems(body?.items);
    if (!items.length) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 },
      );
    }

    const origin = getSiteUrl(request);
    const stripe = getStripe();
    const shipsWorms = cartIncludesWorms(items);
    const session = await stripe.checkout.sessions.create({
      ui_mode: "hosted_page",
      mode: "payment",
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: true },
      allow_promotion_codes: false,
      submit_type: "auto",
      integration_identifier: "hosted_web_0001",
      origin_context: "web",
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      ...(shipsWorms
        ? {
            shipping_address_collection: { allowed_countries: ["US"] as const },
            shipping_options: [
              {
                shipping_rate_data: {
                  type: "fixed_amount" as const,
                  display_name: "US shipping",
                  fixed_amount: {
                    amount: WORM_SHIPPING_CENTS,
                    currency: "usd",
                  },
                  tax_behavior: "exclusive" as const,
                  tax_code: "txcd_92010001",
                },
              },
            ],
            custom_text: {
              shipping_address: {
                message:
                  "Live worms ship in the United States. Microgreens are picked up at the Redmond farm.",
              },
            },
          }
        : {}),
      line_items: items.map((line) => {
        const product = PRODUCTS[line.productId];
        const image = productImageUrl(origin, product.image);
        return {
          quantity: line.quantity,
          price_data: {
            currency: "usd",
            unit_amount: product.priceCents,
            tax_behavior: "exclusive" as const,
            product_data: {
              name: product.name,
              description: product.description,
              tax_code: productTaxCode(product.category),
              images: image ? [image] : [],
              metadata: { sku: product.sku, productId: product.id },
            },
          },
        };
      }),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    console.error("[checkout] create failed", error);
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 },
    );
  }
}
