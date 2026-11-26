import Image from "next/image";
import Link from "next/link";

export function FarmHero() {
  return (
    <section
      className="relative isolate overflow-hidden text-white"
      aria-labelledby="farm-hero-title"
    >
      <Image
        src="/images/home/market-farm.jpg"
        alt="Overhead view of the market farm, with planted rows and hoop houses"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/65" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[32rem] w-full max-w-7xl flex-col justify-center px-6 py-16 sm:min-h-[36rem] sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
          Redmond
        </p>
        <h1
          id="farm-hero-title"
          className="catalog-display mt-3 max-w-5xl text-5xl font-medium leading-tight tracking-tight sm:text-6xl"
        >
          Our Farm to Your Family&apos;s Table
        </h1>
        {/* <p className="catalog-display mt-4 max-w-3xl text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Jord Haus Farms
        </p> */}
        <p className="mt-5 max-w-5xl text-xl leading-relaxed text-white">
          Seasonal CSA produce from your local farm using regenerative farming practices. 
          Visit the farm and see where your food comes from. 
          Learn about how we amend the soil, add compost, use cover crops, and more.
          See the worms, soil, and biology that run the rest of the farm.
          Get in touch to join this seasons CSA.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#00340c] shadow-sm transition hover:bg-white/90"
          >
            Get in touch
          </Link>
          <Link
            href="/csa"
            className="inline-flex items-center justify-center rounded-md border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            How the CSA works
          </Link>
        </div>
      </div>
    </section>
  );
}
