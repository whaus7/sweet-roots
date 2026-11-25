import { CatalogShell } from "@/app/components/catalog/CatalogShell";
import { cityLine, pageMeta, site, streetAddress } from "@/app/lib/site";

export const metadata = pageMeta({
  title: "About the farm",
  description:
    "Jord Haus Farms in Redmond grows CSA produce, microgreens, composting worms, and continuous-flow worm bins from living soil.",
  path: "/about",
});

export default function AboutPage() {
  const street = streetAddress();

  return (
    <CatalogShell>
      <article className="mx-auto max-w-2xl px-6 py-16 text-[#1c1812] sm:px-8 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5c5348]">
          Redmond, WA
        </p>
        <h1 className="catalog-display mt-3 text-4xl leading-tight sm:text-5xl">
          About Jord Haus Farms
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#3c342c]">
          We grow food and soil biology on a Redmond plot. CSA produce is the
          farm. Microgreen trays, composting worms, and continuous-flow beds are
          how that same system leaves the gate.
        </p>

        <div className="mt-12 space-y-10">
          <section>
            <h2 className="catalog-display text-2xl">Living soil first</h2>
            <p className="mt-3 text-base leading-relaxed text-[#3c342c]">
              European red wigglers (Eisenia fetida) turn scraps into vermicast.
              That casting is a living inoculant, not a bag of salt. The CSA
              beds, the microgreen bench, and the worm kits all start there.
            </p>
          </section>
          <section>
            <h2 className="catalog-display text-2xl">Four offerings</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-[#3c342c]">
              <li>CSA produce, picked up at the farm</li>
              <li>Microgreen trays, grown to order and cut at the bench</li>
              <li>Live composting worms, packed here and shipped in the US</li>
              <li>Continuous flow-through worm bins, built here and shipped in the US</li>
            </ul>
          </section>
          <section>
            <h2 className="catalog-display text-2xl">The farm</h2>
            <p className="mt-3 text-base leading-relaxed text-[#3c342c]">
              {[site.name, street, cityLine()].filter(Boolean).join(", ")}. Open{" "}
              {site.hoursDisplay}. {site.hoursNote}
            </p>
          </section>
        </div>
      </article>
    </CatalogShell>
  );
}
