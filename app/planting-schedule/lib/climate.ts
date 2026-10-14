import { parseIsoDate } from "./dates";
import type { ClimateStats } from "./types";

export const YEARS = 10;
const RECENT_YEAR_COUNT = 3;
const RECENT_YEAR_WEIGHT = 3;
const OLDER_YEAR_WEIGHT = 1;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

function yearWeight(year: number, endYear: number): number {
  const age = endYear - year;
  return age >= 0 && age < RECENT_YEAR_COUNT
    ? RECENT_YEAR_WEIGHT
    : OLDER_YEAR_WEIGHT;
}

function weightedMonthlyStats(
  times: string[],
  mins: (number | null)[],
  maxs: (number | null)[],
  endYear: number,
): Pick<ClimateStats, "monthlyMeanC" | "monthlyMinC" | "monthlyMaxC"> {
  const meanSum = Array.from({ length: 12 }, () => 0);
  const minSum = Array.from({ length: 12 }, () => 0);
  const maxSum = Array.from({ length: 12 }, () => 0);
  const weightSum = Array.from({ length: 12 }, () => 0);

  for (let i = 0; i < times.length; i += 1) {
    const min = mins[i];
    const max = maxs[i];
    if (min == null || max == null) continue;
    const date = parseIsoDate(times[i]);
    const month = date.getUTCMonth();
    const weight = yearWeight(date.getUTCFullYear(), endYear);
    meanSum[month] += ((min + max) / 2) * weight;
    minSum[month] += min * weight;
    maxSum[month] += max * weight;
    weightSum[month] += weight;
  }

  const monthlyMeanC: number[] = [];
  const monthlyMinC: number[] = [];
  const monthlyMaxC: number[] = [];
  for (let month = 0; month < 12; month += 1) {
    const w = weightSum[month] || 1;
    monthlyMeanC.push(meanSum[month] / w);
    monthlyMinC.push(minSum[month] / w);
    monthlyMaxC.push(maxSum[month] / w);
  }

  return { monthlyMeanC, monthlyMinC, monthlyMaxC };
}

async function fetchArchive(
  lat: number,
  lon: number,
): Promise<ClimateStats> {
  const { start, end, yearsUsed } = completeYearRange();
  const endYear = new Date().getUTCFullYear() - 1;
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", String(roundCoord(lat)));
  url.searchParams.set("longitude", String(roundCoord(lon)));
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  url.searchParams.set("daily", "temperature_2m_min,temperature_2m_max");
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString(), { next: { revalidate: 86_400 } });
  if (!response.ok) {
    throw new Error(`Climate archive failed (${response.status})`);
  }
  const data = (await response.json()) as ArchiveResponse;
  if (data.error || !data.daily?.time?.length) {
    throw new Error(data.reason || "Climate archive returned no daily data");
  }

  const monthly = weightedMonthlyStats(
    data.daily.time,
    data.daily.temperature_2m_min,
    data.daily.temperature_2m_max,
    endYear,
  );

  return {
    latitude: roundCoord(lat),
    longitude: roundCoord(lon),
    timezone: data.timezone || "UTC",
    yearsUsed,
    ...monthly,
  };
}

export async function getClimateStats(
  lat: number,
  lon: number,
): Promise<ClimateStats> {
  const key = climateCacheKey(lat, lon);
  const cached = climateCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.value;
  }
  const value = await fetchArchive(lat, lon);
  climateCache.set(key, { at: Date.now(), value });
  return value;
}

export function describeClimate(stats: ClimateStats, today: Date): string {
  const month = today.getUTCMonth();
  const night = Math.round(stats.monthlyMinC[month]);
  const day = Math.round(stats.monthlyMaxC[month]);
  return `Typical ${MONTH_NAMES[month]}: nights ${night}°C · days ${day}°C. Last ${stats.yearsUsed} years; the most recent ${RECENT_YEAR_COUNT} count more.`;
}
