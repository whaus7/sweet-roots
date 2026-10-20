import twilio from "twilio";
import { CHAT_SMS_PREFIX } from "./config";
import { toE164 } from "./phone";

function client() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) {
    throw new Error("Twilio is not configured");
  }
  return twilio(sid, token);
}

export async function sendOwnerSms(text: string, isFirst: boolean) {
  const from = process.env.TWILIO_PHONE;
  const to = process.env.CHAT_OWNER_PHONE;
  if (!from || !to) {
    throw new Error("Twilio phone numbers are not configured");
  }

  const body = isFirst
    ? `${CHAT_SMS_PREFIX} someone is writing from the site.\n\n${text}\n\nReply to this number. Text END to close.`
    : `${CHAT_SMS_PREFIX} ${text}`;

  await client().messages.create({
    body,
    from: toE164(from),
    to: toE164(to),
  });
}

export function validateTwilioRequest(
  signature: string | null,
  url: string,
  params: Record<string, string>,
): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token || !signature) return false;
  return twilio.validateRequest(token, signature, url, params);
}
