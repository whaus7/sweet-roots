import { ContactBand } from "@/app/components/contact/ContactBand";
import { pageMeta } from "@/app/lib/site";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Contact Jord Haus Farms in Redmond for composting worms, continuous-flow beds, and microgreens.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      <ContactBand source="contact" titleAs="h1" />
    </div>
  );
}
