"use client";

import { useEffect, useState } from "react";
import type { CommonsPhoto } from "@/app/planting-schedule/lib/commons";
import { googleImagesUrl } from "@/app/planting-schedule/lib/search";

export function usePlantPhotos(commonName: string, scientificName: string) {
  const [photos, setPhotos] = useState<CommonsPhoto[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setPhotos(null);

    const params = new URLSearchParams({
      common: commonName,
      scientific: scientificName,
    });

    fetch(`/api/planting-schedule/plant-images?${params}`)
      .then((response) => (response.ok ? response.json() : { photos: [] }))
      .then((data: { photos?: CommonsPhoto[] }) => {
        if (!cancelled) setPhotos(data.photos ?? []);
      })
      .catch(() => {
        if (!cancelled) setPhotos([]);
      });

    return () => {
      cancelled = true;
    };
  }, [commonName, scientificName]);

  return photos;
}

function LoadingMark({ tone }: { tone: "dark" | "light" }) {
  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 ${
        tone === "dark" ? "text-white" : "text-[var(--ink-muted)]"
      }`}
      role="status"
      aria-live="polite"
    >
      <span
        className="size-7 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80"
        aria-hidden
      />
      <span className="text-[11px] font-medium uppercase tracking-[0.14em]">
        Loading photos
      </span>
    </div>
  );
}

type Props = {
  photos: CommonsPhoto[] | null;
  commonName: string;
  varietyName: string;
  layout: "rail" | "stack";
};

export function PlantPhotos({ photos, commonName, varietyName, layout }: Props) {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    setLoadedCount(0);
  }, [photos]);

  if (photos !== null && photos.length === 0) return null;

  const waitingOnFetch = photos === null;
  const waitingOnImages =
    photos !== null && photos.length > 0 && loadedCount < photos.length;
  const loading = waitingOnFetch || waitingOnImages;

  const credit = (
    <p
      className={
        layout === "rail"
          ? "absolute bottom-0 left-0 right-0 z-20 bg-[var(--ink)]/55 px-3 py-2 text-[11px] text-white"
          : "mt-2 text-[11px] text-[var(--ink-faint)]"
      }
    >
      Wikimedia Commons
      <span className={layout === "rail" ? "text-white/50" : "text-[var(--rule)]"}>
        {" "}
        ·{" "}
      </span>
      <a
        href={googleImagesUrl(varietyName, commonName)}
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-2 hover:underline"
      >
        more photos
      </a>
    </p>
  );

  const picture = (photo: CommonsPhoto, className: string) => (
    <a
      key={photo.pageUrl}
      href={photo.pageUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={[photo.title, photo.artist, photo.license].filter(Boolean).join(" · ")}
      className={className}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.thumbUrl}
        alt={photo.title}
        onLoad={() => setLoadedCount((count) => count + 1)}
        onError={() => setLoadedCount((count) => count + 1)}
        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
      />
    </a>
  );

  if (layout === "rail") {
    return (
      <div
        className="relative hidden h-full w-[min(36vw,26rem)] shrink-0 flex-col bg-[var(--ink)] md:flex"
        aria-busy={loading}
      >
        {waitingOnFetch
          ? Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="min-h-0 flex-1 bg-white/10" />
            ))
          : photos.map((photo) =>
              picture(
                photo,
                "group relative min-h-0 flex-1 overflow-hidden bg-white/10",
              ),
            )}
        {loading ? <LoadingMark tone="dark" /> : credit}
      </div>
    );
  }

  return (
    <div className="relative mb-5 md:hidden" aria-busy={loading}>
      <div className="relative flex flex-col gap-2">
        {waitingOnFetch
          ? Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="aspect-[4/3] rounded-lg bg-[var(--bar-track)]"
              />
            ))
          : photos.map((photo) =>
              picture(
                photo,
                "group relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--bar-track)]",
              ),
            )}
        {loading ? (
          <LoadingMark tone="light" />
        ) : null}
      </div>
      {!loading ? credit : null}
    </div>
  );
}
