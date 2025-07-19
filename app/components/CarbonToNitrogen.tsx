"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import GraphToggleButton from "./GraphToggleButton";

interface CarbonToNitrogenProps {
  carbon: number;
  nitrogen: number;
}

// Placeholder data for C:N ratio history
const placeholderCNData = [
  { date: "2024-01-01", carbon: 2.5, nitrogen: 0.1, ratio: 25.0 },
  { date: "2024-01-08", carbon: 2.8, nitrogen: 0.12, ratio: 23.3 },
  { date: "2024-01-15", carbon: 3.1, nitrogen: 0.13, ratio: 23.8 },
  { date: "2024-01-22", carbon: 3.3, nitrogen: 0.14, ratio: 23.6 },
  { date: "2024-01-29", carbon: 3.5, nitrogen: 0.15, ratio: 23.3 },
  { date: "2024-02-05", carbon: 3.7, nitrogen: 0.16, ratio: 23.1 },
  { date: "2024-02-12", carbon: 3.9, nitrogen: 0.17, ratio: 22.9 },
  { date: "2024-02-19", carbon: 4.1, nitrogen: 0.18, ratio: 22.8 },
  { date: "2024-02-26", carbon: 4.3, nitrogen: 0.19, ratio: 22.6 },
  { date: "2024-03-05", carbon: 4.5, nitrogen: 0.2, ratio: 22.5 },
  { date: "2024-03-12", carbon: 4.7, nitrogen: 0.21, ratio: 22.4 },
  { date: "2024-03-19", carbon: 4.9, nitrogen: 0.22, ratio: 22.3 },
];

const CarbonToNitrogen: React.FC<CarbonToNitrogenProps> = ({
  carbon,
  nitrogen,
}) => {
  const [currentRatio, setCurrentRatio] = useState(27.5);
  const [showGraph, setShowGraph] = useState(false);
  const needleRef = useRef<HTMLDivElement>(null);

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

  const toggleView = () => {
    setShowGraph(!showGraph);
  };

  return (
    <div className="relative">
      {/* Graph toggle button */}
      <GraphToggleButton
        showGraph={showGraph}
        onToggle={toggleView}
        title={showGraph ? "Show Meter" : "Show Graph"}
      />

      {showGraph ? (
        // Graph View
        <div className="flex flex-col items-center justify-center min-w-[300]">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-1">C:N Ratio History</div>
          </div>

          {/* Chart */}
          <div className="w-full max-w-2xl h-64 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={placeholderCNData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  domain={[20, 30]}
                  tickFormatter={(value) => `${value}:1`}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}:1`, "C:N Ratio"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="ratio"
                  stroke="#8B4513"
                  strokeWidth={3}
                  dot={{ fill: "#8B4513", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#8B4513", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        // Meter View
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
              <div className="text-5xl font-bold text-green-700">
                {nitrogen}
              </div>
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
                ref={needleRef}
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
              <span className="text-green-600 font-semibold">
                Ideal (25-30)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarbonToNitrogen;
