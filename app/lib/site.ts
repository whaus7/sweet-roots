import type { Metadata } from "next";

export const site = {
  name: "Jord Haus Farms",
  url: "https://www.jordhaus.com",
  street: "15410 NE 124th St",
  city: "Redmond",
  region: "WA",
  postalCode: "98052",
  country: "US",
  phoneDisplay: "(312) 415-1093",
  phoneTel: "+13124151093",
  email: "contact@jordhaus.com",
  lat: 47.71454,
  lng: -122.134077,
  mapsUrl:
    "https://www.google.com/maps/place/Jord+Haus+Farms/@47.71454,-122.134077,17z/data=!4m6!3m5!1s0x54900d1e62353e09:0x340b7c16a6ec9892",
  mapsCid: "0x54900d1e62353e09:0x340b7c16a6ec9892",
  hoursDisplay: "Monday to Friday, 10:30 AM to 2 PM",
  hoursNote: "Closed Saturday and Sunday. Pickup is at the farm during open hours.",
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
      opens: "10:30",
      closes: "14:00",
    },
  ],
  shareImage: "/images/home/market-farm.jpg",
  shareImageAlt: "Overhead view of the market farm, with planted rows and hoop houses",
  description:
    "CSA produce, microgreens, composting worms, and continuous-flow worm bins from Jord Haus Farms in Redmond, WA. Pickup at the farm. Worms and bed kits ship in the United States.",
};

export function streetAddress() {
  const street = site.street.trim();
  return street.length > 0 ? street : null;
}

export function cityLine() {
  return `${site.city}, ${site.region} ${site.postalCode}`;
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
