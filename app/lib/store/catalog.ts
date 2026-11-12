export type ProductCategory = "microgreens" | "worms" | "panels";

export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  href: string;
  category: ProductCategory;
  maxQty: number;
};

export const PRODUCTS = {
  "microgreen-radish": {
    id: "microgreen-radish",
    sku: "MG-RADISH",
    name: "Radish microgreen tray",
    description: "Full tray, grown to order. Ready in about 8 days.",
    priceCents: 2900,
    image: "/images/microgreens/wc-radish.jpg",
    href: "/store/microgreens",
    category: "microgreens",
    maxQty: 12,
  },
  "microgreen-arugula": {
    id: "microgreen-arugula",
    sku: "MG-ARUGULA",
    name: "Arugula microgreen tray",
    description: "Full tray, grown to order. Ready in about 10 days.",
    priceCents: 2900,
    image: "/images/microgreens/wc-arugula.jpg",
    href: "/store/microgreens",
    category: "microgreens",
    maxQty: 12,
  },
  "microgreen-mustard": {
    id: "microgreen-mustard",
    sku: "MG-MUSTARD",
    name: "Mustard microgreen tray",
    description: "Full tray, grown to order. Ready in about 10 days.",
    priceCents: 2900,
    image: "/images/microgreens/wc-mustard.jpg",
    href: "/store/microgreens",
    category: "microgreens",
    maxQty: 12,
  },
  "microgreen-salad-mix": {
    id: "microgreen-salad-mix",
    sku: "MG-SALAD-MIX",
    name: "Salad Mix microgreen tray",
    description: "Full tray, grown to order. Ready in about 10 days.",
    priceCents: 2900,
    image: "/images/microgreens/wc-salad-mix.jpg",
    href: "/store/microgreens",
    category: "microgreens",
    maxQty: 12,
  },
  "microgreen-wasabi": {
    id: "microgreen-wasabi",
    sku: "MG-WASABI",
    name: "Wasabi microgreen tray",
    description: "Full tray, grown to order. Ready in about 12 days.",
    priceCents: 2900,
    image: "/images/microgreens/wc-wasabi.jpg",
    href: "/store/microgreens",
    category: "microgreens",
    maxQty: 12,
  },
  "microgreen-cilantro": {
    id: "microgreen-cilantro",
    sku: "MG-CILANTRO",
    name: "Cilantro microgreen tray",
    description: "Full tray, grown to order. Ready in about 21 days.",
    priceCents: 2900,
    image: "/images/microgreens/wc-cilantro.jpg",
    href: "/store/microgreens",
    category: "microgreens",
    maxQty: 12,
  },
  "worms-100": {
    id: "worms-100",
    sku: "WRM-100",
    name: "Composting worms, 100 count",
    description:
      "A starter herd of European red wigglers for a bin, raised bed, or small compost pile.",
    priceCents: 1995,
    image: "/images/worms/red-wigglers.webp",
    href: "/store/composting-worms",
    category: "worms",
    maxQty: 10,
  },
  "worms-300": {
    id: "worms-300",
    sku: "WRM-300",
    name: "Composting worms, 300 count",
    description:
      "Enough live Eisenia fetida to stock a larger worm bin and start producing vermicast sooner.",
    priceCents: 3495,
    image: "/images/worms/red-wigglers.webp",
    href: "/store/composting-worms",
    category: "worms",
    maxQty: 10,
  },
  "panels-cedar": {
    id: "panels-cedar",
    sku: "BED-CEDAR",
    name: "Raised bed panels, cedar cap",
    description:
      "Interlocking cast concrete panels with a cedar cap. Pickup from the Redmond farm.",
    priceCents: 260000,
    image: "/images/beds-catalog-cedar.jpg",
    href: "/store/raised-bed-panels",
    category: "panels",
    maxQty: 4,
  },
  "panels-concrete": {
    id: "panels-concrete",
    sku: "BED-CONCRETE",
    name: "Raised bed panels, concrete rim",
    description:
      "The same interlocking panels without the wood top. Pickup from the Redmond farm.",
    priceCents: 190000,
    image: "/images/beds-catalog-concrete.jpg",
    href: "/store/raised-bed-panels",
    category: "panels",
    maxQty: 4,
  },
} as const satisfies Record<string, Product>;

export type ProductId = keyof typeof PRODUCTS;

export type CartLine = {
  productId: ProductId;
  quantity: number;
};

export function isProductId(id: string): id is ProductId {
  return id in PRODUCTS;
}

export function getProduct(id: string): Product | undefined {
  return isProductId(id) ? PRODUCTS[id] : undefined;
}

export function centsToAmount(cents: number) {
  return cents / 100;
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function parseCartItems(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];

  const merged = new Map<ProductId, number>();

  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const record = row as { productId?: unknown; quantity?: unknown };
    const productId =
      typeof record.productId === "string" ? record.productId : "";
    const product = getProduct(productId);
    if (!product) continue;

    const quantity = Number(record.quantity);
    if (!Number.isFinite(quantity)) continue;

    const next = Math.min(product.maxQty, Math.max(0, Math.floor(quantity)));
    if (next <= 0) continue;

    const id = product.id as ProductId;
    merged.set(id, Math.min(product.maxQty, (merged.get(id) ?? 0) + next));
  }

  return [...merged.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export function cartSubtotalCents(lines: CartLine[]) {
  return lines.reduce((sum, line) => {
    return sum + PRODUCTS[line.productId].priceCents * line.quantity;
  }, 0);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
