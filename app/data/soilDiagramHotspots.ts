import soilMarkers from "./soil-diagram-markers.json";

export type PhotoMarker = { x: number; y: number };
export type PhotoMarkerMap = Record<string, PhotoMarker>;

export type SoilHotspot = {
  id: string;
  title: string;
  summary: string;
  body: string;
  photoMarker?: PhotoMarker;
};

/** Intrinsic aspect of the soil-slice photograph. */
export const PHOTO_VIEWBOX = { x: 0, y: 0, width: 16, height: 9 };

export const SOIL_DIAGRAM_TOPICS: SoilHotspot[] = [
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

export function applyPhotoMarkers(
  hotspots: SoilHotspot[],
  markers: PhotoMarkerMap
): SoilHotspot[] {
  return hotspots.map((hotspot) => ({
    ...hotspot,
    photoMarker: markers[hotspot.id],
  }));
}

export function photoMarkersFromHotspots(
  hotspots: SoilHotspot[]
): PhotoMarkerMap {
  const markers: PhotoMarkerMap = {};
  for (const hotspot of hotspots) {
    if (hotspot.photoMarker) {
      markers[hotspot.id] = hotspot.photoMarker;
    }
  }
  return markers;
}

/** Stable key order matching hotspot arrays, for git-friendly JSON. */
export function serializePhotoMarkerMap(
  hotspots: SoilHotspot[],
  markers: PhotoMarkerMap
): PhotoMarkerMap {
  const ordered: PhotoMarkerMap = {};
  for (const hotspot of hotspots) {
    const point = markers[hotspot.id];
    if (point) ordered[hotspot.id] = point;
  }
  return ordered;
}

export function roundPhotoMarker(point: PhotoMarker): PhotoMarker {
  return {
    x: Math.round(point.x * 10) / 10,
    y: Math.round(point.y * 10) / 10,
  };
}

export const SOIL_DIAGRAM_HOTSPOTS = applyPhotoMarkers(
  SOIL_DIAGRAM_TOPICS,
  soilMarkers as PhotoMarkerMap
);

/** Map a 16:9 photo percent onto an object-cover frame. */
export function photoMarkerToOverlay(
  marker: PhotoMarker,
  elWidth: number,
  elHeight: number
): { x: number; y: number } {
  if (elWidth <= 0 || elHeight <= 0) {
    return marker;
  }
  const scale = Math.max(
    elWidth / PHOTO_VIEWBOX.width,
    elHeight / PHOTO_VIEWBOX.height
  );
  const drawnW = PHOTO_VIEWBOX.width * scale;
  const drawnH = PHOTO_VIEWBOX.height * scale;
  const originX = (elWidth - drawnW) / 2;
  const originY = (elHeight - drawnH) / 2;
  const svgX = (marker.x / 100) * PHOTO_VIEWBOX.width;
  const svgY = (marker.y / 100) * PHOTO_VIEWBOX.height;
  return {
    x: ((originX + svgX * scale) / elWidth) * 100,
    y: ((originY + svgY * scale) / elHeight) * 100,
  };
}

/** Inverse of photoMarkerToOverlay: overlay percent → 16:9 photo percent. */
export function coverPercentToPhotoMarker(
  overlayXPercent: number,
  overlayYPercent: number,
  elWidth: number,
  elHeight: number
): PhotoMarker {
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  if (elWidth <= 0 || elHeight <= 0) {
    return { x: clamp(overlayXPercent), y: clamp(overlayYPercent) };
  }
  const scale = Math.max(
    elWidth / PHOTO_VIEWBOX.width,
    elHeight / PHOTO_VIEWBOX.height
  );
  const originX = (elWidth - PHOTO_VIEWBOX.width * scale) / 2;
  const originY = (elHeight - PHOTO_VIEWBOX.height * scale) / 2;
  const overlayX = (overlayXPercent / 100) * elWidth;
  const overlayY = (overlayYPercent / 100) * elHeight;
  const svgX = (overlayX - originX) / scale + PHOTO_VIEWBOX.x;
  const svgY = (overlayY - originY) / scale + PHOTO_VIEWBOX.y;
  return {
    x: clamp((svgX / PHOTO_VIEWBOX.width) * 100),
    y: clamp((svgY / PHOTO_VIEWBOX.height) * 100),
  };
}
