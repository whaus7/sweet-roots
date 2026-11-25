import { ContactBand } from "@/app/components/contact/ContactBand";
import { FarmMap } from "@/app/components/contact/FarmMap";
import { pageMeta } from "@/app/lib/site";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Contact Jord Haus Farms in Redmond for CSA produce, composting worms, continuous-flow beds, and microgreens. Pickup at 15410 NE 124th St.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      <ContactBand source="contact" titleAs="h1" />
      <FarmMap />
    </div>
  );
}
