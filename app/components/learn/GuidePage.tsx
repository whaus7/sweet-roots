import Link from "next/link";
import { CatalogShell } from "@/app/components/catalog/CatalogShell";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { faqJsonLd } from "@/app/lib/seo";

export type GuideSection = {
  heading: string;
  paragraphs: string[];
};

export function GuidePage({
  kicker,
  title,
  lede,
  shopHref,
  shopLabel,
  sections,
  faqs,
}: {
  kicker: string;
  title: string;
  lede: string;
  shopHref: string;
  shopLabel: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
}) {
  return (
    <CatalogShell>
      <JsonLd data={faqJsonLd(faqs)} />
      <article className="mx-auto max-w-2xl px-6 py-16 text-[#1c1812] sm:px-8 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#5c5348]">
          {kicker}
        </p>
        <h1 className="catalog-display mt-3 text-4xl leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#3c342c]">{lede}</p>
        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="catalog-display text-2xl">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-base leading-relaxed text-[#3c342c]">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-12">
          <Link
            href={shopHref}
            className="catalog-display text-xl underline decoration-[#1c1812]/30 underline-offset-4 hover:decoration-[#1c1812]"
          >
            {shopLabel}
          </Link>
        </p>
      </article>
    </CatalogShell>
  );
}
