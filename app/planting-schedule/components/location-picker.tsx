"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Place } from "@/app/planting-schedule/lib/types";

type Props = {
  currentPlace?: string;
  latitude?: number;
  longitude?: number;
};

export function LocationPicker({ currentPlace, latitude, longitude }: Props) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latitude == null || longitude == null || !currentPlace) return;
    const params = new URLSearchParams(window.location.search);
    const samePlace = params.get("place") === currentPlace;
    const sameCoords =
      params.get("lat") === latitude.toFixed(4) &&
      params.get("lon") === longitude.toFixed(4);
    if (samePlace && sameCoords) return;
    params.set("lat", latitude.toFixed(4));
    params.set("lon", longitude.toFixed(4));
    params.set("place", currentPlace);
    window.history.replaceState(null, "", `/planting-schedule?${params.toString()}`);
  }, [currentPlace, latitude, longitude]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const handle = window.setTimeout(async () => {
      const response = await fetch(`/api/planting-schedule/geocode?q=${encodeURIComponent(trimmed)}`);
      if (!response.ok) return;
      const data = (await response.json()) as { results?: Place[] };
      setResults(data.results ?? []);
      setOpen(true);
    }, 280);
    return () => window.clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, []);

  function goTo(place: Place) {
    const params = new URLSearchParams();
    params.set("lat", place.latitude.toFixed(4));
    params.set("lon", place.longitude.toFixed(4));
    params.set("place", place.displayName);
    setQuery("");
    setResults([]);
    setOpen(false);
    setStatus(null);
    router.push(`/planting-schedule?${params.toString()}`);
  }

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not available in this browser.");
      return;
    }
    setGeoBusy(true);
    setStatus("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `/api/planting-schedule/geocode?lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
          );
          const data = (await response.json()) as { results?: Place[] };
          const place = data.results?.[0];
          if (place) {
            goTo(place);
            return;
          }
          goTo({
            name: "Current location",
            displayName: "Current location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } finally {
          setGeoBusy(false);
        }
      },
      () => {
        setGeoBusy(false);
        setStatus("Location permission was denied. Search for a city instead.");
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor="city-search" className="sr-only">
            Search for a city
          </label>
          <input
            id="city-search"
            type="search"
            autoComplete="off"
            role="combobox"
            aria-expanded={open && results.length > 0}
            aria-controls={listId}
            placeholder="Search any city worldwide"
            value={query}
            onChange={(event) => {
              const value = event.target.value;
              setQuery(value);
              if (value.trim().length < 2) {
                setResults([]);
                setOpen(false);
              }
            }}
            onFocus={() => results.length > 0 && setOpen(true)}
            className="w-full rounded-full border border-[var(--rule)] bg-[var(--paper-raised)] px-4 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)] focus:border-[var(--sage)]"
          />
          {open && results.length > 0 ? (
            <ul
              id={listId}
              role="listbox"
              className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-2xl border border-[var(--rule)] bg-[var(--paper-raised)] py-1 shadow-lg"
            >
              {results.map((place) => (
                <li key={`${place.latitude}-${place.longitude}-${place.displayName}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--sage-wash)]"
                    onClick={() => goTo(place)}
                  >
                    {place.displayName}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={geoBusy}
          className="shrink-0 rounded-full border border-[var(--rule)] px-4 py-2.5 text-sm text-[var(--ink-muted)] transition hover:border-[var(--sage)] hover:text-[var(--ink)] disabled:opacity-60"
        >
          {geoBusy ? "Locating…" : "Use my location"}
        </button>
      </div>
      <p className="mt-3">
        {currentPlace ? (
          <>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Using climate for
            </span>
            <span className="mt-1 block font-serif text-2xl text-[var(--ink)]">
              {currentPlace}
            </span>
          </>
        ) : (
          <span className="text-sm text-[var(--ink-muted)]">
            {status ?? "Detecting your location, or search for a city."}
          </span>
        )}
        {status && currentPlace ? (
          <span className="mt-1 block text-sm text-[var(--ink-muted)]">{status}</span>
        ) : null}
        {latitude != null && longitude != null ? (
          <span className="sr-only">
            {latitude.toFixed(2)}, {longitude.toFixed(2)}
          </span>
        ) : null}
      </p>
    </div>
  );
}
