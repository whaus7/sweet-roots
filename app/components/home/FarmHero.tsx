import Image from "next/image";
import Link from "next/link";

const PRODUCTS = [
  {
    href: "/store/composting-worms",
    title: "Composting worms",
    line: "Live red wigglers for bins and beds.",
    image: "/images/store/worm-bag-coir.jpg",
    alt: "White muslin drawstring bag stamped with the JördHaus logo beside red wigglers in coco coir",
  },
  {
    href: "/store/continuous-flow-bins",
    title: "Continuous-flow beds",
    line: "A bed that stays in production.",
    image: "/images/store/continuous-flow-bin.jpg",
    alt: "Long white continuous-flow worm bin on a metal frame",
  },
  {
    href: "/store/microgreens",
    title: "Microgreens",
    line: "Full trays, cut at the bench.",
    image: "/images/microgreens/microgreen-trays-horizon.jpg",
    alt: "Microgreen trays running toward the far end of the bench",
  },
] as const;

export function FarmHero() {
  return (
    <>
      <section
        className="relative isolate h-[20rem] overflow-hidden text-white sm:h-[24rem]"
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

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6 sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/70">
            Redmond
          </p>
          <h1
            id="farm-hero-title"
            className="catalog-display mt-3 max-w-3xl text-5xl font-medium leading-tight tracking-tight sm:text-6xl"
          >
            Jord Haus Farms
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white">
            Organic farming is all about biology and worms are natures bioreactors. Start your own worm composting bin with our red wigglers.
          </p>
        </div>
      </section>

      <section className="bg-white" aria-label="Farm products">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-10 sm:grid-cols-3 sm:px-8 sm:py-14">
          {PRODUCTS.map((product) => (
            <Link
              key={product.href}
              href={product.href}
              className="group relative block aspect-[4/3] overflow-hidden"
            >
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(min-width: 640px) 30vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <span
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.28)_16%,transparent_34%)]"
                aria-hidden
              />
              <span className="absolute inset-x-0 bottom-0 px-4 py-4 text-white">
                <span className="catalog-display block text-2xl leading-tight">
                  {product.title}
                </span>
                <span className="mt-1 block text-sm leading-snug text-white/85">
                  {product.line}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
