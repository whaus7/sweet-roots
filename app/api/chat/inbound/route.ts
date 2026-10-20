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

export async function POST(request: Request) {
  if (!chatConfigured()) {
    return new NextResponse("Chat is not configured", { status: 503 });
  }

  const form = await request.formData();
  const params: Record<string, string> = {};
  form.forEach((value, key) => {
    if (typeof value === "string") params[key] = value;
  });

  const signature = request.headers.get("x-twilio-signature");
  const url = process.env.CHAT_PUBLIC_URL
    ? `${process.env.CHAT_PUBLIC_URL.replace(/\/$/, "")}/api/chat/inbound`
    : request.url;

  if (!validateTwilioRequest(signature, url, params)) {
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
