import type { Metadata } from "next";

export const site = {
  name: "Jord Haus Farms",
  url: "https://www.jordhaus.com",
  /** Leave empty until the public farm street address is ready. */
  street: "" as string,
  city: "Redmond",
  region: "WA",
  country: "US",
  phoneDisplay: "312-415-1093",
  phoneTel: "+13124151093",
  email: "contact@jordhaus.com",
  shareImage: "/images/home/market-farm.jpg",
  shareImageAlt: "Overhead view of the market farm, with planted rows and hoop houses",
  description:
    "Jord Haus Farms in Redmond grows composting worms, continuous-flow worm bins, and microgreens. Worms and bed kits ship in the United States. Microgreens are cut at the farm.",
};

export function streetAddress() {
  const street = site.street.trim();
  return street.length > 0 ? street : null;
}

export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      images: [{ url: site.shareImage, alt: site.shareImageAlt }],
    },
  };
}
