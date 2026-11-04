import type { Metadata } from "next";
import { WormsStorefront } from "@/app/components/store/WormsStorefront";

export const metadata: Metadata = {
  title: "Composting Worms",
  description:
    "Live European red wigglers for composting, vermicast, and living soil — from Sweet Roots in Bellevue.",
};

export default function CompostingWormsPage() {
  return <WormsStorefront />;
}
