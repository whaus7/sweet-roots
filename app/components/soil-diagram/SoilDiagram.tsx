"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  SOIL_DIAGRAM_HOTSPOTS,
  applyPhotoMarkers,
  coverPercentToPhotoMarker,
  photoMarkerToOverlay,
  photoMarkersFromHotspots,
  roundPhotoMarker,
  type PhotoMarker,
  type PhotoMarkerMap,
} from "@/app/data/soilDiagramHotspots";

const PhotoPinEditor =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./PhotoPinEditor"), { ssr: false })
    : null;

function overlayPercents(
  clientX: number,
  clientY: number,
  el: HTMLElement
): { x: number; y: number; width: number; height: number } {
  const rect = el.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * 100,
    y: ((clientY - rect.top) / rect.height) * 100,
    width: rect.width,
    height: rect.height,
  };
}

function SoilHotspotMarkers({
  hotspots,
  activeId,
  detailPanelId,
  onSelect,
  editing,
  suppressHover,
  placingId,
  onPlace,
  onMarkerMove,
  onDragChange,
}: {
  hotspots: typeof SOIL_DIAGRAM_HOTSPOTS;
  activeId: string;
  detailPanelId: string;
  onSelect: (id: string) => void;
  editing: boolean;
  suppressHover: boolean;
  placingId: string | null;
  onPlace: (point: PhotoMarker) => void;
  onMarkerMove: (id: string, point: PhotoMarker) => void;
  onDragChange: (dragging: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => {
      setBox({ width: el.clientWidth, height: el.clientHeight });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-10">
      {editing && placingId && (
        <div
          className="pointer-events-auto absolute inset-0 z-0 cursor-crosshair"
          onClick={(event) => {
            const el = rootRef.current;
            if (!el) return;
            const overlay = overlayPercents(event.clientX, event.clientY, el);
            onPlace(
              roundPhotoMarker(
                coverPercentToPhotoMarker(
                  overlay.x,
                  overlay.y,
                  overlay.width,
                  overlay.height
                )
              )
            );
          }}
        />
      )}
      {hotspots.map((hotspot) => {
        if (!hotspot.photoMarker) return null;
        const isActive = hotspot.id === activeId;
        const { x, y } = photoMarkerToOverlay(
          hotspot.photoMarker,
          box.width,
          box.height
        );
        return (
          <button
            key={hotspot.id}
            type="button"
            className={`pointer-events-auto absolute z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              editing ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-label={hotspot.title}
            aria-pressed={isActive}
            aria-controls={detailPanelId}
            onClick={() => onSelect(hotspot.id)}
            onMouseEnter={() => {
              if (!suppressHover) onSelect(hotspot.id);
            }}
            onFocus={() => onSelect(hotspot.id)}
            onPointerDown={(event) => {
              if (!editing) return;
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              onSelect(hotspot.id);
              onDragChange(true);
            }}
            onPointerMove={(event) => {
              if (
                !editing ||
                !event.currentTarget.hasPointerCapture(event.pointerId)
              ) {
                return;
              }
              const el = rootRef.current;
              if (!el) return;
              const overlay = overlayPercents(event.clientX, event.clientY, el);
              onMarkerMove(
                hotspot.id,
                roundPhotoMarker(
                  coverPercentToPhotoMarker(
                    overlay.x,
                    overlay.y,
                    overlay.width,
                    overlay.height
                  )
                )
              );
            }}
            onPointerUp={(event) => {
              if (!editing) return;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              onDragChange(false);
            }}
            onPointerCancel={() => onDragChange(false)}
          >
            <span
              className={`diagram-hotspot-marker ${
                isActive ? "diagram-hotspot-marker--active" : ""
              }`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

export function SoilDiagram() {
  const sectionId = useId();
  const detailPanelId = `${sectionId}-detail`;
  const [activeId, setActiveId] = useState(SOIL_DIAGRAM_HOTSPOTS[0].id);
  const [editing, setEditing] = useState(false);
  const [draftMarkers, setDraftMarkers] = useState<PhotoMarkerMap | null>(null);
  const [placingId, setPlacingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const markers = useMemo(
    () => draftMarkers ?? photoMarkersFromHotspots(SOIL_DIAGRAM_HOTSPOTS),
    [draftMarkers]
  );
  const hotspots = useMemo(
    () => applyPhotoMarkers(SOIL_DIAGRAM_HOTSPOTS, markers),
    [markers]
  );

  const selectHotspot = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const updateMarker = useCallback((id: string, point: PhotoMarker) => {
    setDraftMarkers((current) => ({
      ...(current ?? photoMarkersFromHotspots(SOIL_DIAGRAM_HOTSPOTS)),
      [id]: point,
    }));
  }, []);

  const activeHotspot =
    hotspots.find((hotspot) => hotspot.id === activeId) ?? hotspots[0];
  const suppressHover = dragging || Boolean(placingId);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#1a120c] text-white"
      style={{ height: "min(900px, calc(100svh - 4rem))" }}
      aria-labelledby={`${sectionId}-heading`}
    >
      <Image
        src="/images/soil-diagram/soil-slice.webp"
        alt="Side slice of living soil with plants, roots, worms, and vermicast"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55"
        aria-hidden="true"
      />

      <SoilHotspotMarkers
        hotspots={hotspots}
        activeId={activeId}
        detailPanelId={detailPanelId}
        onSelect={selectHotspot}
        editing={editing}
        suppressHover={suppressHover}
        placingId={placingId}
        onPlace={(point) => {
          if (!placingId) return;
          updateMarker(placingId, point);
          setPlacingId(null);
        }}
        onMarkerMove={updateMarker}
        onDragChange={setDragging}
      />

      {PhotoPinEditor && (
        <PhotoPinEditor
          hotspots={hotspots}
          markers={markers}
          editing={editing}
          placingId={placingId}
          activeId={activeId}
          onToggleEditing={() => {
            setEditing((current) => {
              if (!current) {
                setDraftMarkers(
                  (draft) =>
                    draft ?? photoMarkersFromHotspots(SOIL_DIAGRAM_HOTSPOTS)
                );
              } else {
                setPlacingId(null);
                setDragging(false);
              }
              return !current;
            });
          }}
          onStartPlace={(id) => {
            setActiveId(id);
            setPlacingId(id);
          }}
        />
      )}

      <div className="pointer-events-none relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="max-w-xl">
          <h1
            id={`${sectionId}-heading`}
            className="text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl"
          >
            How worms and vermicast build living soil
          </h1>
          <div
            className="pointer-events-auto mt-8"
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              id={detailPanelId}
              role="region"
              aria-labelledby={`${detailPanelId}-title`}
            >
              <h2
                id={`${detailPanelId}-title`}
                className="text-xl font-bold text-white drop-shadow-sm sm:text-2xl lg:text-3xl"
              >
                {activeHotspot.title}
              </h2>
              <p className="mt-2 text-base font-semibold text-white drop-shadow-sm sm:text-lg">
                {activeHotspot.summary}
              </p>
              <div className="mt-3 overflow-hidden rounded-md bg-black/55 px-5 py-3 backdrop-blur-md">
                <p className="line-clamp-5 text-sm leading-relaxed text-white sm:text-base">
                  {activeHotspot.body}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-3 hidden text-sm font-medium text-white/85 drop-shadow-sm lg:block">
            Hover a point to explore the soil food web
          </p>
          <p className="mb-3 text-sm font-medium text-white/85 drop-shadow-sm lg:hidden">
            Tap a point to explore the soil food web
          </p>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            {hotspots.map((hotspot) => {
              const unplaced = editing && !hotspot.photoMarker;
              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => {
                    selectHotspot(hotspot.id);
                    if (unplaced) setPlacingId(hotspot.id);
                    else setPlacingId(null);
                  }}
                  onMouseEnter={() => {
                    if (!suppressHover) selectHotspot(hotspot.id);
                  }}
                  className={`pointer-events-auto shrink-0 cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    activeId === hotspot.id
                      ? "border-amber-500 bg-amber-500 text-white"
                      : unplaced
                        ? "border-dashed border-white/70 bg-white/80 text-gray-800 hover:border-amber-400"
                        : "border-white/40 bg-white/95 text-gray-800 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  {hotspot.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
