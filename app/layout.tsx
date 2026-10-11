import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { UserProvider } from "./contexts/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleAnalytics } from "@next/third-parties/google";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jordhaus | Raised Beds in Bellevue, WA",
    template: "%s | Jordhaus",
  },
  description:
    "Raised bed installation in Bellevue, WA. Cast concrete beds and living-soil work, built on site — we don't ship panels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <GoogleAnalytics gaId="G-GKQ7ZP4C3Q" />
        <GoogleOAuthProvider clientId={googleClientId || ""}>
          <UserProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </UserProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
