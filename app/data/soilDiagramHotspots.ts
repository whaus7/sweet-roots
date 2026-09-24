import soilMarkers from "./soil-diagram-markers.json";
import {
  applyPhotoMarkers,
  type DiagramHotspot,
  type PhotoMarkerMap,
} from "./photoDiagram";

export type { DiagramHotspot, PhotoMarker, PhotoMarkerMap } from "./photoDiagram";

export const SOIL_DIAGRAM_TOPICS: DiagramHotspot[] = [
  {
    id: "plant-vigor",
    title: "Plant vigor",
    summary: "Healthy soil shows up first in the leaves.",
    body: "When the soil food web is intact, plants take up a fuller spectrum of minerals. Leaves look darker, stems stand firmer, and Brix readings climb — not because of a fertilizer dump, but because roots are trading sugars with a living microbiome.",
  },
  {
    id: "leaf-litter",
    title: "Leaf litter",
    summary: "The buffet at the soil surface.",
    body: "Mulch and fallen leaves are the first course. Red wigglers work this layer, shredding residue and pulling it downward. That surface cover also shades soil, slows evaporation, and keeps the top few inches moist enough for worms to stay active.",
  },
  {
    id: "red-wigglers",
    title: "European red wigglers",
    summary: "Eisenia fetida — compost worms that live where residue is rich.",
    body: "Unlike deep-burrowing nightcrawlers, red wigglers stay in the upper, organic-rich horizon. They eat decaying plant matter and microbes, then leave behind vermicast. A small starter herd can turn kitchen scraps and garden waste into a living amendment.",
  },
  {
    id: "vermicast",
    title: "Vermicast",
    summary: "Worm castings are a finished, microbe-rich fertilizer.",
    body: "Vermicast is packed with plant-available nutrients, beneficial bacteria, and fungal spores, bound in a stable crumb that will not burn roots. It improves cation exchange, buffers pH swings, and inoculates soil with the organisms plants need at the root surface.",
  },
  {
    id: "rhizosphere",
    title: "Rhizosphere",
    summary: "The thin film of life around every root.",
    body: "Roots leak sugars and amino acids that feed bacteria and fungi. In return, those microbes mine phosphorus, fix nitrogen, and keep pathogens in check. Vermicast supercharges this exchange by adding both food and the organisms that do the trading.",
    bullets: [
      "Microbes release organic acids and enzymes that weather rock and mineral particles, unlocking phosphorus, potassium, and other nutrients in forms roots can take up.",
    ],
  },
  {
    id: "mycorrhizae",
    title: "Mycorrhizae",
    summary: "Fungal threads that extend a plant’s reach.",
    body: "Mycorrhizal hyphae wrap roots and run far into the soil, trading water and minerals for plant sugars. Worm activity and vermicast help these networks establish by improving structure and adding fungal inoculum instead of sterilizing the bed.",
  },
  {
    id: "soil-structure",
    title: "Soil structure",
    summary: "Aggregates, pores, and a path for water.",
    body: "Worm tunnels and sticky microbial glues create crumbs with air and water spaces between them. Rain soaks in instead of running off. Roots follow those channels, and oxygen stays available for the aerobic microbes that build fertility.",
  },
];

export const SOIL_DIAGRAM_HOTSPOTS = applyPhotoMarkers(
  SOIL_DIAGRAM_TOPICS,
  soilMarkers as PhotoMarkerMap
);
