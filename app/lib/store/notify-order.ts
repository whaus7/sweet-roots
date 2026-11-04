import { Redis } from "@upstash/redis";
import nodemailer from "nodemailer";
import { formatUsd } from "./catalog";

export type PaidOrder = {
  sessionId: string;
  email?: string;
  name?: string;
  phone?: string;
  amountCents: number;
  lines: { name: string; quantity: number; amountCents: number }[];
  paymentStatus: string;
};

async function alreadySent(sessionId: string) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;

  try {
    const redis = Redis.fromEnv();
    const wrote = await redis.set(`jordhaus:order:${sessionId}`, "1", {
      nx: true,
      ex: 60 * 60 * 24 * 90,
    });
    return !wrote;
  } catch (error) {
    console.error("[order] redis idempotency failed", error);
    return false;
  }
}

export async function notifyPaidOrder(order: PaidOrder) {
  if (await alreadySent(order.sessionId)) return;

  const lines = [
    "New paid order from the JördHaus store.",
    "",
    `Stripe session: ${order.sessionId}`,
    `Payment: ${order.paymentStatus}`,
    `Customer: ${order.name || "(not provided)"}`,
    `Email: ${order.email || "(not provided)"}`,
    `Phone: ${order.phone || "(not provided)"}`,
    "",
    "Items:",
    ...order.lines.map(
      (line) =>
        `- ${line.quantity} × ${line.name} (${formatUsd(line.amountCents)})`,
    ),
    "",
    `Total: ${formatUsd(order.amountCents)}`,
    "",
    "Follow up about Bellevue pickup or delivery.",
  ];

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.CONTACT_FROM || "contact@jordhaus.com";
  const to = process.env.CONTACT_TO || "whaus777@gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);

  if (!host || !user || !pass) {
    console.info("[order] SMTP not configured; paid order\n", lines.join("\n"));
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `JördHaus <${from}>`,
    to,
    replyTo: order.email || undefined,
    subject: `New order${order.name ? ` from ${order.name}` : ""} — ${formatUsd(order.amountCents)}`,
    text: lines.join("\n"),
  });
}
