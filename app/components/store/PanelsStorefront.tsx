"use client";

import { useState } from "react";
import { CatalogStorefront } from "./CatalogStorefront";
import { centsToAmount, PRODUCTS } from "@/app/lib/store/catalog";

const PANELS = [
  {
    id: "cedar",
    productId: "panels-cedar" as const,
    name: "Cedar cap",
    caption: "Cast panels with a simple cedar rim",
    image: "/images/beds-catalog-cedar.jpg",
    alt: "Cast concrete raised bed with a cedar cap in a backyard garden",
    story:
      "Interlocking cast concrete panels with a cedar cap. The finish we build most — a kit you can set, or talk through with us in Bellevue.",
  },
  {
    id: "concrete",
    productId: "panels-concrete" as const,
    name: "Concrete rim",
    caption: "The same panels without the wood top",
    image: "/images/beds-catalog-concrete.jpg",
    alt: "Cast concrete raised bed with a plain concrete rim in a backyard garden",
    story:
      "The same interlocking panels without the wood top — a cleaner line and a lower starting point. Pickup from the farm, or ask about install.",
  },
] as const;

export function PanelsStorefront() {
  const [selectedId, setSelectedId] = useState<(typeof PANELS)[number]["id"]>(
    "cedar",
  );
  const selected = PANELS.find((panel) => panel.id === selectedId) ?? PANELS[0];

  return (
    <CatalogStorefront
      label="The yard"
      title="Raised bed panels"
      intro="Heavy interlocking cast concrete. Cedar cap or a clean concrete rim. Built to stay."
      price={centsToAmount(PRODUCTS[selected.productId].priceCents)}
      priceNote="typical bed"
      photoSrc={selected.image}
      photoAlt={selected.alt}
      overlaySrc={selected.image}
      overlayAlt={selected.alt}
      choices={PANELS.map((panel) => ({
        id: panel.id,
        name: panel.name,
        caption: panel.caption,
        thumb: panel.image,
        thumbAlt: panel.alt,
      }))}
      selectedId={selected.id}
      onSelect={(id) => setSelectedId(id as (typeof PANELS)[number]["id"])}
      story={selected.story}
      productId={selected.productId}
    />
  );
}
