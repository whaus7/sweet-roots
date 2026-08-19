import {
  addDays,
  calendarDate,
  clamp,
  diffDays,
  monthDayToDate,
  toIsoDate,
} from "./dates";
import type {
  FrostCalendar,
  MonthDay,
  Plant,
  Season,
  WindowFit,
} from "./types";

type Occurrence = {
  start: Date;
  end: Date;
  ideal: Date;
  season: Season;
  yearRound: boolean;
};

function emptyFit(today: Date): WindowFit {
  const iso = toIsoDate(today);
  return {
    score: 0,
    label: "not now",
    windowStart: iso,
    windowEnd: iso,
    ideal: iso,
    today: iso,
    inWindow: false,
    yearRound: false,
    season: "cool",
  };
}

export const PLANTABLE_TOLERANCE_DAYS = 28;
export const PLANTABLE_TOLERANCE_WEEKS = Math.round(
  PLANTABLE_TOLERANCE_DAYS / 7,
);

function clampDate(date: Date, start: Date, end: Date): Date {
  if (diffDays(date, start) < 0) return start;
  if (diffDays(end, date) < 0) return end;
  return date;
}

function avgDaysToMaturity(plant: Plant): number {
  return (plant.daysToMaturity.min + plant.daysToMaturity.max) / 2;
}

/** Peak sow date inside a window — not the calendar middle. */
function occurrenceIdeal(
  start: Date,
  end: Date,
  season: Season,
  plant: Plant,
): Date {
  const span = Math.max(diffDays(end, start), 1);
  const fallish =
    season === "fall" || season === "winter" || season === "cool";
  if (fallish) {
    // Sow as the fall window opens so crops size up before short days.
    // Fast baby greens can wait a couple of weeks; slow crops go out first.
    const delay = clamp(Math.round(28 - avgDaysToMaturity(plant) * 0.3), 4, 18);
    return clampDate(addDays(start, delay), start, end);
  }
  if (season === "summer" || season === "warm") {
    return clampDate(addDays(start, span * 0.55), start, end);
  }
  const fraction = preferredMidC(plant) < 18 ? 0.3 : 0.5;
  return clampDate(addDays(start, span * fraction), start, end);
}

function scoreInWindow(
  today: Date,
  start: Date,
  end: Date,
  ideal: Date,
): number {
  if (diffDays(today, start) < 0 || diffDays(end, today) < 0) return 0;
  const dist = Math.abs(diffDays(today, ideal));
  const half = Math.max(
    diffDays(ideal, start),
    diffDays(end, ideal),
    1,
  );
  return 20 + 80 * (1 - Math.min(dist / half, 1));
}

export function seasonDisplayName(season: Season): string {
  if (season === "cool") return "cool-season";
  if (season === "warm") return "warm-season";
  return season;
}

function weeksPhrase(days: number): string {
  const weeks = Math.max(1, Math.round(Math.abs(days) / 7));
  return weeks === 1 ? "1 week" : `${weeks} weeks`;
}

function inWindowLabel(today: Date, occurrence: Occurrence): string {
  if (occurrence.yearRound) return "good now";
  const delta = diffDays(today, occurrence.ideal);
  if (Math.abs(delta) <= 10) return "ideal this week";
  const daysLeft = diffDays(occurrence.end, today);
  if (delta > 10 && (delta > 21 || daysLeft <= 14)) {
    return `${weeksPhrase(delta)} late`;
  }
  return "good now";
}

function outWindowLabel(today: Date, start: Date, end: Date): string {
  if (diffDays(today, start) < 0) {
    return `too early · opens in ${weeksPhrase(diffDays(start, today))}`;
  }
  if (diffDays(end, today) < 0) {
    return `too late · closed ${weeksPhrase(diffDays(today, end))} ago`;
  }
  return "not now";
}

