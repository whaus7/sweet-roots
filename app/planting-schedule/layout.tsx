import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./planting-schedule.css";

const serif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planting Window",
  description:
    "What to plant today: flavor-first vegetables, fruit, and Asian winter greens, ranked by recent average temperatures in your city.",
};

export default function PlantingScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${serif.variable} planting-schedule antialiased`}>
      {children}
    </div>
  );
}
