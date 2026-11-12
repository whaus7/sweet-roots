import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ChatWidget } from "./components/chat/ChatWidget";
import { CartDrawer } from "./components/cart/CartDrawer";
import { CartProvider } from "./contexts/CartContext";
import { UserProvider } from "./contexts/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { JsonLd } from "./components/seo/JsonLd";
import { site } from "./lib/site";
import { localBusinessJsonLd } from "./lib/seo";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Worms, continuous-flow beds, and microgreens`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.url,
    title: `${site.name} | Worms, continuous-flow beds, and microgreens`,
    description: site.description,
    images: [{ url: site.shareImage, alt: site.shareImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    images: [site.shareImage],
  },
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
        <JsonLd data={localBusinessJsonLd()} />
        <GoogleAnalytics gaId="G-GKQ7ZP4C3Q" />
        <GoogleOAuthProvider clientId={googleClientId || ""}>
          <UserProvider>
            <CartProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
              <ChatWidget />
            </CartProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