function withinPlantableTolerance(today: Date, occurrence: Occurrence): boolean {
  if (occurrence.yearRound) return true;
  const untilStart = diffDays(occurrence.start, today);
  if (untilStart > 0) return untilStart <= PLANTABLE_TOLERANCE_DAYS;
  const afterEnd = diffDays(today, occurrence.end);
  if (afterEnd > 0) return afterEnd <= PLANTABLE_TOLERANCE_DAYS;
  return Math.abs(diffDays(today, occurrence.ideal)) <= PLANTABLE_TOLERANCE_DAYS;
}

function rankingScore(today: Date, occurrence: Occurrence): number {
  if (!withinPlantableTolerance(today, occurrence)) return 0;
  const inner = scoreInWindow(
    today,
    occurrence.start,
    occurrence.end,
    occurrence.ideal,
  );
  if (inner > 0) return inner;
  const daysUntilStart = diffDays(occurrence.start, today);
  if (daysUntilStart > 0 && daysUntilStart <= PLANTABLE_TOLERANCE_DAYS) {
    return 8 + 11 * (1 - daysUntilStart / PLANTABLE_TOLERANCE_DAYS);
  }
  const daysAfterEnd = diffDays(today, occurrence.end);
  if (daysAfterEnd > 0 && daysAfterEnd <= PLANTABLE_TOLERANCE_DAYS) {
    return 1 + 7 * (1 - daysAfterEnd / PLANTABLE_TOLERANCE_DAYS);
  }
  return 0;
}

function toFit(today: Date, occurrence: Occurrence | null): WindowFit {
  if (!occurrence) return emptyFit(today);
  const inner = scoreInWindow(
    today,
    occurrence.start,
    occurrence.end,
    occurrence.ideal,
  );
  const inWindow = inner > 0;
  return {
    score: Math.round(rankingScore(today, occurrence)),
    label: inWindow
      ? inWindowLabel(today, occurrence)
      : outWindowLabel(today, occurrence.start, occurrence.end),
    windowStart: toIsoDate(occurrence.start),
    windowEnd: toIsoDate(occurrence.end),
    ideal: toIsoDate(occurrence.ideal),
    today: toIsoDate(today),
    inWindow,
    yearRound: occurrence.yearRound,
    season: occurrence.season,
  };
}

function daysUntilStart(today: Date, occurrence: Occurrence): number {
  return diffDays(occurrence.start, today);
}

function daysAfterEnd(today: Date, occurrence: Occurrence): number {
  return diffDays(today, occurrence.end);
}

function pickBestOccurrence(
  today: Date,
  occurrences: Occurrence[],
): Occurrence | null {
  if (occurrences.length === 0) return null;

  const inWindow = occurrences.filter(
    (occ) =>
      scoreInWindow(today, occ.start, occ.end, occ.ideal) > 0 &&
      withinPlantableTolerance(today, occ),
  );
  if (inWindow.length > 0) {
    return inWindow.reduce((best, occ) =>
      rankingScore(today, occ) > rankingScore(today, best) ? occ : best,
    );
  }

  const upcoming = occurrences.filter((occ) => {
    const days = daysUntilStart(today, occ);
    return days > 0 && days <= PLANTABLE_TOLERANCE_DAYS;
  });
  if (upcoming.length > 0) {
    return upcoming.reduce((best, occ) =>
      daysUntilStart(today, occ) < daysUntilStart(today, best) ? occ : best,
    );
  }

  const missed = occurrences.filter((occ) => {
    const days = daysAfterEnd(today, occ);
    return days > 0 && days <= PLANTABLE_TOLERANCE_DAYS;
  });
  if (missed.length > 0) {
    return missed.reduce((best, occ) =>
      daysAfterEnd(today, occ) < daysAfterEnd(today, best) ? occ : best,
    );
  }

  return null;
}

