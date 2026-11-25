import { site, streetAddress } from "@/app/lib/site";

export function localBusinessJsonLd() {
  const street = streetAddress();
  const mapsUrl = site.mapsUrl;

  return {
    "@context": "https://schema.org",
    "@type": "Farm",
    "@id": `${site.url}/#farm`,
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
      postalCode: site.postalCode,
      addressCountry: site.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.lat,
      longitude: site.lng,
    },
    hasMap: mapsUrl,
    sameAs: [mapsUrl],
    openingHoursSpecification: site.openingHours.map((block) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...block.days],
      opens: block.opens,
      closes: block.closes,
    })),
    areaServed: [
      { "@type": "City", name: site.city },
      { "@type": "AdministrativeArea", name: "Eastside" },
      { "@type": "State", name: "Washington" },
    ],
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
  shippingCents,
}: {
  name: string;
  description: string;
  path: string;
  image: string;
  lowPrice?: string;
  highPrice?: string;
  shipsInUs?: boolean;
  shippingCents?: number;
}) {
  const returnPolicy = {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnUnlimitedWindow",
    returnFees: "https://schema.org/FreeReturn",
    refundType: "https://schema.org/FullRefund",
    merchantReturnLink: `${site.url}/terms#returns`,
  };
  const shippingDetails =
    shipsInUs && shippingCents != null
      ? {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: (shippingCents / 100).toFixed(2),
            currency: "USD",
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "US",
          },
        }
      : undefined;
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
            ...(shippingDetails ? { shippingDetails } : {}),
            hasMerchantReturnPolicy: returnPolicy,
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
                      ...(streetAddress()
                        ? { streetAddress: streetAddress() }
                        : {}),
                      addressLocality: site.city,
                      addressRegion: site.region,
                      postalCode: site.postalCode,
                      addressCountry: site.country,
                    },
                  },
                }),
            ...(shippingDetails ? { shippingDetails } : {}),
            hasMerchantReturnPolicy: returnPolicy,
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

export function faqJsonLd(
  questions: readonly { question: string; answer: string }[],
) {
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
