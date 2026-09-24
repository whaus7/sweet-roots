import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  serializePhotoMarkerMap,
  type DiagramHotspot,
  type PhotoMarker,
  type PhotoMarkerMap,
  type PhotoMarkerSaveId,
} from "@/app/data/photoDiagram";
import { SERVICE_DIAGRAM_TOPICS } from "@/app/data/serviceDiagramHotspots";
import { SOIL_DIAGRAM_TOPICS } from "@/app/data/soilDiagramHotspots";

const HOTSPOT_ID = /^[a-z0-9-]+$/;

const DIAGRAMS: Record<
  PhotoMarkerSaveId,
  { filename: string; topics: DiagramHotspot[] }
> = {
  soil: {
    filename: "soil-diagram-markers.json",
    topics: SOIL_DIAGRAM_TOPICS,
  },
  services: {
    filename: "service-diagram-markers.json",
    topics: SERVICE_DIAGRAM_TOPICS,
  },
};

const MARKERS_DIR = path.resolve(process.cwd(), "app", "data");

function isSaveId(value: unknown): value is PhotoMarkerSaveId {
  return value === "soil" || value === "services";
}

function notFound() {
  return new NextResponse(null, { status: 404 });
}

function isPoint(value: unknown): value is PhotoMarker {
  if (!value || typeof value !== "object") return false;
  const x = Reflect.get(value, "x");
  const y = Reflect.get(value, "y");
  return (
    typeof x === "number" &&
    typeof y === "number" &&
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    x >= 0 &&
    x <= 100 &&
    y >= 0 &&
    y <= 100
  );
}

function parseMarkers(
  raw: unknown,
  allowedIds: Set<string>
): PhotoMarkerMap | string {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return "markers must be an object";
  }

  const markers: PhotoMarkerMap = {};
  for (const [id, point] of Object.entries(raw)) {
    if (!HOTSPOT_ID.test(id) || !allowedIds.has(id)) {
      return `unknown hotspot id: ${id}`;
    }
    if (!isPoint(point)) {
      return `invalid coordinates for ${id}`;
    }
    markers[id] = {
      x: Math.round(point.x * 10) / 10,
      y: Math.round(point.y * 10) / 10,
    };
  }
  return markers;
}

function formatPhotoMarkerFile(markers: PhotoMarkerMap): string {
  const entries = Object.entries(markers);
  if (entries.length === 0) return "{}\n";
  const lines = entries.map(([id, point], index) => {
    const comma = index < entries.length - 1 ? "," : "";
    return `  ${JSON.stringify(id)}: { "x": ${point.x}, "y": ${point.y} }${comma}`;
  });
  return `{\n${lines.join("\n")}\n}\n`;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return notFound();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const diagramId = Reflect.get(body, "diagramId");
  if (!isSaveId(diagramId)) {
    return NextResponse.json({ error: "Invalid diagramId" }, { status: 400 });
  }

  const diagram = DIAGRAMS[diagramId];
  const allowedIds = new Set(diagram.topics.map((hotspot) => hotspot.id));
  const parsed = parseMarkers(Reflect.get(body, "markers"), allowedIds);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  const target = path.resolve(MARKERS_DIR, diagram.filename);
  const relative = path.relative(MARKERS_DIR, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const ordered = serializePhotoMarkerMap(diagram.topics, parsed);
  await writeFile(target, formatPhotoMarkerFile(ordered), "utf8");

  return NextResponse.json({ ok: true, diagramId });
}
