export const CHAT_COOKIE = "jh_chat_sid";
export const CHAT_TTL_SECONDS = 20 * 60;
export const CHAT_MAX_LEN = 500;
export const CHAT_RATE_LIMIT = 20;
export const CHAT_RATE_WINDOW_SECONDS = 10 * 60;
export const CHAT_SMS_PREFIX = "JördHaus chat:";

export function chatConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE &&
      process.env.CHAT_OWNER_PHONE &&
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}
