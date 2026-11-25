import { CatalogShell } from "./components/catalog/CatalogShell";
import { ContactBand } from "./components/contact/ContactBand";
import { FarmHero } from "./components/home/FarmHero";
import { FarmProductTiles } from "./components/home/FarmProductTiles";
import { site } from "./lib/site";

export const metadata = {
  title: {
    absolute: `${site.name} | CSA produce, microgreens, worms, and flow-through bins`,
  },
  description: site.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <CatalogShell>
        <FarmHero />
        <FarmProductTiles />
      </CatalogShell>
      <ContactBand />
    </>
  );
}
