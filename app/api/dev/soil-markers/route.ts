import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import {
  SOIL_DIAGRAM_TOPICS,
  roundPhotoMarker,
  serializePhotoMarkerMap,
  type PhotoMarker,
  type PhotoMarkerMap,
} from "@/app/data/soilDiagramHotspots";

const HOTSPOT_ID = /^[a-z0-9-]+$/;
const MARKERS_FILE = path.resolve(
  process.cwd(),
  "app",
  "data",
  "soil-diagram-markers.json"
);

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

function parseMarkers(raw: unknown): PhotoMarkerMap | string {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return "markers must be an object";
  }

  const allowedIds = new Set(SOIL_DIAGRAM_TOPICS.map((hotspot) => hotspot.id));
  const markers: PhotoMarkerMap = {};
  for (const [id, point] of Object.entries(raw)) {
    if (!HOTSPOT_ID.test(id) || !allowedIds.has(id)) {
      return `unknown hotspot id: ${id}`;
    }
    if (!isPoint(point)) {
      return `invalid coordinates for ${id}`;
    }
    markers[id] = roundPhotoMarker(point);
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

  const parsed = parseMarkers(Reflect.get(body, "markers"));
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  const ordered = serializePhotoMarkerMap(SOIL_DIAGRAM_TOPICS, parsed);
  await writeFile(MARKERS_FILE, formatPhotoMarkerFile(ordered), "utf8");

  return NextResponse.json({ ok: true });
}
