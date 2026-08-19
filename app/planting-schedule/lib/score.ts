import {
  effectiveGreenhouseFrost,
  greenhouseAdvanceDays,
  greenhouseExtendDays,
  greenhouseMonthlyMean,
} from "./climate";
import { todayInTimeZone } from "./dates";
import type { ClimateStats, Plant, ScoredPlant } from "./types";
import {
  fitGreenhouseWindow,
  fitPlantToCalendar,
  isWindowActive,
} from "./windows";

export function scorePlants(
  plants: Plant[],
  climate: ClimateStats,
  today = todayInTimeZone(climate.timezone),
): ScoredPlant[] {
  const greenhouseMeans = greenhouseMonthlyMean(climate);
  const greenhouseFrost = effectiveGreenhouseFrost(
    climate.outdoor,
    climate.greenhouse,
  );
  const advanceDays = greenhouseAdvanceDays(climate.outdoor, climate.greenhouse);
  const extendDays = greenhouseExtendDays(climate.outdoor, climate.greenhouse);

  const scored = plants.map((plant) => {
    const outdoor = fitPlantToCalendar(
      plant,
      climate.outdoor,
      climate.monthlyMeanC,
      today,
    );
    const greenhouse = fitGreenhouseWindow(
      plant,
      climate.outdoor,
      greenhouseFrost,
      climate.monthlyMeanC,
      greenhouseMeans,
      today,
      advanceDays,
      extendDays,
    );
    return {
      plant,
      outdoor,
      greenhouse,
      sortScore: Math.max(outdoor.score, greenhouse.score),
    };
  });

  return scored
    .filter((item) => item.sortScore > 0)
    .sort((a, b) => {
      if (b.sortScore !== a.sortScore) return b.sortScore - a.sortScore;
      return a.plant.commonName.localeCompare(b.plant.commonName);
    });
}

export function isVarietyInWindow(item: ScoredPlant): boolean {
  return isWindowActive(item.outdoor) || isWindowActive(item.greenhouse);
}
