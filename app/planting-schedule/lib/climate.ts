import {
  dayOfYear,
  daysBetweenMonthDays,
  formatMonthDay,
  median,
  monthDayFromDayOfYear,
  parseIsoDate,
  shiftMonthDay,
} from "./dates";
import type { ClimateStats, FrostCalendar, MonthDay } from "./types";
import { GREENHOUSE_OFFSET_C } from "./temperature";

export { GREENHOUSE_OFFSET_C };
export const GREENHOUSE_MIN_EXTEND_DAYS = 21;
export const FROST_THRESHOLD_C = 0;
const YEARS = 10;
const FROST_FREE_MIN_YEARS = 3;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type CacheEntry = { at: number; value: ClimateStats };
const climateCache = new Map<string, CacheEntry>();

type ArchiveResponse = {
  timezone?: string;
  daily?: {
    time: string[];
    temperature_2m_min: (number | null)[];
    temperature_2m_max: (number | null)[];
  };
  error?: boolean;
  reason?: string;
};

export function roundCoord(n: number): number {
  return Math.round(n * 10) / 10;
}

function climateCacheKey(lat: number, lon: number): string {
  return `${roundCoord(lat)},${roundCoord(lon)}`;
}

function completeYearRange(): { start: string; end: string; yearsUsed: number } {
  const endYear = new Date().getUTCFullYear() - 1;
  const startYear = endYear - (YEARS - 1);
  return {
    start: `${startYear}-01-01`,
    end: `${endYear}-12-31`,
    yearsUsed: YEARS,
  };
}

function frostCalendarFromDoys(
  lastDoys: number[],
  firstDoys: number[],
  yearsUsed: number,
): FrostCalendar {
  const lastMedian = median(lastDoys);
  const firstMedian = median(firstDoys);
  const lastFrost: MonthDay | null =
    lastMedian === null ? null : monthDayFromDayOfYear(Math.round(lastMedian));
  const firstFrost: MonthDay | null =
    firstMedian === null ? null : monthDayFromDayOfYear(Math.round(firstMedian));
  const frostFree =
    lastDoys.length < FROST_FREE_MIN_YEARS &&
    firstDoys.length < FROST_FREE_MIN_YEARS &&
    lastDoys.length / yearsUsed < 0.3 &&
    firstDoys.length / yearsUsed < 0.3;

  return {
    frostFree: frostFree || (!lastFrost && !firstFrost),
    lastFrost,
    firstFrost,
    yearsWithLastFrost: lastDoys.length,
    yearsWithFirstFrost: firstDoys.length,
  };
}

function computeFrostAndMonthly(
  dates: string[],
  tmin: (number | null)[],
  tmax: (number | null)[],
  latitude: number,
  yearsUsed: number,
): Pick<
  ClimateStats,
  "monthlyMeanC" | "monthlyMinC" | "monthlyMaxC" | "outdoor" | "greenhouse"
> {
  const southern = latitude < 0;
  const outdoorLast: number[] = [];
  const outdoorFirst: number[] = [];
  const greenhouseLast: number[] = [];
  const greenhouseFirst: number[] = [];

  const monthMinSum = Array.from({ length: 12 }, () => 0);
  const monthMaxSum = Array.from({ length: 12 }, () => 0);
  const monthCount = Array.from({ length: 12 }, () => 0);

  type YearAcc = {
    lastOutdoor: string | null;
    firstOutdoor: string | null;
    lastGreenhouse: string | null;
    firstGreenhouse: string | null;
  };
  const byYear = new Map<number, YearAcc>();

  const ensureYear = (year: number): YearAcc => {
    const existing = byYear.get(year);
    if (existing) return existing;
    const created: YearAcc = {
      lastOutdoor: null,
      firstOutdoor: null,
      lastGreenhouse: null,
      firstGreenhouse: null,
    };
    byYear.set(year, created);
    return created;
  };

  const isSpringHalf = (month: number) =>
    southern ? month >= 7 : month <= 6;

  for (let i = 0; i < dates.length; i += 1) {
    const min = tmin[i];
    const max = tmax[i];
    const iso = dates[i];
    if (min == null || max == null || !iso) continue;

    const date = parseIsoDate(iso);
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    const idx = month - 1;
    monthMinSum[idx] += min;
    monthMaxSum[idx] += max;
    monthCount[idx] += 1;

    const acc = ensureYear(year);
    const springHalf = isSpringHalf(month);

    if (min < FROST_THRESHOLD_C) {
      if (springHalf) acc.lastOutdoor = iso;
      else if (!acc.firstOutdoor) acc.firstOutdoor = iso;
    }
    if (min < FROST_THRESHOLD_C - GREENHOUSE_OFFSET_C) {
      if (springHalf) acc.lastGreenhouse = iso;
      else if (!acc.firstGreenhouse) acc.firstGreenhouse = iso;
    }
  }

  for (const acc of byYear.values()) {
    if (acc.lastOutdoor) {
      outdoorLast.push(dayOfYear(parseIsoDate(acc.lastOutdoor)));
    }
    if (acc.firstOutdoor) {
      outdoorFirst.push(dayOfYear(parseIsoDate(acc.firstOutdoor)));
    }
    if (acc.lastGreenhouse) {
      greenhouseLast.push(dayOfYear(parseIsoDate(acc.lastGreenhouse)));
    }
    if (acc.firstGreenhouse) {
      greenhouseFirst.push(dayOfYear(parseIsoDate(acc.firstGreenhouse)));
    }
  }

  const monthlyMinC = monthMinSum.map((sum, i) =>
    monthCount[i] ? sum / monthCount[i] : 0,
  );
  const monthlyMaxC = monthMaxSum.map((sum, i) =>
    monthCount[i] ? sum / monthCount[i] : 0,
  );
  const monthlyMeanC = monthlyMinC.map((min, i) => (min + monthlyMaxC[i]) / 2);

  return {
    monthlyMeanC,
    monthlyMinC,
    monthlyMaxC,
    outdoor: frostCalendarFromDoys(outdoorLast, outdoorFirst, yearsUsed),
    greenhouse: frostCalendarFromDoys(
      greenhouseLast,
      greenhouseFirst,
      yearsUsed,
    ),
  };
}

