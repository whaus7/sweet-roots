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

// Placeholder data for BRIX history
const placeholderBrixData = [
  { date: "2024-01-01", brix: 8.2 },
  { date: "2024-01-08", brix: 9.1 },
  { date: "2024-01-15", brix: 10.5 },
  { date: "2024-01-22", brix: 11.8 },
  { date: "2024-01-29", brix: 12.3 },
  { date: "2024-02-05", brix: 13.1 },
  { date: "2024-02-12", brix: 12.8 },
  { date: "2024-02-19", brix: 13.5 },
  { date: "2024-02-26", brix: 14.2 },
  { date: "2024-03-05", brix: 13.9 },
  { date: "2024-03-12", brix: 14.7 },
  { date: "2024-03-19", brix: 15.1 },
];

interface BrixGraphProps {
  data?: Array<{ date: string; brix: number }>;
}

const BrixGraph: React.FC<BrixGraphProps> = ({
  data = placeholderBrixData,
}: BrixGraphProps) => {
  return (
    <div className="flex justify-between gap-6 min-w-[330]">
      <div className="flex flex-col flex-1">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">Brix History</div>
        </div>

        {/* Chart */}
        <div className="h-64 rounded-lg">
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
                domain={[0, 16]}
                tickFormatter={(value) => `${value}%`}
                width={40}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Brix"]}
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
                dataKey="brix"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BrixGraph;
