import { site, streetAddress } from "@/app/lib/site";

export function localBusinessJsonLd() {
  const street = streetAddress();
  return {
    "@context": "https://schema.org",
    "@type": "Farm",
    name: site.name,
    url: site.url,
    image: `${site.url}${site.shareImage}`,
    telephone: site.phoneTel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      ...(street ? { streetAddress: street } : {}),
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
  };
}

export function productJsonLd({
  name,
  description,
  path,
  image,
  lowPrice,
  highPrice,
  shipsInUs,
}: {
  name: string;
  description: string;
  path: string;
  image: string;
  lowPrice?: string;
  highPrice?: string;
  shipsInUs?: boolean;
}) {
  const offers =
    lowPrice == null
      ? undefined
      : highPrice && highPrice !== lowPrice
        ? {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            lowPrice,
            highPrice,
            offerCount: 2,
            url: `${site.url}${path}`,
            ...(shipsInUs
              ? { areaServed: { "@type": "Country", name: "United States" } }
              : {}),
          }
        : {
            "@type": "Offer",
            priceCurrency: "USD",
            price: lowPrice,
            availability: "https://schema.org/InStock",
            url: `${site.url}${path}`,
            ...(shipsInUs
              ? { areaServed: { "@type": "Country", name: "United States" } }
              : {
                  availableAtOrFrom: {
                    "@type": "Place",
                    name: site.name,
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: site.city,
                      addressRegion: site.region,
                      addressCountry: site.country,
                    },
                  },
                }),
          };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${site.url}${image}`,
    brand: { "@type": "Brand", name: site.name },
    ...(offers ? { offers } : {}),
  };
}

export function faqJsonLd(questions: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
