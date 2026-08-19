"use client";

import { useSyncExternalStore } from "react";
import type { TempUnit } from "@/app/planting-schedule/lib/temperature";

const STORAGE_KEY = "planting-temp-unit";

let current: TempUnit = "F";
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "C" || saved === "F") current = saved;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): TempUnit {
  return current;
}

function getServerSnapshot(): TempUnit {
  return "F";
}

function setUnit(next: TempUnit) {
  current = next;
  window.localStorage.setItem(STORAGE_KEY, next);
  listeners.forEach((listener) => listener());
}

export function useTempUnit(): TempUnit {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function UnitToggle() {
  const unit = useTempUnit();

  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="inline-flex rounded-full border border-[var(--rule)] p-0.5 text-xs"
    >
      <button
        type="button"
        aria-pressed={unit === "F"}
        onClick={() => setUnit("F")}
        className={`rounded-full px-2.5 py-1 ${
          unit === "F"
            ? "bg-[var(--ink)] text-[var(--paper)]"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
        }`}
      >
        °F
      </button>
      <button
        type="button"
        aria-pressed={unit === "C"}
        onClick={() => setUnit("C")}
        className={`rounded-full px-2.5 py-1 ${
          unit === "C"
            ? "bg-[var(--ink)] text-[var(--paper)]"
            : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
        }`}
      >
        °C
      </button>
    </div>
  );
}
