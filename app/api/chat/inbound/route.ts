import { NextResponse } from "next/server";
import { chatConfigured } from "@/app/lib/chat/config";
import { samePhone } from "@/app/lib/chat/phone";
import { validateTwilioRequest } from "@/app/lib/chat/sms";
import {
  appendMessage,
  getLockHolder,
  releaseLockForce,
} from "@/app/lib/chat/store";

function twiml() {
  return new NextResponse(
    '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
    { headers: { "Content-Type": "text/xml" } },
  );
}

function inboundUrls(request: Request): string[] {
  const path = "/api/chat/inbound";
  const urls = new Set<string>();

  const add = (value: string | null | undefined) => {
    if (!value) return;
    try {
      const url = new URL(value.includes("://") ? value : `https://${value}`);
      urls.add(`${url.origin}${path}`);
    } catch {
      return;
    }
  };

  const configured = process.env.CHAT_PUBLIC_URL?.replace(/\/$/, "");
  if (configured) add(`${configured}${path}`);

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  if (host) add(`${proto}://${host}${path}`);
  add(request.url);

  for (const url of [...urls]) {
    const parsed = new URL(url);
    parsed.hostname = parsed.hostname.startsWith("www.")
      ? parsed.hostname.slice(4)
      : `www.${parsed.hostname}`;
    urls.add(`${parsed.origin}${path}`);
  }

  return [...urls];
}

export async function POST(request: Request) {
  if (!chatConfigured()) {
    return new NextResponse("Chat is not configured", { status: 503 });
  }

  const raw = await request.text();
  const params = Object.fromEntries(new URLSearchParams(raw));

  const signature = request.headers.get("x-twilio-signature");
  const urls = inboundUrls(request);
  const valid = urls.some((url) => validateTwilioRequest(signature, url, params));
  if (!valid) {
    console.error("[chat] invalid twilio signature", { urls });
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const from = params.From || "";
  const owner = process.env.CHAT_OWNER_PHONE || "";
  if (!samePhone(from, owner)) {
    return twiml();
  }

  const body = (params.Body || "").trim();
  if (!body) return twiml();

  if (body.toUpperCase() === "END") {
    await releaseLockForce();
    return twiml();
  }

  const holder = await getLockHolder();
  if (!holder) return twiml();

  await appendMessage(holder, {
    id: crypto.randomUUID(),
    from: "owner",
    text: body.slice(0, 1000),
    at: Date.now(),
  });

  return twiml();
}
