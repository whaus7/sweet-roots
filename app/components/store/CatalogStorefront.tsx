"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/app/components/cart/AddToCartButton";

export type CatalogChoice = {
  id: string;
  name: string;
  caption: string;
  thumb?: string;
  thumbAlt?: string;
};

type CatalogStorefrontProps = {
  label: string;
  title: string;
  intro: string;
  price: number;
  priceNote: string;
  photoSrc: string;
  photoAlt: string;
  overlaySrc?: string;
  overlayAlt?: string;
  overlayUnoptimized?: boolean;
  choices: readonly CatalogChoice[];
  selectedId: string;
  onSelect: (id: string) => void;
  story: string;
  productId: string;
  choiceColumns?: 2 | 3;
};

function money(amount: number) {
  if (Number.isInteger(amount)) return `$${amount.toLocaleString("en-US")}`;
  return `$${amount.toFixed(2)}`;
}

export function CatalogStorefront({
  label,
  title,
  intro,
  price,
  priceNote,
  photoSrc,
  photoAlt,
  overlaySrc,
  overlayAlt,
  overlayUnoptimized = false,
  choices,
  selectedId,
  onSelect,
  story,
  productId,
  choiceColumns = 2,
}: CatalogStorefrontProps) {
  const columns =
    choiceColumns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <section
      className="relative isolate overflow-hidden bg-white text-white"
      style={{ minHeight: "calc(100svh - 4rem)" }}
      aria-label={title}
    >
      <div
        className="absolute inset-x-0 top-0 h-[26rem] bg-white lg:inset-0 lg:h-auto lg:[clip-path:polygon(0_0,54%_0,46%_100%,0_100%)]"
        aria-hidden
      />

      <div className="absolute inset-x-0 top-[26rem] bottom-0 lg:inset-0 lg:top-0 lg:[clip-path:polygon(54%_0,100%_0,100%_100%,46%_100%)]">
        <Image
          src={photoSrc}
          alt={photoAlt}
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
        aria-hidden
      >
        <div className="absolute inset-0 [clip-path:polygon(53.35%_0,54.65%_0,46.65%_100%,45.35%_100%)] bg-white/80 shadow-[0_0_24px_rgba(0,0,0,0.35)]" />
      </div>

      {overlaySrc ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[26rem] lg:hidden">
            <Image
              src={overlaySrc}
              alt={overlayAlt ?? ""}
              fill
              unoptimized={overlayUnoptimized}
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[5] hidden lg:block lg:[clip-path:polygon(0_0,54%_0,46%_100%,0_100%)]"
            aria-hidden
          >
            <Image
              src={overlaySrc}
              alt=""
              fill
              unoptimized={overlayUnoptimized}
              sizes="54vw"
              className="object-cover"
            />
          </div>
        </>
      ) : null}

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-7xl flex-col justify-end px-6 pb-10 pt-[26rem] sm:px-8 lg:flex-row lg:items-center lg:justify-end lg:py-16 lg:pt-10">
        <div className="w-full max-w-md lg:mr-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/60">
            {label}
          </p>
          <h1 className="catalog-display mt-3 text-4xl font-medium tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            {intro}
          </p>
          <p className="catalog-display mt-4 text-3xl">
            {money(price)}
            <span className="ml-2 font-sans text-sm font-normal tracking-normal text-white/60">
              {priceNote}
            </span>
          </p>

          <div
            className={`mt-6 grid ${columns} gap-3`}
            role="listbox"
            aria-label={title}
          >
            {choices.map((choice) => {
              const active = choice.id === selectedId;
              return (
                <button
                  key={choice.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => onSelect(choice.id)}
                  className="text-left"
                >
                  {choice.thumb ? (
                    <span
                      className={`relative flex aspect-square items-center justify-center overflow-hidden border transition ${
                        active
                          ? "border-white bg-white/10"
                          : "border-white/25 hover:border-white/60"
                      }`}
                    >
                      <Image
                        src={choice.thumb}
                        alt={choice.thumbAlt ?? choice.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      className={`flex min-h-24 items-end border px-3 py-3 transition ${
                        active
                          ? "border-white bg-white/10"
                          : "border-white/25 hover:border-white/60"
                      }`}
                    >
                      <span className="sr-only">{choice.name}</span>
                    </span>
                  )}
                  <span className="mt-2 block text-lg font-semibold uppercase leading-tight tracking-[0.08em] sm:text-xl">
                    {choice.name}
                  </span>
                  <span className="mt-1 block text-base leading-snug text-white/80">
                    {choice.caption}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-lg leading-relaxed text-white">{story}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <AddToCartButton productId={productId} />
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