function frostOccurrences(
  plant: Plant,
  frost: FrostCalendar,
  today: Date,
): Occurrence[] {
  if (frost.frostFree) return [];
  const year = today.getUTCFullYear();
  const years = [year - 1, year, year + 1];
  const occurrences: Occurrence[] = [];

  const anchorDate = (md: MonthDay | null, y: number): Date | null =>
    md ? monthDayToDate(y, md) : null;

  for (const window of plant.windows) {
    const md =
      window.relativeTo === "lastFrost" ? frost.lastFrost : frost.firstFrost;
    if (!md) continue;
    for (const y of years) {
      const anchor = anchorDate(md, y);
      if (!anchor) continue;
      const start = addDays(anchor, window.startOffsetDays);
      const end = addDays(anchor, window.endOffsetDays);
      if (diffDays(end, start) < 0) continue;
      occurrences.push({
        start,
        end,
        ideal: occurrenceIdeal(start, end, window.season, plant),
        season: window.season,
        yearRound: false,
      });
    }
  }

  appendSummerSuccessions(plant, frost, years, occurrences);
  return occurrences;
}

function appendSummerSuccessions(
  plant: Plant,
  frost: FrostCalendar,
  years: number[],
  occurrences: Occurrence[],
) {
  if (!frost.lastFrost || !frost.firstFrost) return;
  if (plantSeason(plant) !== "warm" && plant.minSoilTempC < 16) return;

  const springWindows = plant.windows.filter(
    (window) =>
      window.relativeTo === "lastFrost" &&
      (window.season === "spring" || window.season === "summer"),
  );
  if (springWindows.length === 0) return;

  for (const y of years) {
    const lastFrostDate = monthDayToDate(y, frost.lastFrost);
    let firstFrostDate = monthDayToDate(y, frost.firstFrost);
    if (diffDays(firstFrostDate, lastFrostDate) < 60) {
      firstFrostDate = monthDayToDate(y + 1, frost.firstFrost);
    }
    const lastSow = addDays(
      firstFrostDate,
      -(Math.round(avgDaysToMaturity(plant)) + 7),
    );

    for (const window of springWindows) {
      const springEnd = addDays(lastFrostDate, window.endOffsetDays);
      if (diffDays(lastSow, springEnd) < 14) continue;
      const start = addDays(springEnd, 1);
      if (diffDays(lastSow, start) < 14) continue;
      occurrences.push({
        start,
        end: lastSow,
        ideal: occurrenceIdeal(start, lastSow, "summer", plant),
        season: "summer",
        yearRound: false,
      });
    }
  }
}

function preferredMidC(plant: Plant): number {
  return (plant.preferredTempC.min + plant.preferredTempC.max) / 2;
}

function plantSeason(plant: Plant): Season {
  return preferredMidC(plant) < 18 ? "cool" : "warm";
}

function peakMonthIndex(
  monthlyMeanC: number[],
  season: Season,
  inRange: number[],
): number {
  if (inRange.length === 0) return 0;
  const cool = season === "cool" || season === "winter" || season === "fall";
  const target = cool
    ? Math.min(...inRange.map((month) => monthlyMeanC[month]))
    : Math.max(...inRange.map((month) => monthlyMeanC[month]));
  const plateau = inRange.filter(
    (month) => Math.abs(monthlyMeanC[month] - target) <= 0.6,
  );
  return plateau[Math.floor((plateau.length - 1) / 2)];
}

function monthsAroundPeak(peak: number, count: number): number[] {
  const half = Math.floor(count / 2);
  const set = new Set<number>();
  for (let i = 0; i < count; i += 1) {
    set.add((peak - half + i + 12) % 12);
  }
  return expandFromPeak(set, peak);
}

function monthsInBand(
  monthlyMeanC: number[],
  minC: number,
  maxC: number,
): number[] {
  return monthlyMeanC
    .map((mean, monthIndex) => ({ mean, monthIndex }))
    .filter(({ mean }) => mean >= minC && mean <= maxC)
    .map(({ monthIndex }) => monthIndex);
}

function expandFromPeak(inRange: Set<number>, peak: number): number[] {
  if (!inRange.has(peak)) return [];
  const group = [peak];
  for (let step = 1; step < 12; step += 1) {
    const prev = (peak - step + 12) % 12;
    if (inRange.has(prev)) group.unshift(prev);
    else break;
  }
  for (let step = 1; step < 12; step += 1) {
    const next = (peak + step) % 12;
    if (inRange.has(next)) group.push(next);
    else break;
  }
  return group;
}

