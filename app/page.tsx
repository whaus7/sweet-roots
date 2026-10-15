import { ContactBand } from "./components/contact/ContactBand";
import { SplitServicesHero } from "./components/home/SplitServicesHero";
import { SystemBenefits } from "./components/home/SystemBenefits";

export default function Home() {
  return (
    <>
      <SplitServicesHero />
      <SystemBenefits />
      <ContactBand />
    </>
  );
}
