import catalog from "@/app/planting-schedule/data/plants.json";
import type { Plant } from "./types";

function inferredGreenhousePreference(plant: Plant): boolean {
  if (typeof plant.prefersGreenhouse === "boolean") {
    return plant.prefersGreenhouse;
  }
  return plant.preferredTempC.min >= 16 && plant.frostHardinessC >= 0;
}

export function loadPlants(): Plant[] {
  return (catalog as Plant[]).map((plant) => ({
    ...plant,
    prefersGreenhouse: inferredGreenhousePreference(plant),
  }));
}

export function categoryLabel(category: Plant["category"]): string {
  if (category === "vegetable") return "Vegetable";
  if (category === "fruit") return "Fruit";
  return "Herb";
}

export type PlantType = "leafy" | "herb" | "root" | "veggie" | "fruit";

export const PLANT_TYPES: { id: PlantType; label: string }[] = [
  { id: "leafy", label: "Leafy greens" },
  { id: "herb", label: "Herbs" },
  { id: "root", label: "Root crops" },
  { id: "veggie", label: "Veggies" },
  { id: "fruit", label: "Fruit" },
];

const LEAFY = new Set([
  "African Cabbage",
  "African Nightshade",
  "Agretti",
  "Bok Choy",
  "Cavolo Nero",
  "Chaulai",
  "Cima di Rapa",
  "Claytonia",
  "Collard",
  "Ethiopian Kale",
  "Gai Choy",
  "Gai Lan",
  "Hon Tsai Tai",
  "Komatsuna",
  "Mibuna",
  "Mizuna",
  "Molokhia",
  "Mustard",
  "Mâche",
  "Napa Cabbage",
  "Poi",
  "Puntarelle",
  "Radicchio",
  "Sarson",
  "Senposai",
  "Shungiku",
  "Soko",
  "Spigarello",
  "Tatsoi",
  "Tokyo Bekana",
  "Ugu",
  "Wasabi Arugula",
  "Yu Choy Sum",
  "Yukina Savoy",
]);

const ROOTS = new Set([
  "Beet",
  "Carrot",
  "Daikon",
  "Garlic",
  "Green Meat Radish",
  "Kohlrabi",
  "Oca",
  "Turnip",
  "Watermelon Radish",
  "Winter Radish",
  "Yacon",
]);

const FRUITS = new Set(["Alpine Strawberry", "Ground Cherry", "Kiwano"]);

export function plantType(plant: Plant): PlantType {
  if (plant.category === "herb") return "herb";
  if (ROOTS.has(plant.commonName)) return "root";
  if (FRUITS.has(plant.commonName)) return "fruit";
  if (LEAFY.has(plant.commonName)) return "leafy";
  return "veggie";
}

export function plantTypeLabel(type: PlantType): string {
  return PLANT_TYPES.find((item) => item.id === type)?.label ?? "Veggie";
}

export function sowLabel(method: Plant["sowMethod"]): string {
  if (method === "direct") return "Direct sow";
  if (method === "transplant") return "Transplant";
  return "Direct sow or transplant";
}
