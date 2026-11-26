import Image from "next/image";
import Link from "next/link";

const PRODUCTS = [
  {
    href: "/store/composting-worms",
    title: "Composting worms",
    line: "Live earthworms eager to amend your soil or start your own compost bin.",
    image: "/images/store/worm-bag-coir.jpg",
    alt: "White muslin drawstring bag stamped with the JördHaus logo beside red wigglers in coco coir",
  },
  {
    href: "/store/continuous-flow-through-worm-bins",
    title: "Continuous-flow beds",
    line: "A worm bin that stays in production with minimal maintenance.",
    image: "/images/store/continuous-flow-bin-frame.jpg",
    alt: "Drawing of a continuous-flow worm bin: steel frame with wood side panels",
  },
  {
    href: "/store/microgreens",
    title: "Microgreens",
    line: "Fresh microgreens and herbs harvested same day of delivery.",
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
            className="group flex h-full flex-col overflow-hidden"
          >
            <span className="relative block aspect-[4/3] overflow-hidden">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(min-width: 640px) 30vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </span>
            <span className="flex flex-1 flex-col bg-[#00340c] px-4 py-4 text-white">
              <span className="catalog-display block text-2xl leading-tight">
                {product.title}
              </span>
              <span className="mt-1.5 block text-lg leading-snug text-white/85">
                {product.line}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
