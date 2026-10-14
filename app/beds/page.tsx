"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const FINISHES = [
  {
    id: "cedar",
    name: "Cedar cap",
    price: "$4,800",
    line: "Cast concrete panels with a simple cedar rim. The finish we build most.",
    image: "/images/beds-catalog-cedar.jpg",
    alt: "Cast concrete raised bed with a cedar cap in a backyard garden",
  },
  {
    id: "concrete",
    name: "Concrete rim",
    price: "$3,900",
    line: "The same panels without the wood top — a cleaner line, a lower starting point.",
    image: "/images/beds-catalog-concrete.jpg",
    alt: "Cast concrete raised bed with a plain concrete rim in a backyard garden",
  },
] as const;

export default function BedsPage() {
  const [selectedId, setSelectedId] = useState<(typeof FINISHES)[number]["id"]>(
    "cedar",
  );
  const selected =
    FINISHES.find((finish) => finish.id === selectedId) ?? FINISHES[0];

  return (
    <section
      className="relative isolate overflow-hidden bg-black text-white"
      style={{ minHeight: "calc(100svh - 4rem)" }}
      aria-label="Raised bed collection"
    >
      {FINISHES.map((finish) => (
        <Image
          key={finish.id}
          src={finish.image}
          alt={finish.alt}
          fill
          priority={finish.id === "cedar"}
          sizes="100vw"
          className={`object-cover object-left transition-opacity duration-700 ${
            finish.id === selectedId ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 lg:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, transparent 38%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.88) 78%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col justify-end px-6 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-end lg:py-16">
        <div className="w-full max-w-md lg:mr-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60">
            The collection
          </p>
          <h1 className="catalog-display mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
            Beds that stay
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            Heavy cast panels, built on site. Not a kit. Not a season.
          </p>

          <div className="mt-8 space-y-3" role="listbox" aria-label="Finish">
            {FINISHES.map((finish) => {
              const active = finish.id === selectedId;
              return (
                <button
                  key={finish.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => setSelectedId(finish.id)}
                  className={`w-full border px-4 py-4 text-left transition ${
                    active
                      ? "border-white bg-white/10"
                      : "border-white/25 hover:border-white/60"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em]">
                      {finish.name}
                    </span>
                    <span className="catalog-display text-xl">{finish.price}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {finish.line}
                  </p>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-white/50">
            Starting points for a typical install in Bellevue. We build on site
            — we do not ship panels.
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-block border border-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-black"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
