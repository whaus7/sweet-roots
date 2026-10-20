import { NextResponse } from "next/server";
import { chatConfigured, CHAT_MAX_LEN } from "@/app/lib/chat/config";
import { getOrCreateSessionId, readSessionId } from "@/app/lib/chat/session";
import { sendOwnerSms } from "@/app/lib/chat/sms";
import {
  allowMessage,
  appendMessage,
  claimLock,
  getLockHolder,
  getSession,
  releaseLock,
  saveSession,
} from "@/app/lib/chat/store";
import type { ChatMessage, ChatSnapshot } from "@/app/lib/chat/types";

function message(from: ChatMessage["from"], text: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    from,
    text,
    at: Date.now(),
  };
}

async function snapshot(sessionId: string | null): Promise<ChatSnapshot> {
  if (!chatConfigured()) {
    return { status: "unconfigured", messages: [] };
  }

  const holder = await getLockHolder();
  if (!holder) {
    if (sessionId) {
      const prior = await getSession(sessionId);
      if (prior?.messages.length) {
        return { status: "ended", messages: prior.messages };
      }
    }
    return { status: "open", messages: [] };
  }

  if (sessionId && holder === sessionId) {
    const live = await getSession(sessionId);
    return { status: "live", messages: live?.messages ?? [] };
  }

  return { status: "unavailable", messages: [] };
}

export async function GET() {
  try {
    const sessionId = await readSessionId();
    return NextResponse.json(await snapshot(sessionId));
  } catch (error) {
    console.error("[chat] poll failed", error);
    return NextResponse.json(
      { error: "Unable to load chat." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!chatConfigured()) {
      return NextResponse.json(
        { status: "unconfigured", messages: [] },
        { status: 503 },
      );
    }

    const body = await request.json();
    const text =
      typeof body.text === "string" ? body.text.trim().slice(0, CHAT_MAX_LEN) : "";
    if (!text) {
      return NextResponse.json(
        { error: "Type a message to start the chat." },
        { status: 400 },
      );
    }

    const sessionId = await getOrCreateSessionId();
    const allowed = await allowMessage(sessionId);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many messages. Wait a few minutes and try again." },
        { status: 429 },
      );
    }

    const claim = await claimLock(sessionId);
    if (claim === "busy") {
      return NextResponse.json(await snapshot(sessionId), { status: 409 });
    }

    const isFirst = claim === "claimed";
    try {
      await sendOwnerSms(text, isFirst);
    } catch (error) {
      console.error("[chat] sms failed", error);
      if (isFirst) {
        await releaseLock(sessionId);
        return NextResponse.json(
          { error: "Unable to reach the phone line. Please call or use the contact form." },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Message saved, but the text did not send. Try again." },
        { status: 502 },
      );
    }

    if (isFirst) {
      await saveSession({ sessionId, messages: [] });
    }

    const session = await appendMessage(
      sessionId,
      message("visitor", text),
    );
    return NextResponse.json({
      status: "live" as const,
      messages: session.messages,
    });
  } catch (error) {
    console.error("[chat] send failed", error);
    return NextResponse.json(
      { error: "Unable to send your message. Please try again." },
      { status: 500 },
    );
  }
}
