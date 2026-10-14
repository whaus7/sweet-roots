import type { Metadata } from "next";
import { CatalogShell } from "@/app/components/catalog/CatalogShell";

export const metadata: Metadata = {
  title: "Living Soil",
  description:
    "Vermicast, tea, and living-soil repair — how JördHaus rebuilds the biology under the garden.",
};

export default function SoilLayout({ children }: { children: React.ReactNode }) {
  return <CatalogShell>{children}</CatalogShell>;
}
