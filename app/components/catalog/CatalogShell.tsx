import { Fraunces } from "next/font/google";
import "./catalog.css";

const serif = Fraunces({
  variable: "--font-catalog-serif",
  subsets: ["latin"],
});

export function CatalogShell({ children }: { children: React.ReactNode }) {
  return <div className={`${serif.variable} catalog`}>{children}</div>;
}
