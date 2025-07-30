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

// Placeholder data for PLFA history
const placeholderPLFAData = [
  { date: "2024-01-01", bacteria: 45, fungi: 35, protozoa: 15, other: 5 },
  { date: "2024-01-08", bacteria: 47, fungi: 33, protozoa: 16, other: 4 },
  { date: "2024-01-15", bacteria: 48, fungi: 32, protozoa: 17, other: 3 },
  { date: "2024-01-22", bacteria: 49, fungi: 31, protozoa: 18, other: 2 },
  { date: "2024-01-29", bacteria: 50, fungi: 30, protozoa: 19, other: 1 },
  { date: "2024-02-05", bacteria: 51, fungi: 29, protozoa: 20, other: 0 },
  { date: "2024-02-12", bacteria: 52, fungi: 28, protozoa: 21, other: 0 },
  { date: "2024-02-19", bacteria: 53, fungi: 27, protozoa: 22, other: 0 },
  { date: "2024-02-26", bacteria: 54, fungi: 26, protozoa: 23, other: 0 },
  { date: "2024-03-05", bacteria: 55, fungi: 25, protozoa: 24, other: 0 },
  { date: "2024-03-12", bacteria: 56, fungi: 24, protozoa: 25, other: 0 },
  { date: "2024-03-19", bacteria: 57, fungi: 23, protozoa: 26, other: 0 },
];

interface PLFAGraphProps {
  data?: Array<{
    date: string;
    bacteria: number;
    fungi: number;
    protozoa: number;
    other: number;
  }>;
}

const PLFAGraph: React.FC<PLFAGraphProps> = ({
  data = placeholderPLFAData,
}: PLFAGraphProps) => {
  return (
    <div className="flex justify-between gap-6 min-w-[330] mb-3">
      <div className="flex flex-col flex-1">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">
            Soil Organism History
          </div>
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                width={40}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Organisms"]}
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
                dataKey="bacteria"
                stroke="#FFB3BA"
                strokeWidth={3}
                dot={{ fill: "#FFB3BA", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#FFB3BA", strokeWidth: 2 }}
                name="Bacteria"
              />
              <Line
                type="monotone"
                dataKey="fungi"
                stroke="#87d799"
                strokeWidth={3}
                dot={{ fill: "#87d799", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#87d799", strokeWidth: 2 }}
                name="Fungi"
              />
              <Line
                type="monotone"
                dataKey="protozoa"
                stroke="#8fc3eb"
                strokeWidth={3}
                dot={{ fill: "#8fc3eb", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8fc3eb", strokeWidth: 2 }}
                name="Protozoa"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PLFAGraph;
