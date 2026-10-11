import { ContactBand } from "./components/contact/ContactBand";
import { SplitServicesHero } from "./components/home/SplitServicesHero";
import { SoilDiagram } from "./components/soil-diagram/SoilDiagram";

export default function Home() {
  return (
    <>
      <SplitServicesHero />
      <SoilDiagram />
      <ContactBand />
    </>
  );
}
