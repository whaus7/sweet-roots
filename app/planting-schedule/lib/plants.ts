import catalog from "@/app/planting-schedule/data/plants.json";
import type { Plant } from "./types";

export function loadPlants(): Plant[] {
  return catalog as Plant[];
}

export function categoryLabel(category: Plant["category"]): string {
  if (category === "vegetable") return "Vegetable";
  if (category === "fruit") return "Fruit";
  return "Herb";
}

export function sowLabel(method: Plant["sowMethod"]): string {
  if (method === "direct") return "Direct sow";
  if (method === "transplant") return "Transplant";
  return "Direct sow or transplant";
}
