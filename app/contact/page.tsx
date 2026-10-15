import type { Metadata } from "next";
import { ContactBand } from "@/app/components/contact/ContactBand";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with JördHaus for raised bed installation and living-soil work in Bellevue, WA.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      <ContactBand source="contact" titleAs="h1" />
    </div>
  );
}
