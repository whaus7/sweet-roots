import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { UserProvider } from "./contexts/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sweet Roots",
  description:
    "Grade the health of your soil and learn about some tips to improve low scores",
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
        <GoogleOAuthProvider clientId={googleClientId || ""}>
          <UserProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </UserProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
