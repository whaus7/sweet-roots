import type { MonthDay } from "./types";

const MS_PER_DAY = 86_400_000;

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function calendarDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

export function monthDayToDate(year: number, md: MonthDay): Date {
  return calendarDate(year, md.month, md.day);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / MS_PER_DAY);
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return calendarDate(year, month, day);
}

export function dateToMonthDay(date: Date): MonthDay {
  return {
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

export function dayOfYear(date: Date): number {
  const start = calendarDate(date.getUTCFullYear(), 1, 1);
  return diffDays(date, start) + 1;
}

export function monthDayFromDayOfYear(doy: number): MonthDay {
  return dateToMonthDay(calendarDate(2025, 1, doy));
}

export function shiftMonthDay(md: MonthDay, days: number): MonthDay {
  return dateToMonthDay(addDays(monthDayToDate(2025, md), days));
}

export function daysBetweenMonthDays(from: MonthDay, to: MonthDay): number {
  return diffDays(monthDayToDate(2025, to), monthDayToDate(2025, from));
}

export function todayInTimeZone(timeZone: string): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return calendarDate(get("year"), get("month"), get("day"));
}

export function formatMonthDay(md: MonthDay | null): string | null {
  if (!md) return null;
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(monthDayToDate(2025, md));
}

export function formatIsoDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(parseIsoDate(iso));
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}
