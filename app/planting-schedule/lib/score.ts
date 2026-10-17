import { fitPlantToClimate, isWindowActive } from "./windows";
import type { ClimateStats, Plant, ScoredPlant } from "./types";

export function scorePlants(
  plants: Plant[],
  climate: ClimateStats,
  today: Date,
): ScoredPlant[] {
  return plants
    .map((plant) => {
      const outdoor = fitPlantToClimate(plant, climate, today);
      return {
        plant,
        outdoor,
        sortScore: outdoor.score,
      };
    })
    .filter((item) => item.outdoor.inWindow && item.sortScore > 0)
    .sort((a, b) => {
      if (a.outdoor.canFinishHarvest !== b.outdoor.canFinishHarvest) {
        return a.outdoor.canFinishHarvest ? -1 : 1;
      }
      if (a.outdoor.daysToHarvest !== b.outdoor.daysToHarvest) {
        return a.outdoor.daysToHarvest - b.outdoor.daysToHarvest;
      }
      if (b.sortScore !== a.sortScore) return b.sortScore - a.sortScore;
      return a.plant.varietyName.localeCompare(b.plant.varietyName);
    });
}

export function isVarietyInWindow(item: ScoredPlant): boolean {
  return isWindowActive(item.outdoor);
}
