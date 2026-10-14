import type { Metadata } from "next";
import { CatalogShell } from "@/app/components/catalog/CatalogShell";

export const metadata: Metadata = {
  title: "Raised Beds",
  description:
    "Cast concrete raised beds, built on site in Bellevue. Cedar cap or concrete rim — meant to stay for decades.",
};

export default function BedsLayout({ children }: { children: React.ReactNode }) {
  return <CatalogShell>{children}</CatalogShell>;
}
