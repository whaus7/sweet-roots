export type PlantCategory = "vegetable" | "fruit" | "herb";
export type SowMethod = "direct" | "transplant" | "both";
export type Season = "spring" | "summer" | "fall" | "winter" | "cool" | "warm";
export type FrostAnchor = "lastFrost" | "firstFrost";

export type MonthDay = {
  month: number;
  day: number;
};

export type PlantWindow = {
  season: Season;
  relativeTo: FrostAnchor;
  startOffsetDays: number;
  endOffsetDays: number;
};

export type Plant = {
  id: string;
  commonName: string;
  varietyName: string;
  scientificName: string;
  category: PlantCategory;
  tags: string[];
  flavor: string;
  notes: string;
  daysToMaturity: { min: number; max: number };
  sowMethod: SowMethod;
  frostHardinessC: number;
  minSoilTempC: number;
  preferredTempC: { min: number; max: number };
  windows: PlantWindow[];
};

export type FrostCalendar = {
  frostFree: boolean;
  lastFrost: MonthDay | null;
  firstFrost: MonthDay | null;
  yearsWithLastFrost: number;
  yearsWithFirstFrost: number;
};

export type ClimateStats = {
  latitude: number;
  longitude: number;
  timezone: string;
  yearsUsed: number;
  monthlyMeanC: number[];
  monthlyMinC: number[];
  monthlyMaxC: number[];
  outdoor: FrostCalendar;
  greenhouse: FrostCalendar;
};

export type Place = {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

export type WindowFit = {
  score: number;
  label: string;
  windowStart: string;
  windowEnd: string;
  ideal: string;
  today: string;
  inWindow: boolean;
  yearRound: boolean;
  season: Season;
};

export type ScoredPlant = {
  plant: Plant;
  outdoor: WindowFit;
  greenhouse: WindowFit;
  sortScore: number;
};
