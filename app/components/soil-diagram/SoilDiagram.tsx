import { PhotoDiagramScene } from "@/app/components/photo-diagram/PhotoDiagramScene";
import { SOIL_DIAGRAM_HOTSPOTS } from "@/app/data/soilDiagramHotspots";

export function SoilDiagram() {
  return (
    <PhotoDiagramScene
      layout="hero"
      heading="Biology, not salt, does the work."
      headingLevel="h2"
      hoverHint="Hover a point to explore the soil food web"
      tapHint="Tap a point to explore the soil food web"
      photoSrc="/images/soil-diagram/soil-slice.webp"
      photoAlt="Side slice of living soil with plants, roots, worms, and vermicast"
      initialHotspots={SOIL_DIAGRAM_HOTSPOTS}
      saveId="soil"
    />
  );
}
