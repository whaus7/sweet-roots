import serviceMarkers from "./service-diagram-markers.json";
import {
  applyPhotoMarkers,
  type DiagramHotspot,
  type PhotoMarkerMap,
} from "./photoDiagram";

export const SERVICE_DIAGRAM_TOPICS: DiagramHotspot[] = [
  {
    id: "raised-beds",
    title: "Raised beds",
    summary: "Long-lasting beds, several designs and price points.",
    body: "The flagship is cast concrete panels with a cedar wood top border — heavy, durable, and meant to stay put for decades. We also build other styles at different price points so the structure can match the garden, not the other way around.",
  },
  {
    id: "hugelkultur",
    title: "Hugelkultur prep",
    summary: "The soil engine inside the bed, not a separate product.",
    body: "Before we fill a bed, we layer logs, branches, and compost so the wood slowly breaks down, holds water, and feeds fungi. The growing mix on top is a living soil — not a bag of potting dirt sitting on plywood.",
  },
  {
    id: "lawn",
    title: "Organic lawn restoration",
    summary: "Vermicast tea and organic fertilizers — no synthetic programs.",
    body: "We rebuild turf from the soil up: aerate where it is compacted, drench with vermicast tea, and feed with organic fertilizers so biology, not salt, does the work. The goal is a lawn that stays green without a chemical calendar.",
  },
  {
    id: "amend",
    title: "Garden soil amending",
    summary: "Fresh vermicast and organics for beds you already have.",
    body: "Existing raised beds and in-ground plots get a living top-dress: fresh vermicast, compost, and organic fertilizers worked into the root zone. We are building crumb, microbes, and plant-available minerals — not dumping a quick NPK hit.",
  },
  {
    id: "consult",
    title: "Consulting & starts",
    summary: "A plan for the yard, and starts that actually take.",
    body: "We walk the space, talk through light, water, and what you want to eat, then help you get successful starts into the ground. Advice is practical: what to plant, when to transplant, and how to keep the soil food web going after we leave.",
  },
];

export const SERVICE_DIAGRAM_HOTSPOTS = applyPhotoMarkers(
  SERVICE_DIAGRAM_TOPICS,
  serviceMarkers as PhotoMarkerMap
);
