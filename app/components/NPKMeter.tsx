"use client";

import React from "react";
import NutrientBar from "./NutrientBar";

interface NPKMeterProps {
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  size?: number;
}

const NPKMeter: React.FC<NPKMeterProps> = ({
  nitrogen = 50,
  phosphorus = 5,
  potassium = 180,
  size = 160,
}: NPKMeterProps) => {
  // Ideal ranges
  const nitrogenIdeal = { min: 40, max: 60 };
  const phosphorusIdeal = { min: 4, max: 6 };
  const potassiumIdeal = { min: 170, max: 190 };

  // Calculate bar ranges (3x the ideal range)
  const nitrogenRange = { min: 30, max: 70 }; // 40-60 ideal, so 30-70 total
  const phosphorusRange = { min: 3, max: 7 }; // 4-6 ideal, so 3-7 total
  const potassiumRange = { min: 160, max: 200 }; // 170-190 ideal, so 160-200 total

  const barHeight = 18;
  const barWidth = size * 1.2;

  return (
    <div className="flex flex-col items-center space-y-4">
      <NutrientBar
        value={nitrogen}
        ideal={nitrogenIdeal}
        range={nitrogenRange}
        label="Nitrogen"
        unit="ppm"
        barWidth={barWidth}
        barHeight={barHeight}
      />

      <NutrientBar
        value={phosphorus}
        ideal={phosphorusIdeal}
        range={phosphorusRange}
        label="Phosphorus"
        unit="ppm"
        barWidth={barWidth}
        barHeight={barHeight}
      />

      <NutrientBar
        value={potassium}
        ideal={potassiumIdeal}
        range={potassiumRange}
        label="Potassium"
        unit="ppm"
        barWidth={barWidth}
        barHeight={barHeight}
      />
    </div>
  );
};

export default NPKMeter;
