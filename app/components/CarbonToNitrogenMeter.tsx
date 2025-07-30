"use client";

import React, { useEffect, useState } from "react";

interface CarbonToNitrogenMeterProps {
  carbon: number;
  nitrogen: number;
}

const CarbonToNitrogenMeter: React.FC<CarbonToNitrogenMeterProps> = ({
  carbon,
  nitrogen,
}: CarbonToNitrogenMeterProps) => {
  const [currentRatio, setCurrentRatio] = useState(27.5);

  // Calculate the C:N ratio
  const ratio = nitrogen > 0 ? carbon / nitrogen : 0;

  // Update currentRatio when ratio changes
  useEffect(() => {
    setCurrentRatio(ratio);
  }, [ratio]);

  // Get color based on ratio value (5-50 range)
  const getColor = (val: number) => {
    if (val >= 25 && val <= 30) {
      return "#00ff00"; // Green for ideal range
    } else if ((val >= 20 && val < 25) || (val > 30 && val <= 35)) {
      return "#80ff00"; // Light green for moderate
    } else if ((val >= 15 && val < 20) || (val > 35 && val <= 40)) {
      return "#ffff00"; // Yellow-green for moderate extremes
    } else if ((val >= 10 && val < 15) || (val > 40 && val <= 45)) {
      return "#ffc000"; // Light orange for higher extremes
    } else if ((val >= 5 && val < 10) || (val > 45 && val <= 50)) {
      return "#ff4000"; // Yellow for higher extremes
    } else {
      return "#ff4000"; // Red for most extreme values
    }
  };

  // Calculate needle position (5-50 range maps to 0-100%)
  const getNeedlePosition = (val: number) => {
    const normalizedValue = Math.min(Math.max(val, 5), 50);
    return ((normalizedValue - 5) / 45) * 100; // Convert to percentage
  };

  // Create segments for the meter (5-50 range, 9 segments of 5 each)
  const segments = 9;
  const segmentWidth = 100 / segments;

  return (
    <div className="flex flex-col items-center justify-center gap-8 min-w-[300]">
      {/* Numerical Display Row */}
      <div className="flex items-center justify-center gap-8">
        {/* Carbon Value */}
        <div className="text-center">
          <div className="text-5xl font-bold text-amber-800">{carbon}</div>
          <div className="text-lg text-gray-600 font-medium">Carbon</div>
        </div>

        {/* Ratio Symbol */}
        <div className="text-6xl font-bold text-gray-400">:</div>

        {/* Nitrogen Value */}
        <div className="text-center">
          <div className="text-5xl font-bold text-green-700">{nitrogen}</div>
          <div className="text-lg text-gray-600 font-medium">Nitrogen</div>
        </div>
      </div>

      {/* Meter Bar */}
      <div className="w-full max-w-2xl ">
        <div className="relative h-8 bg-gray-200 drop-shadow-lg">
          {/* Meter segments */}
          {Array.from({ length: segments }, (_, i) => {
            const segmentStart = 5 + i * 5;
            const segmentMidpoint = segmentStart + 2.5; // Use midpoint for color determination
            const color = getColor(segmentMidpoint);
            const left = i * segmentWidth;

            return (
              <div
                key={i}
                className="absolute h-full"
                style={{
                  left: `${left}%`,
                  width: `${segmentWidth}%`,
                  backgroundColor: color,
                }}
              />
            );
          })}

          {/* Needle marker */}
          <div
            className="absolute top-0 w-1 h-full transform -translate-x-1/2 transition-all duration-2000 ease-out"
            style={{
              left: `${getNeedlePosition(currentRatio)}%`,
            }}
          >
            {/* Needle tip */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-10 border-r-10 border-t-12 border-transparent border-t-green-600"></div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
          <span>25</span>
          <span>30</span>
          <span>35</span>
          <span>40</span>
          <span>45</span>
          <span>50</span>
        </div>

        {/* Range indicators */}
        <div className="flex justify-center mt-2 text-xs text-gray-500">
          <span className="text-green-600 font-semibold">Ideal (25-30)</span>
        </div>
      </div>
    </div>
  );
};

export default CarbonToNitrogenMeter;
