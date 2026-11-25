import { JsonLd } from "@/app/components/seo/JsonLd";
import { faqJsonLd } from "@/app/lib/seo";
import type { FaqItem } from "@/app/lib/faqs";

export function StoreFaq({
  faqs,
  heading = "Questions",
}: {
  faqs: readonly FaqItem[];
  heading?: string;
}) {
  return (
    <section
      className="border-t border-[#d9d0c0] bg-white px-6 py-16 text-[#1c1812] sm:px-8 sm:py-24"
      aria-labelledby="store-faq-heading"
    >
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="mx-auto max-w-2xl">
        <h2
          id="store-faq-heading"
          className="catalog-display text-3xl leading-tight sm:text-4xl"
        >
          {heading}
        </h2>
        <div className="mt-10 divide-y divide-[#d9d0c0] border-y border-[#d9d0c0]">
          {faqs.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="cursor-pointer list-none font-semibold leading-snug text-[#00340c] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-4">
                  <span className="text-base sm:text-lg">{item.question}</span>
                  <span
                    className="mt-1 shrink-0 text-xl leading-none text-[#5c5348] transition group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-base leading-relaxed text-[#3c342c]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