async function fetchArchive(lat: number, lon: number): Promise<ClimateStats> {
  const { start, end, yearsUsed } = completeYearRange();
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  url.searchParams.set("daily", "temperature_2m_min,temperature_2m_max");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!response.ok) {
    throw new Error(`Climate data unavailable (${response.status})`);
  }
  const data = (await response.json()) as ArchiveResponse;
  if (data.error || !data.daily?.time) {
    throw new Error(data.reason ?? "Climate data unavailable");
  }

  const computed = computeFrostAndMonthly(
    data.daily.time,
    data.daily.temperature_2m_min,
    data.daily.temperature_2m_max,
    lat,
    yearsUsed,
  );

  return {
    latitude: lat,
    longitude: lon,
    timezone: data.timezone ?? "UTC",
    yearsUsed,
    ...computed,
  };
}

export async function getClimateStats(
  latitude: number,
  longitude: number,
): Promise<ClimateStats> {
  const lat = roundCoord(latitude);
  const lon = roundCoord(longitude);
  const key = climateCacheKey(lat, lon);
  const hit = climateCache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    return hit.value;
  }

  const value = await fetchArchive(lat, lon);
  climateCache.set(key, { at: Date.now(), value });
  return value;
}

export function describeClimate(stats: ClimateStats): string {
  if (stats.outdoor.frostFree) {
    return "Frost-free climate · windows follow cool and warm seasons";
  }
  const last = formatMonthDay(stats.outdoor.lastFrost);
  const first = formatMonthDay(stats.outdoor.firstFrost);
  const parts = [
    last ? `last frost ${last}` : null,
    first ? `first frost ${first}` : null,
  ].filter(Boolean);
  return parts.join(" · ") || "Limited frost record";
}

export function greenhouseMonthlyMean(stats: ClimateStats): number[] {
  return stats.monthlyMeanC.map((value) => value + GREENHOUSE_OFFSET_C);
}

function atLeastEarlier(actual: MonthDay | null, reference: MonthDay, minDays: number): MonthDay {
  const floor = shiftMonthDay(reference, -minDays);
  if (!actual) return floor;
  return daysBetweenMonthDays(actual, reference) >= minDays ? actual : floor;
}

function atLeastLater(actual: MonthDay | null, reference: MonthDay, minDays: number): MonthDay {
  const ceiling = shiftMonthDay(reference, minDays);
  if (!actual) return ceiling;
  return daysBetweenMonthDays(reference, actual) >= minDays ? actual : ceiling;
}

/** Unheated greenhouse frost dates: earlier last frost, later first frost. */
export function effectiveGreenhouseFrost(
  outdoor: FrostCalendar,
  greenhouse: FrostCalendar,
): FrostCalendar {
  if (outdoor.frostFree) {
    return { ...greenhouse, frostFree: true };
  }

  const lastFrost = outdoor.lastFrost
    ? atLeastEarlier(
        greenhouse.lastFrost,
        outdoor.lastFrost,
        GREENHOUSE_MIN_EXTEND_DAYS,
      )
    : greenhouse.lastFrost;
  const firstFrost = outdoor.firstFrost
    ? atLeastLater(
        greenhouse.firstFrost,
        outdoor.firstFrost,
        GREENHOUSE_MIN_EXTEND_DAYS,
      )
    : greenhouse.firstFrost;

  return {
    frostFree: false,
    lastFrost,
    firstFrost,
    yearsWithLastFrost: Math.max(
      outdoor.yearsWithLastFrost,
      greenhouse.yearsWithLastFrost,
    ),
    yearsWithFirstFrost: Math.max(
      outdoor.yearsWithFirstFrost,
      greenhouse.yearsWithFirstFrost,
    ),
  };
}

export function greenhouseAdvanceDays(
  outdoor: FrostCalendar,
  greenhouse: FrostCalendar,
): number {
  const effective = effectiveGreenhouseFrost(outdoor, greenhouse);
  if (!outdoor.lastFrost || !effective.lastFrost) return GREENHOUSE_MIN_EXTEND_DAYS;
  return Math.max(
    GREENHOUSE_MIN_EXTEND_DAYS,
    daysBetweenMonthDays(effective.lastFrost, outdoor.lastFrost),
  );
}

export function greenhouseExtendDays(
  outdoor: FrostCalendar,
  greenhouse: FrostCalendar,
): number {
  const effective = effectiveGreenhouseFrost(outdoor, greenhouse);
  if (!outdoor.firstFrost || !effective.firstFrost) return GREENHOUSE_MIN_EXTEND_DAYS;
  return Math.max(
    GREENHOUSE_MIN_EXTEND_DAYS,
    daysBetweenMonthDays(outdoor.firstFrost, effective.firstFrost),
  );
}