function lastDayOfMonth(year: number, month: number): Date {
  if (month === 12) return calendarDate(year, 12, 31);
  return addDays(monthDayToDate(year, { month: month + 1, day: 1 }), -1);
}

function monthGroupToOccurrence(
  group: number[],
  year: number,
  peakMonth: number,
  season: Season,
  yearRound: boolean,
): Occurrence | null {
  if (group.length === 0) return null;
  const wraps = group.length > 1 && group[0] > group[group.length - 1];
  const startMonth = group[0] + 1;
  const endMonth = group[group.length - 1] + 1;

  let start: Date;
  let end: Date;
  if (yearRound || group.length === 12) {
    start = monthDayToDate(year, { month: 1, day: 1 });
    end = monthDayToDate(year, { month: 12, day: 31 });
  } else if (wraps) {
    start = monthDayToDate(year, { month: startMonth, day: 1 });
    end = lastDayOfMonth(year + 1, endMonth);
  } else {
    start = monthDayToDate(year, { month: startMonth, day: 1 });
    end = lastDayOfMonth(year, endMonth);
  }

  let idealYear = year;
  if (wraps && peakMonth < group[0]) idealYear = year + 1;
  const ideal = clampDate(
    monthDayToDate(idealYear, { month: peakMonth + 1, day: 15 }),
    start,
    end,
  );

  return { start, end, ideal, season, yearRound };
}

function temperatureOccurrences(
  plant: Plant,
  monthlyMeanC: number[],
  today: Date,
): Occurrence[] {
  const minC = plant.preferredTempC.min;
  const maxC = plant.preferredTempC.max;
  const season = plantSeason(plant);
  const inRange = monthsInBand(monthlyMeanC, minC, maxC);
  if (inRange.length === 0) return [];

  const peak = peakMonthIndex(monthlyMeanC, season, inRange);
  const amplitude = Math.max(...monthlyMeanC) - Math.min(...monthlyMeanC);
  const yearRound = amplitude < 5 && inRange.length === 12;

  let group = yearRound
    ? Array.from({ length: 12 }, (_, i) => i)
    : expandFromPeak(new Set(inRange), peak);
  if (!yearRound && group.length === 0) {
    group = expandFromPeak(new Set(inRange), inRange[0]);
  }
  if (!yearRound && group.length > 6) {
    group = monthsAroundPeak(peak, 6);
  }

  const year = today.getUTCFullYear();
  const occurrences: Occurrence[] = [];
  for (const y of [year - 1, year, year + 1]) {
    const occurrence = monthGroupToOccurrence(
      group,
      y,
      peak,
      season,
      yearRound,
    );
    if (occurrence) occurrences.push(occurrence);
  }
  return occurrences;
}

function occurrencesFor(
  plant: Plant,
  frost: FrostCalendar,
  monthlyMeanC: number[],
  today: Date,
): Occurrence[] {
  const frostBased = frostOccurrences(plant, frost, today);
  return frostBased.length > 0
    ? frostBased
    : temperatureOccurrences(plant, monthlyMeanC, today);
}

function extendOccurrence(
  occurrence: Occurrence,
  plant: Plant,
  advanceDays: number,
  extendDays: number,
): Occurrence {
  const springish =
    occurrence.season === "spring" ||
    occurrence.season === "summer" ||
    occurrence.season === "warm";
  const fallish =
    occurrence.season === "fall" ||
    occurrence.season === "winter" ||
    occurrence.season === "cool";

  let start = occurrence.start;
  let end = occurrence.end;
  if (springish) start = addDays(start, -advanceDays);
  if (occurrence.season === "winter") {
    // Cover lets you sow into coming cold a little sooner.
    start = addDays(start, -Math.round(extendDays / 2));
    end = addDays(end, extendDays);
  } else if (fallish) {
    // Autumn cools outdoors first; the house stays warmer. Don't open
    // fall sowings early — extend them later into frost instead.
    end = addDays(end, extendDays);
  }
  if (!springish && !fallish) {
    start = addDays(start, -advanceDays);
    end = addDays(end, extendDays);
  }

  return {
    ...occurrence,
    start,
    end,
    ideal: occurrenceIdeal(start, end, occurrence.season, plant),
    yearRound: false,
  };
}

