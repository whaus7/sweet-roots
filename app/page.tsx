import { ServicesDiagram } from "./components/services-diagram/ServicesDiagram";
import { SoilDiagram } from "./components/soil-diagram/SoilDiagram";

export default function Home() {
  return (
    <>
      <ServicesDiagram />
      <SoilDiagram />
    </>
  );
}
