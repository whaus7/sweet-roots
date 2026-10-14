import {
  addDays,
  calendarDate,
  clamp,
  diffDays,
  toIsoDate,
} from "./dates";
import type { ClimateStats, Plant, Season, WindowFit } from "./types";

const IN_RANGE_SLACK_C = 1;
const SCORE_FALL_OFF_C = 3.5;
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function seasonDisplayName(season: Season): string {
  return season === "cool" ? "cool-season" : "warm-season";
}

function plantSeason(plant: Plant): Season {
  const mid = (plant.preferredTempC.min + plant.preferredTempC.max) / 2;
  return mid >= 18 ? "warm" : "cool";
}

function lastDayOfMonth(year: number, monthIndex: number): Date {
  return addDays(calendarDate(year, monthIndex + 1, 1), -1);
}

function monthScore(meanC: number, nightC: number, plant: Plant): number {
  const { min, max } = plant.preferredTempC;
  const mid = (min + max) / 2;
  const half = Math.max((max - min) / 2, 1);
  const dist = Math.abs(meanC - mid);
  let score: number;
  if (dist <= half) {
    score = 70 + 30 * (1 - dist / half);
  } else {
    const extra = dist - half;
    if (extra >= SCORE_FALL_OFF_C) return 0;
    score = 70 * (1 - extra / SCORE_FALL_OFF_C);
  }

  if (nightC < plant.frostHardinessC) {
    const deficit = plant.frostHardinessC - nightC;
    if (deficit >= 3) return 0;
    score *= 1 - deficit / 3;
  }

  if (meanC < plant.minSoilTempC) {
    const deficit = plant.minSoilTempC - meanC;
    if (deficit >= 3) return 0;
    score *= 1 - deficit / 3;
  }

  return score;
}

function monthInRange(meanC: number, nightC: number, plant: Plant): boolean {
  return (
    meanC >= plant.preferredTempC.min - IN_RANGE_SLACK_C &&
    meanC <= plant.preferredTempC.max + IN_RANGE_SLACK_C &&
    nightC >= plant.frostHardinessC - 1 &&
    meanC >= plant.minSoilTempC - 1
  );
}

function monthsInPreferredBand(plant: Plant, climate: ClimateStats): number[] {
  const months: number[] = [];
  for (let month = 0; month < 12; month += 1) {
    if (
      monthInRange(
        climate.monthlyMeanC[month],
        climate.monthlyMinC[month],
        plant,
      )
    ) {
      months.push(month);
    }
  }
  return months;
}

function longestRun(months: number[]): number[] {
  if (months.length === 0) return [];
  const set = new Set(months);
  let best: number[] = [];
  for (const start of months) {
    if (set.has((start + 11) % 12)) continue;
    const run = [start];
    let next = (start + 1) % 12;
    while (set.has(next) && run.length < 12) {
      run.push(next);
      next = (next + 1) % 12;
    }
    if (run.length > best.length) best = run;
  }
  return best.length > 0 ? best : [months[0]];
}

function seasonWindow(
  today: Date,
  months: number[],
): { start: Date; end: Date; ideal: Date; yearRound: boolean } {
  const year = today.getUTCFullYear();
  if (months.length >= 10) {
    const start = calendarDate(year, 1, 1);
    const end = calendarDate(year, 12, 31);
    return { start, end, ideal: today, yearRound: true };
  }
  const run = longestRun(months);
  if (run.length === 0) {
    const start = calendarDate(year, today.getUTCMonth() + 1, 1);
    const end = lastDayOfMonth(year, today.getUTCMonth());
    return { start, end, ideal: today, yearRound: false };
  }
  const startMonth = run[0];
  const endMonth = run[run.length - 1];
  const start = calendarDate(year, startMonth + 1, 1);
  let end = lastDayOfMonth(year, endMonth);
  if (endMonth < startMonth || (run.length > 1 && end < start)) {
    end = lastDayOfMonth(year + 1, endMonth);
  }
  const ideal = addDays(start, Math.round(diffDays(end, start) / 2));
  return { start, end, ideal, yearRound: false };
}

function fitLabel(
  inWindow: boolean,
  meanC: number,
  nightC: number,
  plant: Plant,
): string {
  if (inWindow) return "in range this month";
  if (meanC > plant.preferredTempC.max + IN_RANGE_SLACK_C) return "too hot";
  if (nightC < plant.frostHardinessC - 1) {
    return `too cold (nights ~${Math.round(nightC)}°)`;
  }
  if (meanC < plant.minSoilTempC - 1) return "soil too cool";
  return `too cold (nights ~${Math.round(nightC)}°)`;
}

export function fitPlantToClimate(
  plant: Plant,
  climate: ClimateStats,
  today: Date,
): WindowFit {
  const thisMonth = today.getUTCMonth();
  const nextMonth = (thisMonth + 1) % 12;
  const meanC = climate.monthlyMeanC[thisMonth];
  const nightC = climate.monthlyMinC[thisMonth];
  const thisScore = monthScore(meanC, nightC, plant);
  const nextScore = monthScore(
    climate.monthlyMeanC[nextMonth],
    climate.monthlyMinC[nextMonth],
    plant,
  );
  const inWindow = monthInRange(meanC, nightC, plant);
  const score = inWindow ? thisScore * 0.8 + nextScore * 0.2 : 0;
  const band = monthsInPreferredBand(plant, climate);
  const window = seasonWindow(today, band.length > 0 ? band : [thisMonth]);

  return {
    score,
    label: fitLabel(inWindow, meanC, nightC, plant),
    windowStart: toIsoDate(window.start),
    windowEnd: toIsoDate(window.end),
    ideal: toIsoDate(window.ideal),
    today: toIsoDate(today),
    inWindow,
    yearRound: window.yearRound,
    season: plantSeason(plant),
    meanC,
    nightC,
    preferredMinC: plant.preferredTempC.min,
    preferredMaxC: plant.preferredTempC.max,
  };
}

export function windowRangeLabel(fit: WindowFit): string {
  if (fit.yearRound) return "Most months stay in range";
  const start = MONTH_SHORT[new Date(`${fit.windowStart}T00:00:00Z`).getUTCMonth()];
  const end = MONTH_SHORT[new Date(`${fit.windowEnd}T00:00:00Z`).getUTCMonth()];
  if (start === end) return `${start} · ${seasonDisplayName(fit.season)}`;
  return `${start} – ${end} · ${seasonDisplayName(fit.season)}`;
}

export function barPosition(fit: WindowFit): number {
  const span = Math.max(fit.preferredMaxC - fit.preferredMinC, 1);
  const t = (fit.meanC - fit.preferredMinC) / span;
  if (fit.inWindow) {
    return clamp(20 + t * 60, 12, 88);
  }
  if (t < 0) return 8;
  if (t > 1) return 92;
  return clamp(20 + t * 60, 8, 92);
}

export function isWindowActive(fit: WindowFit): boolean {
  return fit.inWindow;
}
