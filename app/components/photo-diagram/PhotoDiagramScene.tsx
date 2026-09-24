"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  applyPhotoMarkers,
  coverPercentToPhotoMarker,
  photoMarkerToOverlay,
  photoMarkersFromHotspots,
  roundPhotoMarker,
  type DiagramHotspot,
  type PhotoMarker,
  type PhotoMarkerMap,
  type PhotoMarkerSaveId,
} from "@/app/data/photoDiagram";

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

function PhotoHotspotMarkers({
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
  hotspots: DiagramHotspot[];
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

function FactCopy({
  hotspot,
  detailPanelId,
  tone,
  titleTag: TitleTag,
}: {
  hotspot: DiagramHotspot;
  detailPanelId: string;
  tone: "hero" | "split";
  titleTag: "h2" | "h3";
}) {
  const titleClass =
    tone === "hero"
      ? "text-xl font-bold text-white drop-shadow-sm sm:text-2xl lg:text-3xl"
      : "text-xl font-bold text-gray-900 sm:text-2xl";
  const summaryClass =
    tone === "hero"
      ? "mt-2 text-base font-semibold text-white drop-shadow-sm sm:text-lg"
      : "mt-2 text-base font-semibold text-amber-800 sm:text-lg";
  const bodyWrapClass =
    tone === "hero"
      ? "mt-3 overflow-hidden rounded-md bg-black/55 px-5 py-3 backdrop-blur-md"
      : "mt-3 overflow-hidden rounded-md border border-gray-200 bg-white px-5 py-3";
  const bodyClass =
    tone === "hero"
      ? "line-clamp-5 text-sm leading-relaxed text-white sm:text-base"
      : "text-sm leading-relaxed text-gray-700 sm:text-base";
  const bulletClass =
    tone === "hero"
      ? "mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-white sm:text-base"
      : "mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700 sm:text-base";

  return (
    <div id={detailPanelId} role="region" aria-labelledby={`${detailPanelId}-title`}>
      <TitleTag id={`${detailPanelId}-title`} className={titleClass}>
        {hotspot.title}
      </TitleTag>
      <p className={summaryClass}>{hotspot.summary}</p>
      <div className={bodyWrapClass}>
        <p className={bodyClass}>{hotspot.body}</p>
        {hotspot.bullets && hotspot.bullets.length > 0 && (
          <ul className={bulletClass}>
            {hotspot.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TopicPills({
  hotspots,
  activeId,
  editing,
  suppressHover,
  onSelect,
  onPlaceRequest,
}: {
  hotspots: DiagramHotspot[];
  activeId: string;
  editing: boolean;
  suppressHover: boolean;
  onSelect: (id: string) => void;
  onPlaceRequest: (id: string | null) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
      {hotspots.map((hotspot) => {
        const unplaced = editing && !hotspot.photoMarker;
        return (
          <button
            key={hotspot.id}
            type="button"
            onClick={() => {
              onSelect(hotspot.id);
              onPlaceRequest(unplaced ? hotspot.id : null);
            }}
            onMouseEnter={() => {
              if (!suppressHover) onSelect(hotspot.id);
            }}
            className={`pointer-events-auto shrink-0 cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition ${
              activeId === hotspot.id
                ? "border-amber-500 bg-amber-500 text-white"
                : unplaced
                  ? "border-dashed border-gray-400 bg-white text-gray-800 hover:border-amber-400"
                  : "border-gray-200 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50"
            }`}
          >
            {hotspot.title}
          </button>
        );
      })}
    </div>
  );
}

export type PhotoDiagramSceneProps = {
  layout: "hero" | "split";
  heading: string;
  headingLevel?: "h1" | "h2";
  hoverHint: string;
  tapHint: string;
  photoSrc: string;
  photoAlt: string;
  initialHotspots: DiagramHotspot[];
  saveId: PhotoMarkerSaveId;
  priority?: boolean;
};

export function PhotoDiagramScene({
  layout,
  heading,
  headingLevel = "h1",
  hoverHint,
  tapHint,
  photoSrc,
  photoAlt,
  initialHotspots,
  saveId,
  priority = false,
}: PhotoDiagramSceneProps) {
  const sectionId = useId();
  const detailPanelId = `${sectionId}-detail`;
  const HeadingTag = headingLevel;
  const [activeId, setActiveId] = useState(initialHotspots[0]?.id ?? "");
  const [editing, setEditing] = useState(false);
  const [draftMarkers, setDraftMarkers] = useState<PhotoMarkerMap | null>(null);
  const [placingId, setPlacingId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const markers = useMemo(
    () => draftMarkers ?? photoMarkersFromHotspots(initialHotspots),
    [draftMarkers, initialHotspots]
  );
  const hotspots = useMemo(
    () => applyPhotoMarkers(initialHotspots, markers),
    [initialHotspots, markers]
  );

  const selectHotspot = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const updateMarker = useCallback(
    (id: string, point: PhotoMarker) => {
      setDraftMarkers((current) => ({
        ...(current ?? photoMarkersFromHotspots(initialHotspots)),
        [id]: point,
      }));
    },
    [initialHotspots]
  );

  const activeHotspot =
    hotspots.find((hotspot) => hotspot.id === activeId) ?? hotspots[0];
  const suppressHover = dragging || Boolean(placingId);

  if (!activeHotspot) return null;

  const markersLayer = (
    <>
      <PhotoHotspotMarkers
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
          saveId={saveId}
          hotspots={hotspots}
          markers={markers}
          editing={editing}
          placingId={placingId}
          activeId={activeId}
          onToggleEditing={() => {
            setEditing((current) => {
              if (!current) {
                setDraftMarkers(
                  (draft) => draft ?? photoMarkersFromHotspots(initialHotspots)
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
    </>
  );

  if (layout === "split") {
    return (
      <section
        className="bg-[#fcfcfc] py-12 sm:py-16"
        aria-labelledby={`${sectionId}-heading`}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <div className="relative aspect-video w-full max-h-[420px] overflow-hidden rounded-xl bg-[#1a120c]">
            <Image
              src={photoSrc}
              alt={photoAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            {markersLayer}
          </div>
          <div>
            <HeadingTag
              id={`${sectionId}-heading`}
              className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
              {heading}
            </HeadingTag>
            <div className="mt-6" aria-live="polite" aria-atomic="true">
              <FactCopy
                hotspot={activeHotspot}
                detailPanelId={detailPanelId}
                tone="split"
                titleTag="h3"
              />
            </div>
            <p className="mb-3 mt-6 hidden text-sm font-medium text-gray-600 lg:block">
              {hoverHint}
            </p>
            <p className="mb-3 mt-6 text-sm font-medium text-gray-600 lg:hidden">
              {tapHint}
            </p>
            <TopicPills
              hotspots={hotspots}
              activeId={activeId}
              editing={editing}
              suppressHover={suppressHover}
              onSelect={selectHotspot}
              onPlaceRequest={setPlacingId}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative isolate overflow-hidden bg-[#1a120c] text-white"
      style={{ height: "min(900px, calc(100svh - 4rem))" }}
      aria-labelledby={`${sectionId}-heading`}
    >
      <Image
        src={photoSrc}
        alt={photoAlt}
        fill
        sizes="100vw"
        className="object-cover"
        {...(priority ? { priority: true } : { loading: "lazy" as const })}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55"
        aria-hidden="true"
      />
      {markersLayer}
      <div className="pointer-events-none relative z-20 mx-auto flex h-full w-full max-w-7xl flex-col justify-between px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="max-w-xl">
          <HeadingTag
            id={`${sectionId}-heading`}
            className="text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-5xl"
          >
            {heading}
          </HeadingTag>
          <div
            className="pointer-events-auto mt-8"
            aria-live="polite"
            aria-atomic="true"
          >
            <FactCopy
              hotspot={activeHotspot}
              detailPanelId={detailPanelId}
              tone="hero"
              titleTag="h2"
            />
          </div>
        </div>
        <div>
          <p className="mb-3 hidden text-sm font-medium text-white/85 drop-shadow-sm lg:block">
            {hoverHint}
          </p>
          <p className="mb-3 text-sm font-medium text-white/85 drop-shadow-sm lg:hidden">
            {tapHint}
          </p>
          <TopicPills
            hotspots={hotspots}
            activeId={activeId}
            editing={editing}
            suppressHover={suppressHover}
            onSelect={selectHotspot}
            onPlaceRequest={setPlacingId}
          />
        </div>
      </div>
    </section>
  );
}
