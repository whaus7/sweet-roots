import { PhotoDiagramScene } from "@/app/components/photo-diagram/PhotoDiagramScene";
import { SERVICE_DIAGRAM_HOTSPOTS } from "@/app/data/serviceDiagramHotspots";

export function ServicesDiagram() {
  return (
    <PhotoDiagramScene
      layout="hero"
      heading="Raised beds, living lawns, and gardens that last"
      headingLevel="h1"
      hoverHint="Hover a point to explore our services"
      tapHint="Tap a point to explore our services"
      photoSrc="/images/services-diagram/backyard-hero.webp"
      photoAlt="Backyard with concrete-and-cedar raised vegetable beds, a healthy lawn, pollinator flowers, and seedling starts"
      initialHotspots={SERVICE_DIAGRAM_HOTSPOTS}
      saveId="services"
      priority
    />
  );
}
