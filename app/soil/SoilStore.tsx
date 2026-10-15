"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CARE_PRICE = 95;

const BUILDS = [
  {
    id: "new",
    name: "New bed",
    amount: 1340,
    line: "Hugelkultur, leaf litter, a vermicast-and-compost cap, and a worm start in an empty frame.",
  },
  {
    id: "replace",
    name: "Replace existing",
    amount: 1890,
    line: "Old soil out first — then the same living fill and worm start. More labor, a clean start.",
  },
] as const;

function money(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

export function SoilStore() {
  const [selectedId, setSelectedId] = useState<(typeof BUILDS)[number]["id"]>(
    "new",
  );
  const [care, setCare] = useState(false);
  const selected =
    BUILDS.find((build) => build.id === selectedId) ?? BUILDS[0];

  return (
    <section
      className="relative isolate overflow-hidden bg-black text-white"
      style={{ minHeight: "calc(100svh - 4rem)" }}
      aria-label="Living soil collection"
    >
      <Image
        src="/images/soil-hugel-layers-v2.jpg"
        alt="Raised bed cutaway showing hugelkultur logs under a living soil cap"
        fill
        priority
        sizes="100vw"
        className="object-cover object-left"
      />

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
            The system
          </p>
          <h1 className="catalog-display mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
            Soil that lives
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            Every bed is a worm bin. Wood, worms, and a vermicast cap — not a
            bag of potting dirt.
          </p>

          <div className="mt-8 space-y-3" role="listbox" aria-label="Soil build">
            {BUILDS.map((build) => {
              const active = build.id === selectedId;
              return (
                <button
                  key={build.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => setSelectedId(build.id)}
                  className={`w-full border px-5 py-6 text-left transition ${
                    active
                      ? "border-white bg-white/10"
                      : "border-white/25 hover:border-white/60"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-semibold uppercase tracking-[0.16em]">
                      {build.name}
                    </span>
                    <span className="catalog-display text-2xl">
                      {money(build.amount)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {build.line}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em]">
                Bed care
                <span className="ml-2 font-normal normal-case tracking-normal text-white/55">
                  +{money(CARE_PRICE)} / month
                </span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                Feeding and a health check — rotating corners, cover, moisture,
                and the herd.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={care}
              aria-label="Add monthly bed care"
              onClick={() => setCare((on) => !on)}
              className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                care ? "justify-end bg-white" : "justify-start bg-white/25"
              }`}
            >
              <span
                aria-hidden
                className={`h-6 w-6 rounded-full shadow ${
                  care ? "bg-black" : "bg-white"
                }`}
              />
            </button>
          </div>

          {care ? (
            <p className="mt-4 flex items-baseline justify-between gap-4 text-sm text-white/80">
              <span>
                {money(selected.amount)} build
                <span className="text-white/55"> + </span>
                {money(CARE_PRICE)} / month
              </span>
            </p>
          ) : null}

          <p className="mt-6 text-xs leading-relaxed text-white/50">
            Starting points for a typical bed in Bellevue. The frame is on the{" "}
            <Link href="/beds" className="underline hover:text-white">
              raised-bed
            </Link>{" "}
            side.
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
