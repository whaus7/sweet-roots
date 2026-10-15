import type { Metadata } from "next";
import { CatalogShell } from "@/app/components/catalog/CatalogShell";

export const metadata: Metadata = {
  title: "Living Soil",
  description:
    "Living soil for new beds or a full reset of existing ones, plus optional monthly bed care — JördHaus in Bellevue.",
};

export default function SoilLayout({ children }: { children: React.ReactNode }) {
  return <CatalogShell>{children}</CatalogShell>;
}
