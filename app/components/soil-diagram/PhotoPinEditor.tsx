"use client";

import { useState } from "react";
import {
  serializePhotoMarkerMap,
  type PhotoMarkerMap,
  type SoilHotspot,
} from "@/app/data/soilDiagramHotspots";

export type PhotoPinEditorProps = {
  hotspots: SoilHotspot[];
  markers: PhotoMarkerMap;
  editing: boolean;
  placingId: string | null;
  activeId: string;
  onToggleEditing: () => void;
  onStartPlace: (id: string) => void;
};

export default function PhotoPinEditor({
  hotspots,
  markers,
  editing,
  placingId,
  activeId,
  onToggleEditing,
  onStartPlace,
}: PhotoPinEditorProps) {
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const active = hotspots.find((hotspot) => hotspot.id === activeId);
  const point = markers[activeId];
  const unplaced = hotspots.filter((hotspot) => !markers[hotspot.id]);
  const placing = hotspots.find((hotspot) => hotspot.id === placingId);
  const json = `${JSON.stringify(serializePhotoMarkerMap(hotspots, markers), null, 2)}\n`;

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(json);
      setSaveState("idle");
      setMessage("Copied JSON");
    } catch {
      setSaveState("error");
      setMessage("Clipboard failed — copy from the console if needed.");
    }
  }

  async function saveToFiles() {
    setSaveState("saving");
    setMessage("");
    try {
      const res = await fetch("/api/dev/soil-markers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markers: serializePhotoMarkerMap(hotspots, markers),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(body.error ?? `Save failed (${res.status})`);
      }
      setSaveState("saved");
      setMessage("Saved to soil-diagram-markers.json");
    } catch (error) {
      setSaveState("error");
      setMessage(
        error instanceof Error ? error.message : "Save failed — use Copy JSON."
      );
    }
  }

  return (
    <div className="pointer-events-auto absolute top-3 right-3 z-30 max-w-sm text-left">
      <button
        type="button"
        onClick={onToggleEditing}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${
          editing
            ? "border-amber-500 bg-amber-500 text-white"
            : "border-white/40 bg-black/70 text-white hover:border-amber-400"
        }`}
      >
        {editing ? "Done editing" : "Edit pins"}
      </button>

      {editing && (
        <div className="mt-2 rounded-lg border border-white/20 bg-black/90 p-3 text-xs text-white shadow-lg backdrop-blur-sm">
          <p className="font-mono text-[11px] text-white/90">
            {active ? (
              <>
                <span className="font-semibold">{active.id}</span>
                {point ? (
                  <>
                    {" "}
                    x={point.x} y={point.y}
                  </>
                ) : (
                  " — no pin"
                )}
              </>
            ) : (
              "No hotspot selected"
            )}
          </p>
          {placing && (
            <p className="mt-2 text-amber-300">
              Click the photo to place “{placing.title}”
            </p>
          )}
          {unplaced.length > 0 && (
            <div className="mt-2">
              <p className="mb-1 font-semibold text-white/80">
                Unplaced — click a chip, then the photo
              </p>
              <div className="flex flex-wrap gap-1">
                {unplaced.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => onStartPlace(hotspot.id)}
                    className={`cursor-pointer rounded-full border border-dashed px-2 py-1 text-[11px] ${
                      placingId === hotspot.id
                        ? "border-amber-400 bg-amber-500/20 text-white"
                        : "border-white/50 bg-white/10 text-white hover:border-amber-400"
                    }`}
                  >
                    {hotspot.title}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void saveToFiles()}
              disabled={saveState === "saving"}
              className="rounded-full border border-amber-500 bg-amber-500 px-3 py-1.5 font-semibold text-white disabled:opacity-60"
            >
              {saveState === "saving" ? "Saving…" : "Save to files"}
            </button>
            <button
              type="button"
              onClick={() => void copyJson()}
              className="rounded-full border border-white/40 bg-white/10 px-3 py-1.5 font-semibold text-white hover:border-amber-400"
            >
              Copy JSON
            </button>
          </div>
          {message && (
            <p
              className={`mt-2 ${saveState === "error" ? "text-red-300" : "text-white/80"}`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
