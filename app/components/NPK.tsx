"use client";

import React, { useState } from "react";
import NutrientBar from "./NutrientBar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import GraphToggleButton from "./GraphToggleButton";

interface NPKProps {
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  size?: number;
}

// Placeholder data for NPK history
const placeholderNPKData = [
  { date: "2024-01-01", nitrogen: 45, phosphorus: 4.2, potassium: 175 },
  { date: "2024-01-08", nitrogen: 47, phosphorus: 4.5, potassium: 178 },
  { date: "2024-01-15", nitrogen: 49, phosphorus: 4.8, potassium: 181 },
  { date: "2024-01-22", nitrogen: 51, phosphorus: 5.1, potassium: 184 },
  { date: "2024-01-29", nitrogen: 53, phosphorus: 5.4, potassium: 187 },
  { date: "2024-02-05", nitrogen: 55, phosphorus: 5.7, potassium: 190 },
  { date: "2024-02-12", nitrogen: 57, phosphorus: 6.0, potassium: 193 },
  { date: "2024-02-19", nitrogen: 59, phosphorus: 6.3, potassium: 196 },
  { date: "2024-02-26", nitrogen: 61, phosphorus: 6.6, potassium: 199 },
  { date: "2024-03-05", nitrogen: 63, phosphorus: 6.9, potassium: 202 },
  { date: "2024-03-12", nitrogen: 65, phosphorus: 7.2, potassium: 205 },
  { date: "2024-03-19", nitrogen: 67, phosphorus: 7.5, potassium: 208 },
];

export default function NPK({
  nitrogen = 50,
  phosphorus = 5,
  potassium = 180,
  size = 160,
}: NPKProps) {
  const [showGraph, setShowGraph] = useState(false);

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

  const toggleView = () => {
    setShowGraph(!showGraph);
  };

  return (
    <div className="relative">
      {/* Graph toggle button */}
      <GraphToggleButton
        showGraph={showGraph}
        onToggle={toggleView}
        title={showGraph ? "Show Bars" : "Show Graph"}
      />

      {showGraph ? (
        // Graph View
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-1">NPK History</div>
          </div>

          {/* Chart */}
          <div className="w-full h-64 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={placeholderNPKData}
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
                  domain={[0, 250]}
                  tickFormatter={(value) => `${value} ppm`}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} ppm`,
                    name,
                  ]}
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="nitrogen"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  name="Nitrogen"
                />
                <Line
                  type="monotone"
                  dataKey="phosphorus"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                  name="Phosphorus"
                />
                <Line
                  type="monotone"
                  dataKey="potassium"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
                  name="Potassium"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        // Bars View
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
      )}
    </div>
  );
}
