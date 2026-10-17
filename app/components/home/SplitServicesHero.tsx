"use client";

import Image from "next/image";
import Link from "next/link";
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
    line: "Interlocking cast concrete panels with am optional cedar cap. For raised beds or landscape features.",
  },
  {
    id: "install",
    label: "Install",
    line: "Install is included or buy the kit and do it yourself.",
  },
  {
    id: "remove",
    label: "Remove",
    line: "We'll remove old rotted beds and replace them with beds that stay.",
  },
];

// 0 = slide photo left, 100 = slide photo right. 50 is centered.
const BED_IMAGE_X = 100;
const SOIL_IMAGE_X = 100;
const IMAGE_PAN_RANGE = 0;

function HeroPhoto({
  src,
  alt,
  x,
  priority = false,
}: {
  src: string;
  alt: string;
  x: number;
  priority?: boolean;
}) {
  const shift = -((Math.min(100, Math.max(0, x)) / 100) * IMAGE_PAN_RANGE);
  return (
    <div
      className="absolute inset-y-0"
      style={{ width: `${100 + IMAGE_PAN_RANGE}%`, left: `${shift}%` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}

const SOIL_STAMPS: Stamp[] = [
  {
    id: "prep",
    label: "Prep",
    line: "We prepare beds that will provide sustainable soil biology for decades.",
  },
  {
    id: "hugel",
    label: "Hugel",
    line: "Hugelkultur provides long lasting food for biology and mycorrhiza. It also acts as a water battery through dryer times.",
  },
  {
    id: "worms",
    label: "Worms",
    line: "We bring in over 1,000 red wigglers per bed. Every bed essentially becomes a worm bin.",
  },
  {
    id: "feed",
    label: "Feed",
    line: "Worms need to be fed to stay healthy. Dispose of your kitchen scraps sustainably and easily. Just bury it in alternating locations of the bed and let the worms do the rest.",
  },
];

function HeroPanel({
  title,
  stamps,
  align,
  href,
}: {
  title: string;
  stamps: Stamp[];
  align: "left" | "right";
  href: string;
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
      <Link
        href={href}
        className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 underline-offset-4 transition hover:text-white hover:underline"
      >
        Learn more
      </Link>
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
            <HeroPhoto
              src="/images/services-diagram/backyard-hero-vines-cedar.webp"
              alt="Finished concrete raised bed with a cedar cap in a backyard garden"
              x={BED_IMAGE_X}
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
            <HeroPanel
              title="Beds that stay"
              stamps={BED_STAMPS}
              align="left"
              href="/beds"
            />
          </div>
        </div>

        <div className="relative min-h-[50%] flex-1 lg:absolute lg:inset-0">
          <div
            className="absolute inset-0 lg:[clip-path:polygon(56%_0,100%_0,100%_100%,44%_100%)]"
          >
            <HeroPhoto
              src="/images/services-diagram/soil-amend-hero.jpg"
              alt="Vermicast tea poured onto living garden soil"
              x={SOIL_IMAGE_X}
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
              href="/soil"
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
