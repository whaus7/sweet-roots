import Image from "next/image";
import Link from "next/link";

const TILES = [
  {
    href: "/store/composting-worms",
    title: "Composting worms",
    line: "Live European red wigglers for bins, beds, and vermicast.",
    image: "/images/worms/red-wigglers.webp",
    alt: "European red wiggler composting worms",
  },
  {
    href: "/store/raised-bed-panels",
    title: "Raised bed panels",
    line: "Interlocking cast concrete, with a cedar cap or a concrete rim.",
    image: "/images/beds-catalog-cedar.jpg",
    alt: "Cast concrete raised bed with a cedar cap",
  },
] as const;

export function FarmStoreSection() {
  return (
    <section
      className="bg-[#f4efe4] text-[#1c1812]"
      aria-labelledby="farm-store-heading"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#5c5348]">
          Farm store
        </p>
        <h2
          id="farm-store-heading"
          className="catalog-display mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
        >
          From the farm
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5c5348] sm:text-lg">
          Composting worms and raised bed panels, alongside the trays.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group overflow-hidden bg-white shadow-sm transition hover:shadow-md"
            >
              <span className="relative block aspect-[16/10]">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </span>
              <span className="block px-6 py-6 sm:px-8 sm:py-8">
                <span className="catalog-display block text-2xl font-medium tracking-tight sm:text-3xl">
                  {tile.title}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-[#5c5348] sm:text-base">
                  {tile.line}
                </span>
                <span className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1c1812] underline decoration-[#1c1812]/30 underline-offset-4 group-hover:decoration-[#1c1812]">
                  Shop
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
