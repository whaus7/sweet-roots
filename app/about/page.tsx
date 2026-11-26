import Image from "next/image";
import Link from "next/link";
import { CatalogShell } from "@/app/components/catalog/CatalogShell";
import { cityLine, pageMeta, site, streetAddress } from "@/app/lib/site";

export const metadata = pageMeta({
  title: "About the farm",
  description:
    "Jord Haus Farms in Redmond is named for Moder Jord, Mother Earth. We farm to repair the soil with compost, cover crops, and worm castings.",
  path: "/about",
});

export default function AboutPage() {
  const street = streetAddress();

  return (
    <CatalogShell>
      <div className="lg:grid lg:grid-cols-[auto_minmax(20rem,1fr)]">
        <div className="flex items-center justify-center bg-white px-4 py-8 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:px-6">
          <Image
            src="/images/about/moder-jord.jpg"
            alt="Moder Jord, a green Mother Earth figure seated with the world in her lap, leaf hair, and a sun and moon on her chest"
            width={2200}
            height={2200}
            priority
            className="h-auto w-[88vw] max-w-none object-contain lg:w-[min(64rem,calc(100vw-32rem))]"
          />
        </div>

        <article className="flex items-center px-6 py-16 text-[#1c1812] sm:px-10 sm:py-20 lg:min-h-[calc(100vh-4rem)] lg:px-14 lg:py-24">
          <div className="mx-auto w-full max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5c5348]">
              Moder Jord
            </p>
            <h1 className="catalog-display mt-3 text-4xl leading-tight sm:text-5xl">
              Mother Earth is where this farm starts
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#3c342c]">
              Moder Jord means Mother Earth in the Nordic countries. She sits
              with the world in her lap. Jörd is the old name for the earth
              itself, and it is the name on our gate. That figure is my root as
              the farmer. We grow food by leaving the ground more alive than we
              found it.
            </p>

            <section className="mt-12">
              <h2 className="catalog-display text-2xl">Repair the ground we harvest from</h2>
              <p className="mt-3 text-base leading-relaxed text-[#3c342c]">
                A season here is supposed to repair the earth that grew the
                food. Compost and worm castings go back into the rows. Cover
                crops hold the soil between plantings. European red wigglers
                turn scraps into vermicast, and that casting feeds a root the
                way a living soil does: slowly, with the biology still in it.
                The beds, the microgreen bench, and the worm work all start
                from that same return.
              </p>
            </section>

            <section className="mt-10">
              <h2 className="catalog-display text-2xl">The same soil, carried out</h2>
              <p className="mt-3 text-base leading-relaxed text-[#3c342c]">
                <Link
                  href="/csa"
                  className="underline decoration-[#1c1812]/30 underline-offset-4 hover:decoration-[#1c1812]"
                >
                  CSA produce
                </Link>{" "}
                comes off those beds and is picked up at the farm. Microgreen
                trays are cut at the bench.{" "}
                <Link
                  href="/store/composting-worms"
                  className="underline decoration-[#1c1812]/30 underline-offset-4 hover:decoration-[#1c1812]"
                >
                  Live composting worms
                </Link>{" "}
                and the continuous-flow bins leave the gate so a pile somewhere
                else can start giving the soil back too.
              </p>
            </section>

            <p className="mt-12 text-base leading-relaxed text-[#3c342c]">
              {[site.name, street, cityLine()].filter(Boolean).join(", ")}. Open{" "}
              {site.hoursDisplay}. {site.hoursNote}
            </p>
          </div>
        </article>
      </div>
    </CatalogShell>
  );
}
