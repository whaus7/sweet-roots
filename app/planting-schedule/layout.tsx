import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./planting-schedule.css";

const sans = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planting Window | Sweet Roots",
  description:
    "What to plant today: flavor-first vegetables, fruit, and Asian winter greens, timed to your climate and an unheated greenhouse.",
};

export default function PlantingScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${sans.variable} ${serif.variable} planting-schedule antialiased`}
    >
      {children}
    </div>
  );
}
