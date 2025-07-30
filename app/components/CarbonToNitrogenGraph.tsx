"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

interface CarbonToNitrogenGraphProps {
  data?: Array<{
    date: string;
    carbon: number;
    nitrogen: number;
    ratio: number;
  }>;
}

const CarbonToNitrogenGraph: React.FC<CarbonToNitrogenGraphProps> = ({
  data = placeholderCNData,
}: CarbonToNitrogenGraphProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-w-[300]">
      <div className="text-center mb-4">
        <div className="text-sm text-gray-600 mb-1">C:N Ratio History</div>
      </div>

      {/* Chart */}
      <div className="w-full max-w-2xl h-64 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
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
  );
};

export default CarbonToNitrogenGraph;
