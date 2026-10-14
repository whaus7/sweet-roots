import Image from "next/image";

export default function SoilPage() {
  return (
    <article>
      <header className="relative isolate min-h-[min(88svh,52rem)] overflow-hidden bg-[#1a120c] text-white">
        <Image
          src="/images/services-diagram/soil-amend-hero.jpg"
          alt="Vermicast tea poured onto living garden soil"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/15"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[min(88svh,52rem)] max-w-5xl flex-col justify-end px-6 pb-16 pt-24 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.36em] text-white/65">
            Living soil
          </p>
          <h1 className="catalog-display mt-4 max-w-3xl text-5xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
            The work under the plants
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Vermicast, organisms, and a drench of tea — not another salt
            program. We repair what the chemistry burned through.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8 sm:py-28">
        <p className="catalog-display text-2xl leading-snug text-[var(--catalog-ink)] sm:text-3xl">
          A garden fails from the soil out. We start there.
        </p>
        <div className="mt-12 columns-1 gap-12 text-[17px] leading-[1.75] text-[var(--catalog-muted)] sm:columns-2">
          <p className="mb-6">
            Fresh vermicast goes into beds that have gone thin — worked into the
            root zone, not sprinkled like a garnish. The aim is crumb,
            microbes, and plant-available minerals.
          </p>
          <p className="mb-6">
            After years of synthetics the web is quiet. Repair is slower than a
            bag of NPK: we put the organisms back, then feed them. The plants
            follow.
          </p>
          <p className="mb-6">
            Kickstart is a biology restart. Worms, castings, and a living mix
            so the first season has something to stand on besides leftover
            salts.
          </p>
          <p>
            Tea is vermicast brewed and poured through the root zone — a drench,
            not a mist. It wakes what is already in the soil and carries
            biology where a top-dress cannot reach.
          </p>
        </div>
      </section>

      <figure className="relative isolate min-h-[min(70svh,40rem)] overflow-hidden bg-[#1a120c]">
        <Image
          src="/images/soil-diagram/soil-slice.webp"
          alt="A cross-section of living soil"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"
          aria-hidden
        />
        <blockquote className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-3xl px-6 pb-14 sm:px-8">
          <p className="catalog-display text-3xl leading-snug text-white sm:text-4xl">
            “Biology, not salt, does the work.”
          </p>
        </blockquote>
      </figure>
    </article>
  );
}
