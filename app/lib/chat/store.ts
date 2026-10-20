import { Redis } from "@upstash/redis";
import {
  CHAT_RATE_LIMIT,
  CHAT_RATE_WINDOW_SECONDS,
  CHAT_TTL_SECONDS,
} from "./config";
import type { ChatMessage, ChatSession } from "./types";

const LOCK_KEY = "jordhaus:chat:lock";
const sessionKey = (id: string) => `jordhaus:chat:session:${id}`;
const rateKey = (id: string) => `jordhaus:chat:rate:${id}`;

let redis: Redis | null = null;

function client(): Redis {
  if (!redis) {
    redis = Redis.fromEnv();
  }
  return redis;
}

export async function getLockHolder(): Promise<string | null> {
  const holder = await client().get<string>(LOCK_KEY);
  return holder || null;
}

export async function claimLock(
  sessionId: string,
): Promise<"claimed" | "owned" | "busy"> {
  const kv = client();
  const holder = await kv.get<string>(LOCK_KEY);
  if (holder === sessionId) {
    await kv.expire(LOCK_KEY, CHAT_TTL_SECONDS);
    return "owned";
  }
  if (holder) return "busy";
  const ok = await kv.set(LOCK_KEY, sessionId, {
    nx: true,
    ex: CHAT_TTL_SECONDS,
  });
  return ok ? "claimed" : "busy";
}

export async function getSession(
  sessionId: string,
): Promise<ChatSession | null> {
  const session = await client().get<ChatSession>(sessionKey(sessionId));
  return session ?? null;
}

export async function saveSession(session: ChatSession): Promise<void> {
  const kv = client();
  await kv.set(sessionKey(session.sessionId), session, {
    ex: CHAT_TTL_SECONDS,
  });
  await kv.expire(LOCK_KEY, CHAT_TTL_SECONDS);
}

export async function appendMessage(
  sessionId: string,
  message: ChatMessage,
): Promise<ChatSession> {
  const existing = (await getSession(sessionId)) ?? {
    sessionId,
    messages: [],
  };
  const next: ChatSession = {
    sessionId,
    messages: [...existing.messages, message],
  };
  await saveSession(next);
  return next;
}

export async function releaseLock(sessionId: string): Promise<boolean> {
  const kv = client();
  const holder = await kv.get<string>(LOCK_KEY);
  if (holder && holder !== sessionId) return false;
  await kv.del(LOCK_KEY, sessionKey(sessionId));
  return true;
}

export async function releaseLockForce(): Promise<void> {
  const kv = client();
  const holder = await kv.get<string>(LOCK_KEY);
  if (holder) {
    await kv.del(LOCK_KEY, sessionKey(holder));
  } else {
    await kv.del(LOCK_KEY);
  }
}

export async function allowMessage(sessionId: string): Promise<boolean> {
  const kv = client();
  const count = await kv.incr(rateKey(sessionId));
  if (count === 1) {
    await kv.expire(rateKey(sessionId), CHAT_RATE_WINDOW_SECONDS);
  }
  return count <= CHAT_RATE_LIMIT;
}
