"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AddToCartButton } from "@/app/components/cart/AddToCartButton";
import { centsToAmount, PRODUCTS } from "@/app/lib/store/catalog";

const TRAY_PRICE = centsToAmount(PRODUCTS["microgreen-radish"].priceCents);

const CROPS = [
  {
    id: "radish",
    name: "Radish",
    days: 8,
    image: "/images/microgreens/wc-radish.jpg",
    painting: "/images/microgreens/wc-radish-cut.png?v=orig",
    alt: "Watercolor of a radish microgreen",
  },
  {
    id: "arugula",
    name: "Arugula",
    days: 10,
    image: "/images/microgreens/wc-arugula.jpg",
    painting: "/images/microgreens/wc-arugula-cut.png?v=orig",
    alt: "Watercolor of an arugula microgreen",
  },
  {
    id: "mustard",
    name: "Mustard",
    days: 10,
    image: "/images/microgreens/wc-mustard.jpg",
    painting: "/images/microgreens/wc-mustard-cut.png?v=orig",
    alt: "Watercolor of a mustard microgreen",
  },
  {
    id: "salad-mix",
    name: "Salad Mix",
    days: 10,
    image: "/images/microgreens/wc-salad-mix.jpg",
    painting: "/images/microgreens/wc-salad-mix-cut.png?v=orig",
    alt: "Watercolor of a salad mix microgreen cluster",
  },
  {
    id: "wasabi",
    name: "Wasabi",
    days: 12,
    image: "/images/microgreens/wc-wasabi.jpg",
    painting: "/images/microgreens/wc-wasabi-cut.png?v=orig",
    alt: "Watercolor of a wasabi microgreen",
  },
  {
    id: "cilantro",
    name: "Cilantro",
    days: 21,
    image: "/images/microgreens/wc-cilantro.jpg",
    painting: "/images/microgreens/wc-cilantro-cut.png?v=orig",
    alt: "Watercolor of a cilantro microgreen",
  },
] as const;

type CropId = (typeof CROPS)[number]["id"];

function money(amount: number) {
  return `$${amount.toLocaleString("en-US")}`;
}

function WhiteWatercolor({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="block h-full w-full bg-white"
      style={{
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        maskMode: "luminance",
        WebkitMaskSize: "78%",
        maskSize: "78%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function MicrogreenStorefront() {
  const [selectedId, setSelectedId] = useState<CropId>(CROPS[0].id);
  const selected = CROPS.find((crop) => crop.id === selectedId) ?? CROPS[0];

  return (
    <section
      className="relative isolate overflow-hidden bg-white text-white"
      style={{ minHeight: "calc(100svh - 4rem)" }}
      aria-label="Microgreen trays"
    >
      <div
        className="absolute inset-x-0 top-0 h-[26rem] bg-white lg:inset-0 lg:h-auto lg:[clip-path:polygon(0_0,54%_0,46%_100%,0_100%)]"
        aria-hidden
      />

      <div className="absolute inset-x-0 top-[26rem] bottom-0 lg:inset-0 lg:top-0 lg:[clip-path:polygon(54%_0,100%_0,100%_100%,46%_100%)]">
        <Image
          src="/images/microgreens/microgreen-trays-horizon.jpg"
          alt="Microgreen trays running toward the far end of the bench"
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-cover object-[center_62%]"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
        aria-hidden
      >
        <div className="absolute inset-0 [clip-path:polygon(53.35%_0,54.65%_0,46.65%_100%,45.35%_100%)] bg-white/80 shadow-[0_0_24px_rgba(0,0,0,0.35)]" />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-6 z-[5] h-[22rem] w-[22rem] -translate-x-1/2 lg:left-[24%] lg:top-1/2 lg:h-[min(108vh,980px)] lg:w-[min(108vh,980px)] lg:-translate-x-1/2 lg:-translate-y-1/2">
        {CROPS.map((crop) => (
          <Image
            key={crop.id}
            src={crop.painting}
            alt={crop.alt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 60vw, 352px"
            className={`object-contain transition-opacity duration-700 ${
              crop.id === selectedId ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col justify-end px-6 pb-10 pt-[26rem] sm:px-8 lg:flex-row lg:items-center lg:justify-end lg:py-16 lg:pt-10">
        <div className="w-full max-w-md lg:mr-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60">
            The trays
          </p>
          <h1 className="catalog-display mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
            Microgreens
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            Cut at the bench in Bellevue. One full tray, grown to order.
          </p>
          <p className="catalog-display mt-4 text-3xl">
            {money(TRAY_PRICE)}
            <span className="ml-2 font-sans text-sm font-normal tracking-normal text-white/60">
              full tray
            </span>
          </p>

          <div
            className="mt-6 grid grid-cols-3 gap-3"
            role="listbox"
            aria-label="Microgreen"
          >
            {CROPS.map((crop) => {
              const active = crop.id === selectedId;
              return (
                <button
                  key={crop.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => setSelectedId(crop.id)}
                  className="text-left"
                >
                  <span
                    className={`flex aspect-square items-center justify-center border transition ${
                      active
                        ? "border-white bg-white/10"
                        : "border-white/25 hover:border-white/60"
                    }`}
                  >
                    <WhiteWatercolor src={crop.image} />
                  </span>
                  <span className="mt-2 block min-h-[2.5em] text-lg font-semibold uppercase leading-tight tracking-[0.08em] sm:min-h-0 sm:text-xl">
                    {crop.name}
                  </span>
                  <span className="mt-1 block text-base leading-snug text-white/80">
                    Ready in {crop.days} days
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-lg leading-relaxed text-white">
            {selected.name} trays are ready in about {selected.days} days.
            We sow after you order and cut the tray when it is ready.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <AddToCartButton productId={`microgreen-${selected.id}`} />
            <Link
              href="/contact"
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70 transition hover:text-white"
            >
              Questions?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