function earlierDate(a: Date, b: Date): Date {
  return diffDays(a, b) <= 0 ? a : b;
}

function laterDate(a: Date, b: Date): Date {
  return diffDays(a, b) >= 0 ? a : b;
}

export function fitPlantToCalendar(
  plant: Plant,
  frost: FrostCalendar,
  monthlyMeanC: number[],
  today: Date,
): WindowFit {
  return toFit(
    today,
    pickBestOccurrence(today, occurrencesFor(plant, frost, monthlyMeanC, today)),
  );
}

export function fitGreenhouseWindow(
  plant: Plant,
  outdoorFrost: FrostCalendar,
  greenhouseFrost: FrostCalendar,
  outdoorMeans: number[],
  greenhouseMeans: number[],
  today: Date,
  advanceDays: number,
  extendDays: number,
): WindowFit {
  const outdoorOcc = pickBestOccurrence(
    today,
    occurrencesFor(plant, outdoorFrost, outdoorMeans, today),
  );
  const greenhouseOccs = occurrencesFor(
    plant,
    greenhouseFrost,
    greenhouseMeans,
    today,
  );
  const sameSeason = outdoorOcc
    ? greenhouseOccs.filter((occ) => occ.season === outdoorOcc.season)
    : greenhouseOccs;
  const nativeGh =
    pickBestOccurrence(today, sameSeason) ??
    pickBestOccurrence(today, greenhouseOccs);

  if (!outdoorOcc && !nativeGh) return emptyFit(today);
  if (outdoorOcc?.yearRound) return toFit(today, outdoorOcc);
  if (!outdoorOcc && nativeGh?.yearRound) return toFit(today, nativeGh);

  const base = outdoorOcc ?? nativeGh;
  if (!base) return emptyFit(today);

  let greenhouse = extendOccurrence(base, plant, advanceDays, extendDays);
  if (nativeGh && !nativeGh.yearRound) {
    const start = earlierDate(greenhouse.start, nativeGh.start);
    const end = laterDate(greenhouse.end, nativeGh.end);
    greenhouse = {
      ...greenhouse,
      start,
      end,
      ideal: occurrenceIdeal(start, end, greenhouse.season, plant),
    };
  }

  return toFit(today, greenhouse);
}

export function windowRangeLabel(fit: WindowFit): string {
  const season = seasonDisplayName(fit.season);
  if (fit.yearRound) return `Year-round · ${season}`;
  const start = Date.parse(`${fit.windowStart}T00:00:00Z`);
  const end = Date.parse(`${fit.windowEnd}T00:00:00Z`);
  if (end - start >= 350 * 86_400_000) return `Year-round · ${season}`;
  return `${formatRange(fit.windowStart)} – ${formatRange(fit.windowEnd)} · ${season}`;
}

function formatRange(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function barPosition(fit: WindowFit): number {
  if (fit.yearRound) return 50;

  const today = Date.parse(`${fit.today}T00:00:00Z`);
  const ideal = Date.parse(`${fit.ideal}T00:00:00Z`);
  const span = PLANTABLE_TOLERANCE_DAYS * 86_400_000;
  if (span <= 0) return 50;

  if (today <= ideal - span) return 0;
  if (today >= ideal + span) return 100;
  return 50 + (50 * (today - ideal)) / span;
}

/** True when the meter is not greyed out. */
export function isWindowActive(fit: WindowFit): boolean {
  if (fit.yearRound) return true;
  if (!fit.inWindow) return false;
  const position = barPosition(fit);
  return position > 0 && position < 100;
}
