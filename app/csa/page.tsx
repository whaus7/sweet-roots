import Image from "next/image";
import Link from "next/link";
import { CatalogShell } from "@/app/components/catalog/CatalogShell";
import { ContactBand } from "@/app/components/contact/ContactBand";
import { StoreFaq } from "@/app/components/store/StoreFaq";
import { CSA_FAQS } from "@/app/lib/faqs";
import { cityLine, pageMeta, site, streetAddress } from "@/app/lib/site";

const description =
  "CSA produce from Jord Haus Farms in Redmond. Seasonal shares from living soil, picked up at the farm. Get in touch to join.";

export const metadata = pageMeta({
  title: "CSA produce in Redmond",
  description,
  path: "/csa",
});

export default function CsaPage() {
  const street = streetAddress();

  return (
    <>
      <CatalogShell>
        <article className="mx-auto max-w-2xl px-6 py-16 text-[#1c1812] sm:px-8 sm:py-24">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5c5348]">
            Community supported agriculture
          </p>
          <h1 className="catalog-display mt-3 text-4xl leading-tight sm:text-5xl">
            CSA produce from the Redmond farm
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#3c342c]">
            A CSA share is how you eat from Jord Haus Farms. Seasonal produce
            from beds we run with worms and living soil. Pickup at the farm. No
            published prices. Tell us you want in and we will walk you through
            the season.
          </p>

          <Image
            src="/images/csa/harvest-crate.jpg"
            alt="A harvest crate of tomatoes, cucumbers, beans, peppers, and blackberries from the farm"
            width={768}
            height={1024}
            priority
            className="mt-10 h-auto w-full"
          />

          <div className="mt-12 space-y-10" id="how-it-works">
            <section>
              <h2 className="catalog-display text-2xl">How a share works</h2>
              <p className="mt-3 text-base leading-relaxed text-[#3c342c]">
                You join for a season. Each pickup is what the beds are ready to
                cut that week, not a fixed grocery list. Biology first: the same
                red wigglers and vermicast that feed the market farm feed your
                share.
              </p>
            </section>
            <section>
              <h2 className="catalog-display text-2xl">Pickup at the farm</h2>
              <p className="mt-3 text-base leading-relaxed text-[#3c342c]">
                Shares are picked up at{" "}
                {[site.name, street, cityLine()].filter(Boolean).join(", ")}. Open{" "}
                {site.hoursDisplay}. {site.hoursNote} We confirm your window when
                you join.
              </p>
            </section>
            <section>
              <h2 className="catalog-display text-2xl">Produce and trays</h2>
              <p className="mt-3 text-base leading-relaxed text-[#3c342c]">
                CSA shares are market-farm produce.{" "}
                <Link
                  href="/store/microgreens"
                  className="underline decoration-[#1c1812]/30 underline-offset-4 hover:decoration-[#1c1812]"
                >
                  Microgreen trays
                </Link>{" "}
                are a separate grow-to-order pickup. You can join the CSA, order
                trays, or both.
              </p>
            </section>
          </div>

          <p className="mt-12">
            <Link
              href="/contact"
              className="catalog-display text-xl underline decoration-[#1c1812]/30 underline-offset-4 hover:decoration-[#1c1812]"
            >
              Get in touch to join
            </Link>
          </p>
        </article>
        <StoreFaq faqs={CSA_FAQS} heading="CSA questions" />
      </CatalogShell>
      <ContactBand source="contact" />
    </>
  );
}
