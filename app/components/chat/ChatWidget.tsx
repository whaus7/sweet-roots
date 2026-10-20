"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatSnapshot, ChatStatus } from "@/app/lib/chat/types";

const POLL_MS = 2500;

function formatTime(at: number) {
  return new Date(at).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ChatStatus | "loading">("loading");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const applySnapshot = useCallback((snap: ChatSnapshot) => {
    setStatus(snap.status);
    setMessages(snap.messages);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/chat", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as ChatSnapshot;
      applySnapshot(data);
    } catch {
      /* keep last known state */
    }
  }, [applySnapshot]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    if (status === "unconfigured" || status === "loading") return;
    const id = window.setInterval(() => {
      void refresh();
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [open, status, refresh]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  async function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.status === 409) {
        applySnapshot(data as ChatSnapshot);
        setDraft(text);
        return;
      }
      if (!res.ok) {
        setError(data.error || "Unable to send. Try again.");
        return;
      }
      applySnapshot(data as ChatSnapshot);
      setDraft("");
    } catch {
      setError("Unable to send. Try again.");
    } finally {
      setSending(false);
    }
  }

  async function closeChat() {
    try {
      const res = await fetch("/api/chat/close", { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as ChatSnapshot;
        applySnapshot(data);
      }
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (status === "loading" || status === "unconfigured") {
    return null;
  }

  const canType = status === "open" || status === "live" || status === "ended";
  const title =
    status === "unavailable"
      ? "Chat is unavailable"
      : status === "ended"
        ? "Chat ended"
        : "Chat with JördHaus";

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <section
          id="site-chat-panel"
          className="pointer-events-auto flex h-[min(28rem,calc(100svh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-[#00340c]/15 bg-white shadow-2xl"
          aria-label="Site chat"
        >
          <header className="flex items-start justify-between gap-3 bg-[#00340c] px-4 py-3 text-white">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                JördHaus
              </p>
              <h2 className="mt-1 text-base font-semibold">{title}</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                if (status === "live") {
                  void closeChat();
                } else {
                  setOpen(false);
                }
              }}
              className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
              aria-label={status === "live" ? "End chat" : "Close chat"}
            >
              <span aria-hidden className="block text-lg leading-none">
                ×
              </span>
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {status === "unavailable" ? (
              <p className="text-sm leading-relaxed text-gray-700">
                Someone else is in a live chat right now. Call{" "}
                <a className="font-semibold text-[#00340c] underline" href="tel:3124151093">
                  312-415-1093
                </a>{" "}
                or use the{" "}
                <Link className="font-semibold text-[#00340c] underline" href="/contact">
                  contact form
                </Link>
                .
              </p>
            ) : null}

            {status === "ended" ? (
              <p className="text-sm leading-relaxed text-gray-700">
                This chat has ended. Start a new message below if the line is
                free, or use the{" "}
                <Link className="font-semibold text-[#00340c] underline" href="/contact">
                  contact form
                </Link>
                .
              </p>
            ) : null}

            {status === "open" && messages.length === 0 ? (
              <p className="text-sm leading-relaxed text-gray-700">
                Send a message and it will text the shop. Replies from our phone
                show up here.
              </p>
            ) : null}

            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex ${item.from === "visitor" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    item.from === "visitor"
                      ? "bg-[#00340c] text-white"
                      : "bg-[#f4efe4] text-[#1c1812]"
                  }`}
                >
                  <p>{item.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      item.from === "visitor" ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    {formatTime(item.at)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {canType ? (
            <form
              onSubmit={send}
              className="border-t border-[#00340c]/10 px-3 py-3"
            >
              {error ? (
                <p className="mb-2 text-xs text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="site-chat-input">
                  Message
                </label>
                <input
                  id="site-chat-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={500}
                  placeholder="Write a message"
                  className="min-w-0 flex-1 rounded-md border border-[#00340c]/20 px-3 py-2 text-sm text-[#171717] shadow-sm focus:border-[#d4a017] focus:outline-none focus:ring-2 focus:ring-[#d4a017]/30"
                />
                <button
                  type="submit"
                  disabled={sending || !draft.trim()}
                  className="rounded-md bg-[#00340c] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          ) : null}
        </section>
      ) : null}

      <button
        type="button"
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#00340c] text-white shadow-lg transition hover:bg-[#004d12]"
        aria-expanded={open}
        aria-controls="site-chat-panel"
        onClick={() => {
          setOpen((was) => !was);
          if (!open) void refresh();
        }}
      >
        <span className="sr-only">{open ? "Close chat" : "Open chat"}</span>
        {open ? (
          <span aria-hidden className="text-2xl leading-none">
            ×
          </span>
        ) : (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 8h10M7 12h6m8 1a9 9 0 11-3.5-7.1L21 4v5h-5"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
