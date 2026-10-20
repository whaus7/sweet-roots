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

function HeroPhoto({
  src,
  alt,
  objectPosition = "50% 50%",
  priority = false,
  sizes,
  frame = "full",
  offsetX = 0,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  priority?: boolean;
  sizes: string;
  frame?: "full" | "right";
  offsetX?: number;
}) {
  const isRight = frame === "right";
  const shiftLeft = !isRight && offsetX < 0;
  return (
    <div
      className={
        isRight
          ? "absolute inset-0 lg:left-auto lg:w-[36%]"
          : shiftLeft
            ? "absolute inset-0 lg:-left-[200px] lg:w-[calc(100%+200px)]"
            : "absolute inset-0"
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition }}
        priority={priority}
      />
    </div>
  );
}

function HeroPanel({
  title,
  stamps,
  align,
  href,
  compact = false,
}: {
  title: string;
  stamps: Stamp[];
  align: "left" | "right";
  href: string;
  compact?: boolean;
}) {
  const [activeId, setActiveId] = useState(stamps[0].id);
  const active = stamps.find((stamp) => stamp.id === activeId) ?? stamps[0];

  return (
    <div
      className={`relative z-10 flex h-full flex-col justify-end ${
        compact
          ? "px-4 py-6 sm:px-5 lg:px-5 lg:py-10"
          : "px-6 py-8 sm:px-8 lg:py-12"
      } ${
        align === "left"
          ? "items-start text-left lg:pr-10"
          : "items-start text-left lg:items-end lg:text-right"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
        {align === "left" ? "Structure" : "Biology"}
      </p>
      <h2
        className={`mt-2 font-bold tracking-tight text-white drop-shadow-sm ${
          compact
            ? "text-3xl sm:text-4xl lg:text-[2.1rem] lg:leading-tight"
            : "text-4xl sm:text-5xl"
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-sm leading-relaxed text-white/90 sm:text-base ${
          compact
            ? "min-h-[4.5rem] max-w-[16rem] lg:text-sm"
            : "min-h-[3.5rem] max-w-sm"
        }`}
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
                  ? compact
                    ? "text-base text-white sm:text-lg"
                    : "text-lg text-white sm:text-xl"
                  : compact
                    ? "text-xs text-white/55 hover:text-white sm:text-sm"
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
      <h1 className="sr-only">Raised bed install and living-soil repair</h1>

      <div className="flex h-full flex-col lg:block">
        <div className="relative min-h-[62%] flex-[7] lg:absolute lg:inset-0 lg:min-h-0 lg:flex-none">
          <div className="absolute inset-0 lg:[clip-path:polygon(0_0,74%_0,66%_100%,0_100%)]">
            <HeroPhoto
              src="/images/services-diagram/backyard-hero-cedar-bed-2x1-v2.jpg"
              alt="Two-panel-long interlocking cast concrete raised bed with recessed panels and a cedar cap"
              objectPosition="46% 58%"
              sizes="(min-width: 1024px) 74vw, 100vw"
              offsetX={-200}
              priority
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/15"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
          <div className="relative h-full lg:w-[64%]">
            <HeroPanel
              title="Beds that stay"
              stamps={BED_STAMPS}
              align="left"
              href="/beds"
            />
          </div>
        </div>

        <div className="relative min-h-[38%] flex-[3] lg:absolute lg:inset-0 lg:min-h-0 lg:flex-none">
          <div className="absolute inset-0 lg:[clip-path:polygon(74%_0,100%_0,100%_100%,66%_100%)]">
            <HeroPhoto
              src="/images/services-diagram/hugel-slice-worms-v4.jpg"
              alt="Hugelkultur layer stack with split logs, sticks, leaves, compost, soil, and red wiggler worms"
              objectPosition="42% 55%"
              sizes="(min-width: 1024px) 36vw, 100vw"
              frame="right"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
          <div className="relative ml-auto h-full lg:w-[34%]">
            <HeroPanel
              title="Soil that lives"
              stamps={SOIL_STAMPS}
              align="right"
              href="/soil"
              compact
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
          aria-hidden="true"
        >
          <div className="absolute inset-0 [clip-path:polygon(73.35%_0,74.65%_0,66.65%_100%,65.35%_100%)] bg-white/80 shadow-[0_0_24px_rgba(0,0,0,0.35)]" />
        </div>
      </div>
    </section>
  );
}
