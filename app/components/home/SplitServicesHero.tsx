"use client";

import Image from "next/image";
import { useState } from "react";

type Stamp = {
  id: string;
  label: string;
  line: string;
};

const BED_STAMPS: Stamp[] = [
  {
    id: "panels",
    label: "Panels",
    line: "Cast concrete with a simple cedar cap — built to stay for decades.",
  },
  {
    id: "install",
    label: "Install",
    line: "We set new beds in the yard, level and ready for living soil.",
  },
  {
    id: "remove",
    label: "Remove",
    line: "Tired wood boxes and rotting frames come out clean.",
  },
  {
    id: "replace",
    label: "Replace",
    line: "Old beds out, the new system in — same footprint, longer life.",
  },
];

const SOIL_STAMPS: Stamp[] = [
  {
    id: "amend",
    label: "Amend",
    line: "Fresh vermicast worked into depleted beds and in-ground plots.",
  },
  {
    id: "repair",
    label: "Repair",
    line: "Rebuild soil after synthetics burned through the microbiome.",
  },
  {
    id: "kickstart",
    label: "Kickstart",
    line: "A biology restart — organisms and food, not another salt hit.",
  },
  {
    id: "tea",
    label: "Tea",
    line: "Vermicast tea drenched through the root zone to wake the web.",
  },
];

function HeroPanel({
  title,
  stamps,
  align,
}: {
  title: string;
  stamps: Stamp[];
  align: "left" | "right";
}) {
  const [activeId, setActiveId] = useState(stamps[0].id);
  const active = stamps.find((stamp) => stamp.id === activeId) ?? stamps[0];

  return (
    <div
      className={`relative z-10 flex h-full flex-col justify-end px-6 py-8 sm:px-8 lg:py-12 ${
        align === "left"
          ? "items-start text-left lg:pr-24"
          : "items-start text-left lg:items-end lg:pl-24 lg:text-right"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
        {align === "left" ? "Structure" : "Biology"}
      </p>
      <h2 className="mt-2 text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
        {title}
      </h2>
      <p
        className="mt-4 min-h-[3.5rem] max-w-sm text-sm leading-relaxed text-white/90 sm:text-base"
        aria-live="polite"
      >
        {active.line}
      </p>
      <div
        className={`mt-6 flex flex-wrap gap-x-5 gap-y-2 ${
          align === "right" ? "lg:justify-end" : ""
        }`}
      >
        {stamps.map((stamp) => {
          const isActive = stamp.id === activeId;
          return (
            <button
              key={stamp.id}
              type="button"
              onMouseEnter={() => setActiveId(stamp.id)}
              onFocus={() => setActiveId(stamp.id)}
              onClick={() => setActiveId(stamp.id)}
              className={`cursor-pointer font-semibold uppercase tracking-[0.18em] transition ${
                isActive
                  ? "text-lg text-white sm:text-xl"
                  : "text-sm text-white/55 hover:text-white sm:text-base"
              }`}
              aria-pressed={isActive}
            >
              {stamp.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SplitServicesHero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#1a120c] text-white"
      style={{ height: "min(900px, calc(100svh - 4rem))" }}
      aria-label="Beds and living soil"
    >
      <h1 className="sr-only">
        Raised bed install and living-soil repair
      </h1>

      <div className="flex h-full flex-col lg:block">
        <div className="relative min-h-[50%] flex-1 lg:absolute lg:inset-0">
          <div
            className="absolute inset-0 lg:[clip-path:polygon(0_0,56%_0,44%_100%,0_100%)]"
          >
            <Image
              src="/images/services-diagram/backyard-hero-vines-cedar.webp"
              alt="Finished concrete raised bed with a cedar cap in a backyard garden"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
              aria-hidden="true"
            />
          </div>
          <div className="relative h-full lg:w-[52%]">
            <HeroPanel title="Beds that stay" stamps={BED_STAMPS} align="left" />
          </div>
        </div>

        <div className="relative min-h-[50%] flex-1 lg:absolute lg:inset-0">
          <div
            className="absolute inset-0 lg:[clip-path:polygon(56%_0,100%_0,100%_100%,44%_100%)]"
          >
            <Image
              src="/images/services-diagram/soil-amend-hero.jpg"
              alt="Vermicast tea poured onto living garden soil"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-l from-black/65 via-black/25 to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
              aria-hidden="true"
            />
          </div>
          <div className="relative ml-auto h-full lg:w-[52%]">
            <HeroPanel
              title="Soil that lives"
              stamps={SOIL_STAMPS}
              align="right"
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
          aria-hidden="true"
        >
          <div className="absolute inset-0 [clip-path:polygon(55.35%_0,56.65%_0,44.65%_100%,43.35%_100%)] bg-white/80 shadow-[0_0_24px_rgba(0,0,0,0.35)]" />
        </div>
      </div>
    </section>
  );
}
