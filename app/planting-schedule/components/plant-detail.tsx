"use client";

import { categoryLabel, sowLabel } from "@/app/planting-schedule/lib/plants";
import { googleImagesUrl } from "@/app/planting-schedule/lib/search";
import {
  formatTemp,
  formatTempRange,
} from "@/app/planting-schedule/lib/temperature";
import type { ScoredPlant } from "@/app/planting-schedule/lib/types";
import { seasonDisplayName } from "@/app/planting-schedule/lib/windows";
import { useTempUnit } from "./unit-provider";

const TAG_LABELS: Record<string, string> = {
  asian: "Asian",
  indian: "Indian",
  african: "African",
  italian: "Italian",
  "winter-green": "Winter green",
  unique: "Flavor-first",
};

type Props = {
  item: ScoredPlant;
  onClose: () => void;
};

export function PlantDetail({ item, onClose }: Props) {
  const { plant, outdoor, greenhouse } = item;
  const unit = useTempUnit();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-[var(--rule)] px-6 py-5">
        <div>
          <a
            href={googleImagesUrl(plant.varietyName, plant.commonName)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-2xl text-[var(--ink)] underline-offset-4 hover:underline"
          >
            {plant.varietyName}
          </a>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {plant.commonName} · <em>{plant.scientificName}</em>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[var(--rule)] px-3 py-1 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
        >
          Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="font-serif text-lg leading-relaxed text-[var(--ink)]">
          {plant.flavor}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--ink-muted)]">
          {plant.notes}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <Fact label="Type" value={categoryLabel(plant.category)} />
          <Fact label="Sow" value={sowLabel(plant.sowMethod)} />
          <Fact
            label="Days to maturity"
            value={`${plant.daysToMaturity.min}–${plant.daysToMaturity.max}`}
          />
          <Fact
            label="Hardy to"
            value={formatTemp(plant.frostHardinessC, unit)}
          />
          <Fact
            label="Min soil temp"
            value={formatTemp(plant.minSoilTempC, unit)}
          />
          <Fact
            label="Preferred air"
            value={formatTempRange(
              plant.preferredTempC.min,
              plant.preferredTempC.max,
              unit,
            )}
          />
        </dl>
        <div className="mt-6 space-y-3 rounded-2xl bg-[var(--sage-wash)] p-4 text-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            Why it is on the list today
          </p>
          <p>
            <span className="font-medium">Outdoor:</span> {outdoor.label}
            {outdoor.inWindow ? ` (${seasonDisplayName(outdoor.season)})` : ""}
          </p>
          <p>
            <span className="font-medium">Unheated greenhouse:</span>{" "}
            {greenhouse.label}
            {greenhouse.inWindow ? ` (${seasonDisplayName(greenhouse.season)})` : ""}
          </p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {plant.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-[var(--rule)] px-3 py-1 text-xs text-[var(--ink-muted)]"
            >
              {TAG_LABELS[tag] ?? tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--rule)] px-3 py-2">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
        {label}
      </dt>
      <dd className="mt-0.5 text-[var(--ink)]">{value}</dd>
    </div>
  );
}
