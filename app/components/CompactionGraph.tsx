"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Placeholder data for Compaction history
const placeholderCompactionData = [
  { date: "2024-01-01", compaction: 150 },
  { date: "2024-01-08", compaction: 180 },
  { date: "2024-01-15", compaction: 220 },
  { date: "2024-01-22", compaction: 280 },
  { date: "2024-01-29", compaction: 320 },
  { date: "2024-02-05", compaction: 350 },
  { date: "2024-02-12", compaction: 380 },
  { date: "2024-02-19", compaction: 420 },
  { date: "2024-02-26", compaction: 450 },
  { date: "2024-03-05", compaction: 480 },
  { date: "2024-03-12", compaction: 520 },
  { date: "2024-03-19", compaction: 580 },
];

interface CompactionGraphProps {
  data?: Array<{ date: string; compaction: number }>;
}

export const CompactionGraph = ({
  data = placeholderCompactionData,
}: CompactionGraphProps) => {
  return (
    <div className="flex justify-between gap-6 min-w-[330]">
      <div className="flex flex-col flex-1">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-1">Compaction History</div>
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
                domain={[0, 600]}
                tickFormatter={(value) => `${value} PSI`}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => [`${value} PSI`, "Compaction"]}
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
                dataKey="compaction"
                stroke="#ff6b35"
                strokeWidth={3}
                dot={{ fill: "#ff6b35", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#ff6b35", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
