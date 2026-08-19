export type TempUnit = "F" | "C";

export const GREENHOUSE_OFFSET_C = 4;

export function cToF(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fromCelsius(celsius: number, unit: TempUnit): number {
  return unit === "C" ? celsius : cToF(celsius);
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  return `${Math.round(fromCelsius(celsius, unit))}°${unit}`;
}

export function formatTempRange(
  minC: number,
  maxC: number,
  unit: TempUnit,
): string {
  return `${Math.round(fromCelsius(minC, unit))}–${Math.round(fromCelsius(maxC, unit))}°${unit}`;
}

export function formatTempDelta(deltaC: number, unit: TempUnit): string {
  const value =
    unit === "C" ? deltaC : Math.round(deltaC * (9 / 5));
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}°${unit}`;
}
