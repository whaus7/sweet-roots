"use client";

import { useState } from "react";
import { CatalogStorefront } from "./CatalogStorefront";
import { centsToAmount, PRODUCTS } from "@/app/lib/store/catalog";

const PACKS = [
  {
    id: "count-100",
    productId: "worms-100" as const,
    name: "100 count",
    caption: "Starter herd for a bin or small bed",
    story:
      "A starter herd of European red wigglers for a bin, raised bed, or small compost pile. Packed live from Redmond.",
  },
  {
    id: "count-300",
    productId: "worms-300" as const,
    name: "300 count",
    caption: "Enough to stock a larger worm bin",
    story:
      "Enough live worms to stock a larger worm bin and start producing vermicast sooner.",
  },
] as const;

export function WormsStorefront() {
  const [selectedId, setSelectedId] = useState<(typeof PACKS)[number]["id"]>(
    PACKS[0].id,
  );
  const selected = PACKS.find((pack) => pack.id === selectedId) ?? PACKS[0];

  return (
    <CatalogStorefront
      label="The farm"
      title="Composting worms"
      intro="Live Eisenia fetida — European red wigglers for composting, vermicast, and living soil."
      price={centsToAmount(PRODUCTS[selected.productId].priceCents)}
      priceNote={selected.name}
      photoSrc="/images/worms/red-wigglers.webp"
      photoAlt="Close view of dark living soil"
      photoDim="bg-black/75"
      overlaySrc="/images/store/worm-bag-coir.jpg"
      overlayAlt="White muslin drawstring bag stamped with the JördHaus logo beside red wigglers in coco coir"
      overlayFit="contain"
      choices={PACKS.map((pack) => ({
        id: pack.id,
        name: pack.name,
        caption: pack.caption,
        stack: [pack.id === "count-100" ? "100" : "300", "Worms"] as const,
      }))}
      selectedId={selected.id}
      onSelect={(id) => setSelectedId(id as (typeof PACKS)[number]["id"])}
      story={selected.story}
      productId={selected.productId}
    />
  );
}
