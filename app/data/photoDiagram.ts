export type PhotoMarker = { x: number; y: number };
export type PhotoMarkerMap = Record<string, PhotoMarker>;

export type DiagramHotspot = {
  id: string;
  title: string;
  summary: string;
  body: string;
  bullets?: string[];
  photoMarker?: PhotoMarker;
};

export type PhotoMarkerSaveId = "soil" | "services";

/** Intrinsic aspect of the 16:9 diagram photographs. */
export const PHOTO_VIEWBOX = { x: 0, y: 0, width: 16, height: 9 };

export function applyPhotoMarkers(
  hotspots: DiagramHotspot[],
  markers: PhotoMarkerMap
): DiagramHotspot[] {
  return hotspots.map((hotspot) => ({
    ...hotspot,
    photoMarker: markers[hotspot.id],
  }));
}

export function photoMarkersFromHotspots(
  hotspots: DiagramHotspot[]
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
  hotspots: DiagramHotspot[],
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
