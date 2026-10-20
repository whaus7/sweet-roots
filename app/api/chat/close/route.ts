import { NextResponse } from "next/server";
import { chatConfigured } from "@/app/lib/chat/config";
import { readSessionId } from "@/app/lib/chat/session";
import { sendOwnerSms } from "@/app/lib/chat/sms";
import { getLockHolder, getSession, releaseLock } from "@/app/lib/chat/store";

export async function POST() {
  try {
    if (!chatConfigured()) {
      return NextResponse.json({ status: "unconfigured", messages: [] });
    }

    const sessionId = await readSessionId();
    if (!sessionId) {
      return NextResponse.json({ status: "open", messages: [] });
    }

    const holder = await getLockHolder();
    const prior = await getSession(sessionId);
    if (holder === sessionId) {
      try {
        await sendOwnerSms("Visitor closed the chat.", false);
      } catch (error) {
        console.error("[chat] close sms failed", error);
      }
      await releaseLock(sessionId);
    }

    return NextResponse.json({
      status: "ended",
      messages: prior?.messages ?? [],
    });
  } catch (error) {
    console.error("[chat] close failed", error);
    return NextResponse.json(
      { error: "Unable to close chat." },
      { status: 500 },
    );
  }
}
