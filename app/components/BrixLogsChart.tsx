"use client";
import React, { useState } from "react";
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
import { getPlantByName } from "../data/plantBrixData";

interface BrixReading {
  id: string;
  plantName: string;
  brixValue: number;
  date: string;
  notes?: string;
}

type GroupedBrixData = Record<
  string,
  { date: string; [key: string]: string | number }
>;

interface BrixLogsChartProps {
  readings: BrixReading[];
  selectedPlant?: string;
}

export default function BrixLogsChart({
  readings,
  selectedPlant,
}: BrixLogsChartProps) {
  const [showAllPlants, setShowAllPlants] = useState(false);

  // Filter readings by selected plant if specified
  const filteredReadings = selectedPlant
    ? readings.filter((reading) => reading.plantName === selectedPlant)
    : readings;

  // Group readings by plant for multi-line chart
  const groupedData = filteredReadings.reduce((acc, reading) => {
    const date = reading.date;
    if (!acc[date]) {
      acc[date] = { date };
    }
    acc[date][reading.plantName] = reading.brixValue;
    return acc;
  }, {} as GroupedBrixData);

  const chartData = Object.values(groupedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get unique plants for legend
  const plants = [...new Set(filteredReadings.map((r) => r.plantName))];

  // Generate colors for different plants
  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#84cc16",
  ];

  const getPlantColor = (plantName: string) => {
    const index = plants.indexOf(plantName);
    return colors[index % colors.length];
  };

  const getPlantThreshold = (plantName: string) => {
    const plantData = getPlantByName(plantName);
    return plantData?.healthyBrixRange.min || 8;
  };

  if (readings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Brix Reading History
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No readings available</p>
          <p className="text-sm">
            Add your first Brix reading to see the chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Brix Reading History
          {selectedPlant && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              - {selectedPlant}
            </span>
          )}
        </h3>
        {!selectedPlant && plants.length > 1 && (
          <button
            onClick={() => setShowAllPlants(!showAllPlants)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showAllPlants ? "Show Latest Only" : "Show All Plants"}
          </button>
        )}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
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
              domain={[0, 20]}
              tickFormatter={(value) => `${value}%`}
              width={40}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value}% Brix`,
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

            {/* Render lines for each plant */}
            {plants.map((plantName, i) => {
              const color = getPlantColor(plantName);
              const threshold = getPlantThreshold(plantName);

              return (
                <React.Fragment key={plantName}>
                  {/* Threshold line */}
                  <Line
                    key={`line-${i}`}
                    type="monotone"
                    dataKey={`${plantName}_threshold`}
                    stroke={color}
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    activeDot={false}
                    hide={true}
                    data={chartData.map((item) => ({
                      ...item,
                      [`${plantName}_threshold`]: threshold,
                    }))}
                  />

                  {/* Actual readings line */}
                  <Line
                    type="monotone"
                    dataKey={plantName}
                    stroke={color}
                    strokeWidth={3}
                    dot={{ fill: color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
                    name={plantName}
                  />
                </React.Fragment>
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary statistics */}
      {selectedPlant && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">
            Summary for {selectedPlant}
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Latest Reading:</span>
              <div className="font-semibold">
                {filteredReadings.length > 0
                  ? `${
                      filteredReadings[filteredReadings.length - 1].brixValue
                    }%`
                  : "N/A"}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Average:</span>
              <div className="font-semibold">
                {filteredReadings.length > 0
                  ? `${(
                      filteredReadings.reduce(
                        (sum, r) => sum + r.brixValue,
                        0
                      ) / filteredReadings.length
                    ).toFixed(1)}%`
                  : "N/A"}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Total Readings:</span>
              <div className="font-semibold">{filteredReadings.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
