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
    href: "/store/continuous-flow-through-worm-bins",
    title: "Continuous-flow beds",
    line: "A bed that stays in production.",
    image: "/images/store/continuous-flow-bin-frame.jpg",
    alt: "Drawing of a continuous-flow worm bin: steel frame with wood side panels",
  },
  {
    href: "/store/microgreens",
    title: "Microgreens",
    line: "Full trays, cut at the bench.",
    image: "/images/microgreens/microgreen-tray-closeup.jpg",
    alt: "Close view of a tray of microgreens with round leaves and purple stems",
  },
] as const;

export function FarmProductTiles() {
  return (
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
  );
}
