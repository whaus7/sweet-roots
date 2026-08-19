"use client";

import { useEffect, useState } from "react";
import { categoryLabel } from "@/app/planting-schedule/lib/plants";
import { googleImagesUrl } from "@/app/planting-schedule/lib/search";
import { formatTempDelta, GREENHOUSE_OFFSET_C } from "@/app/planting-schedule/lib/temperature";
import type { ScoredPlant } from "@/app/planting-schedule/lib/types";
import { PlantDetail } from "./plant-detail";
import { ToleranceBar } from "./tolerance-bar";
import { useTempUnit } from "./unit-provider";

type Props = {
  items: ScoredPlant[];
};

export function PlantList({ items }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find((item) => item.plant.id === selectedId) ?? null;
  const unit = useTempUnit();
  const greenhouseOffset = formatTempDelta(GREENHOUSE_OFFSET_C, unit);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--rule)] px-6 py-16 text-center text-[var(--ink-muted)]">
        Nothing in this catalog is in a plantable window here today. Try another
        city, or check back as the season turns.
      </p>
    );
  }

  return (
    <>
      <div className="hidden grid-cols-[minmax(0,1.4fr)_1fr_1fr] gap-6 border-b border-[var(--rule)] px-2 pb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink-faint)] md:grid">
        <span>Variety</span>
        <span>Outdoor</span>
        <span>Unheated greenhouse (~{greenhouseOffset})</span>
      </div>
      <ul className="divide-y divide-[var(--rule)]">
        {items.map((item) => {
          const active = item.plant.id === selectedId;
          return (
            <li key={item.plant.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(active ? null : item.plant.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedId(active ? null : item.plant.id);
                  }
                }}
                className={`grid w-full cursor-pointer grid-cols-1 gap-5 px-2 py-5 text-left transition md:grid-cols-[minmax(0,1.4fr)_1fr_1fr] md:items-center ${
                  active ? "bg-[var(--sage-wash)]" : "hover:bg-[var(--paper-raised)]"
                }`}
              >
                <div>
                  <a
                    href={googleImagesUrl(
                      item.plant.varietyName,
                      item.plant.commonName,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Google images: ${item.plant.varietyName} ${item.plant.commonName}`}
                    onClick={(event) => event.stopPropagation()}
                    className="font-serif text-xl text-[var(--ink)] underline-offset-4 hover:underline"
                  >
                    {item.plant.varietyName}
                  </a>
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">
                    {item.plant.commonName}
                    <span className="text-[var(--ink-faint)]">
                      {" "}
                      · {categoryLabel(item.plant.category)}
                    </span>
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--ink-muted)]">
                    {item.plant.flavor}
                  </p>
                </div>
                <ToleranceBar fit={item.outdoor} caption="Outdoor" />
                <ToleranceBar
                  fit={item.greenhouse}
                  caption="Greenhouse"
                />
              </div>
            </li>
          );
        })}
      </ul>

      {selected ? (
        <div className="fixed inset-0 z-40 flex justify-end">
          <button
            type="button"
            aria-label="Close variety details"
            className="absolute inset-0 bg-[var(--ink)]/25"
            onClick={() => setSelectedId(null)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            className="relative z-10 h-full w-full max-w-md bg-[var(--paper-raised)] shadow-2xl"
          >
            <PlantDetail item={selected} onClose={() => setSelectedId(null)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
