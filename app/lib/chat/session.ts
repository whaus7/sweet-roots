import { cookies } from "next/headers";
import { CHAT_COOKIE } from "./config";

export async function getOrCreateSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(CHAT_COOKIE)?.value;
  if (existing) return existing;
  const id = crypto.randomUUID();
  jar.set(CHAT_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });
  return id;
}

export async function readSessionId(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(CHAT_COOKIE)?.value ?? null;
}
