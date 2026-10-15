import { SoilDiagram } from "@/app/components/soil-diagram/SoilDiagram";
import { SoilSteps } from "./SoilSteps";
import { SoilStore } from "./SoilStore";

export default function SoilPage() {
  return (
    <>
      <SoilStore />
      <SoilSteps />
      <SoilDiagram />
    </>
  );
}
