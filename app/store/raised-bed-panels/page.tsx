import type { Metadata } from "next";
import { PanelsStorefront } from "@/app/components/store/PanelsStorefront";

export const metadata: Metadata = {
  title: "Raised Bed Panels",
  description:
    "Interlocking cast concrete raised bed panels with a cedar cap or concrete rim — from Sweet Roots in Redmond.",
  robots: { index: false, follow: false },
};

export default function RaisedBedPanelsPage() {
  return <PanelsStorefront />;
}
