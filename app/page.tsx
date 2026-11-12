import { CatalogShell } from "./components/catalog/CatalogShell";
import { ContactBand } from "./components/contact/ContactBand";
import { FarmHero } from "./components/home/FarmHero";
import { site } from "./lib/site";

export const metadata = {
  title: {
    absolute: `${site.name} | Worms, continuous-flow beds, and microgreens`,
  },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <CatalogShell>
        <FarmHero />
      </CatalogShell>
      <ContactBand />
    </>
  );
}
