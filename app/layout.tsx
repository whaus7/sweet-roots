import type { Metadata } from "next";
import { Geist, Open_Sans, Faculty_Glyphic, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  //subsets: ["latin"],
});

const fac = Faculty_Glyphic({
  weight: "400",
});

const outfit = Outfit({
  //weight: "600",
});

export const metadata: Metadata = {
  title: "Soil Healh Dashboard",
  description:
    "Grade the health of your soil and learn about some tips to improve low scores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
