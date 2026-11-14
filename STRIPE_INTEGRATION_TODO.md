# Stripe Checkout setup

Hosted Checkout is already wired to the cart. Remaining work is account setup, not more checkout code.

## Values to replace

The cart, success page, and cancel page already use real values. There are no `price_...` placeholders to swap in.

**Files containing these values:**

- [app/api/checkout/route.ts](app/api/checkout/route.ts)

| Field | Current value | What to set |
| --- | --- | --- |
| mode | `payment` | Leave this. Trays and worm herds are one-time charges, not subscriptions. |
| success_url | `{site}/checkout/success?session_id={CHECKOUT_SESSION_ID}` | Leave this. Keep the `{CHECKOUT_SESSION_ID}` token. |
| cancel_url | `{site}/checkout/cancel` | Leave this. |
| line_items | Built from the cart in `app/lib/store/catalog.ts` | Leave this. Prices are `price_data` amounts in cents, not Dashboard Price IDs. |

`payment_method_collection` was set to `always` in Checkout Studio. Stripe only accepts that field on a subscription session, so it is not sent. One-time Checkout still collects a card.

## Configured parameters

These match the Checkout Studio settings. The Stripe SDK is 23.x, so `ui_mode` is `hosted_page`.

**Files containing these parameters:**

- [app/api/checkout/route.ts](app/api/checkout/route.ts)

| Parameter | Value |
| --- | --- |
| ui_mode | `hosted_page` |
| billing_address_collection | `auto` |
| phone_number_collection | `{ enabled: false }` |
| automatic_tax | `{ enabled: false }` |
| allow_promotion_codes | `false` |
| submit_type | `auto` |
| integration_identifier | `hosted_web_0001` |
| origin_context | `web` |

Checkout Studio did not include a shipping address, so the session no longer asks for one. Worm orders that ship in the US will not collect a ship-to address on Stripe’s page until that is added back.

## Setup and next steps

### Environment variables

Set these on the live Vercel project, then redeploy. Names must match the code. Do not put the secret key in client code. The publishable key is not used for hosted Checkout.

| Variable | Value |
| --- | --- |
| `STRIPE_SECRET_KEY` | Secret key from the Stripe dashboard. `sk_test_...` for a trial charge, `sk_live_...` for real cards. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret (`whsec_...`) from the webhook endpoint below. Use the secret from the same mode as the secret key. |

`CHAT_PUBLIC_URL` is already set and is what Checkout uses for the success and cancel return URLs.

### Webhook

1. In Stripe, open Developers → Webhooks and add an endpoint.
2. URL: `https://www.jordhaus.com/api/webhooks/stripe`
3. Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

The webhook emails the paid order. Without it, the charge still appears in the Stripe dashboard and the customer still reaches the success page.

### How a payment works

1. The shopper checks out from the cart.
2. `POST /api/checkout` creates a hosted Checkout Session and returns Stripe’s page URL.
3. The shopper pays on Stripe’s page.
4. Stripe sends them to `/checkout/success` or `/checkout/cancel`.
5. Stripe posts the paid session to `/api/webhooks/stripe`, which emails the order.

### Test a card

Use test mode and card `4242 4242 4242 4242`, any future expiration, and any CVC. A live key charges a real card.

### Still outside the website

Stripe deposits the balance only after a bank account is on the Stripe account. An LLC payout should go to an account in the LLC’s name.

### Resources

- https://support.stripe.com
- https://docs.stripe.com/payments/checkout
- https://docs.stripe.com/mcp
