import { CatalogShell } from "@/app/components/catalog/CatalogShell";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CatalogShell>{children}</CatalogShell>;
}
