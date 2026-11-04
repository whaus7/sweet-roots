import { CatalogShell } from "./components/catalog/CatalogShell";
import { ContactBand } from "./components/contact/ContactBand";
import { MicrogreenStorefront } from "./components/home/MicrogreenStorefront";
import { FarmStoreSection } from "./components/store/FarmStoreSection";

export default function Home() {
  return (
    <>
      <CatalogShell>
        <MicrogreenStorefront />
        <FarmStoreSection />
      </CatalogShell>
      <ContactBand />
    </>
  );
}
