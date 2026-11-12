"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { OPEN_CHAT_EVENT } from "@/app/lib/chat/open";
import type { ChatMessage, ChatSnapshot, ChatStatus } from "@/app/lib/chat/types";

const POLL_MS = 2500;
const GREET_AFTER_MS = 25_000;
const GREET_KEY = "jh-chat-greet";
const ACTIVE_KEY = "jh-chat-active-at";

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
  const [showGreeting, setShowGreeting] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const openedOnContact = useRef(false);
  const pathname = usePathname();
  openRef.current = open;

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

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      document.getElementById("site-chat-input")?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  const finishGreeting = useCallback(() => {
    setShowGreeting(false);
    try {
      sessionStorage.setItem(GREET_KEY, "done");
    } catch {
      /* ignore */
    }
  }, []);

  const openChat = useCallback(() => {
    setOpen(true);
    finishGreeting();
    void refresh();
  }, [finishGreeting, refresh]);

  useEffect(() => {
    const ready = status !== "loading" && status !== "unconfigured";
    if (ready) document.documentElement.dataset.chatReady = "1";
    else delete document.documentElement.dataset.chatReady;
    return () => {
      delete document.documentElement.dataset.chatReady;
    };
  }, [status]);

  useEffect(() => {
    if (pathname !== "/contact") {
      openedOnContact.current = false;
      return;
    }
    if (status === "loading" || status === "unconfigured") return;
    if (openedOnContact.current) return;
    openedOnContact.current = true;
    setOpen(true);
    finishGreeting();
    void refresh();
  }, [pathname, status, finishGreeting, refresh]);

  useEffect(() => {
    if (status === "loading" || status === "unconfigured") return;
    const onOpen = () => {
      setOpen(true);
      finishGreeting();
      void refresh();
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [status, finishGreeting, refresh]);

  useEffect(() => {
    if (status === "loading" || status === "unconfigured") return;
    let greeted = false;
    try {
      greeted = sessionStorage.getItem(GREET_KEY) === "done";
    } catch {
      return;
    }
    if (greeted) return;

    let timer = 0;
    let cancelled = false;
    let onVisible: (() => void) | null = null;

    const show = () => {
      if (cancelled) return;
      try {
        if (sessionStorage.getItem(GREET_KEY) === "done") return;
      } catch {
        return;
      }
      if (openRef.current) {
        try {
          sessionStorage.setItem(GREET_KEY, "done");
        } catch {
          /* ignore */
        }
        return;
      }
      if (document.hidden) {
        if (onVisible) return;
        onVisible = () => {
          if (document.hidden) return;
          document.removeEventListener("visibilitychange", onVisible!);
          onVisible = null;
          show();
        };
        document.addEventListener("visibilitychange", onVisible);
        return;
      }
      setShowGreeting(true);
    };

    const arm = () => {
      let start = 0;
      try {
        start = Number(sessionStorage.getItem(ACTIVE_KEY) || "0");
        if (!start) {
          start = Date.now();
          sessionStorage.setItem(ACTIVE_KEY, String(start));
        }
      } catch {
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(show, Math.max(0, GREET_AFTER_MS - (Date.now() - start)));
    };

    try {
      if (sessionStorage.getItem(ACTIVE_KEY)) arm();
    } catch {
      /* ignore */
    }

    let lastMove = 0;
    const onActivity = () => {
      if (document.hidden) return;
      arm();
    };
    const onMove = () => {
      const now = Date.now();
      if (now - lastMove < 1000) return;
      lastMove = now;
      onActivity();
    };

    window.addEventListener("pointerdown", onActivity, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("scroll", onActivity, { passive: true });
    window.addEventListener("touchstart", onActivity, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (onVisible) document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("scroll", onActivity);
      window.removeEventListener("touchstart", onActivity);
      window.removeEventListener("pointermove", onMove);
    };
  }, [status]);

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
      {showGreeting && !open ? (
        <div
          className="pointer-events-auto relative w-[min(18rem,calc(100vw-2rem))] rounded-lg bg-white px-4 py-3 text-[#1c1812] shadow-2xl ring-1 ring-[#00340c]/10"
          role="status"
        >
          <button
            type="button"
            onClick={finishGreeting}
            className="absolute right-2 top-2 rounded p-1 text-[#1c1812]/50 hover:text-[#1c1812]"
            aria-label="Dismiss greeting"
          >
            <span aria-hidden className="block text-base leading-none">
              ×
            </span>
          </button>
          <p className="pr-5 text-sm font-semibold leading-snug">
            Questions about worms, beds, or microgreens?
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#1c1812]/75">
            Send a note and it reaches the farm.
          </p>
          <button
            type="button"
            onClick={openChat}
            className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00340c] underline"
          >
            Start a chat
          </button>
        </div>
      ) : null}

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
                Talk to an actual human, text us with any questions or comments!
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
        className="pointer-events-auto flex h-16 items-center gap-2.5 rounded-full bg-[#00340c] px-5 text-white shadow-[0_12px_32px_rgba(0,52,12,0.45)] ring-2 ring-[#d4a017] transition hover:bg-[#004d12]"
        aria-expanded={open}
        aria-controls="site-chat-panel"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          openChat();
        }}
      >
        <span className="sr-only">{open ? "Close chat" : "Open chat"}</span>
        {open ? (
          <span aria-hidden className="text-2xl leading-none">
            ×
          </span>
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span className="text-sm font-semibold tracking-wide">{open ? "Close" : "Chat"}</span>
      </button>
    </div>
  );
}
