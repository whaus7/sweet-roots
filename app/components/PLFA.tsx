"use client";

import React, { useEffect, useState } from "react";
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

interface PLFAProps {
  bacteria: number; // percentage
  fungi: number; // percentage
  protozoa: number; // percentage
  other: number; // percentage
  size?: number;
}

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

const PLFA: React.FC<PLFAProps> = ({
  bacteria = 0,
  fungi = 0,
  protozoa = 0,
  other = 0,
  size = 200,
}) => {
  const [currentBacteria, setCurrentBacteria] = useState(0);
  const [currentFungi, setCurrentFungi] = useState(0);
  const [currentProtozoa, setCurrentProtozoa] = useState(0);
  const [currentOther, setCurrentOther] = useState(0);
  const [showGraph, setShowGraph] = useState(false);

  // Pastel colors for each organism type
  const colors = {
    bacteria: "#FFB3BA", // Soft pink
    fungi: "#87d799", // Soft green
    protozoa: "#8fc3eb", // Soft blue
    other: "#a0a0a0", // Gray
  };

  // Waffle chart configuration
  const gridSize = 10; // 10x10 grid = 100 squares
  const totalSquares = gridSize * gridSize;

  // Calculate squares for each organism type
  const bacteriaSquares = Math.round((bacteria / 100) * totalSquares);
  const fungiSquares = Math.round((fungi / 100) * totalSquares);
  const protozoaSquares = Math.round((protozoa / 100) * totalSquares);
  const otherSquares = Math.round((other / 100) * totalSquares);

  // Animate values on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Spring animation with easing
      const springProgress = 1 - Math.pow(1 - progress, 3);

      setCurrentBacteria(bacteria * springProgress);
      setCurrentFungi(fungi * springProgress);
      setCurrentProtozoa(protozoa * springProgress);
      setCurrentOther(other * springProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [bacteria, fungi, protozoa, other]);

  // Generate squares for the waffle chart
  const generateSquares = () => {
    const squares = [];
    let bacteriaCount = Math.round((currentBacteria / 100) * totalSquares);
    let fungiCount = Math.round((currentFungi / 100) * totalSquares);
    let protozoaCount = Math.round((currentProtozoa / 100) * totalSquares);
    let otherCount = Math.round((currentOther / 100) * totalSquares);

    for (let i = 0; i < totalSquares; i++) {
      let type = "empty";
      let color = "transparent";

      if (bacteriaCount > 0) {
        type = "bacteria";
        color = colors.bacteria;
        bacteriaCount--;
      } else if (fungiCount > 0) {
        type = "fungi";
        color = colors.fungi;
        fungiCount--;
      } else if (protozoaCount > 0) {
        type = "protozoa";
        color = colors.protozoa;
        protozoaCount--;
      } else if (otherCount > 0) {
        type = "other";
        color = colors.other;
        otherCount--;
      }

      squares.push(
        <div
          key={i}
          className="w-2 h-2 m-0.5 rounded-sm transition-all duration-500 ease-out"
          style={{
            backgroundColor: color,
            opacity: type === "empty" ? 0.1 : 1,
          }}
          title={`${type.charAt(0).toUpperCase() + type.slice(1)}: ${Math.round(
            type === "bacteria"
              ? currentBacteria
              : type === "fungi"
              ? currentFungi
              : type === "protozoa"
              ? currentProtozoa
              : currentOther
          )}%`}
        />
      );
    }

    return squares;
  };

  const toggleView = () => {
    setShowGraph(!showGraph);
  };

  return (
    <div className="relative">
      {/* Graph toggle button */}
      <GraphToggleButton
        showGraph={showGraph}
        onToggle={toggleView}
        title={showGraph ? "Show Chart" : "Show Graph"}
      />

      {showGraph ? (
        // Graph View
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
                  data={placeholderPLFAData}
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
      ) : (
        // Chart View
        <div className="flex justify-between gap-6 min-w-[330] mb-3">
          {/* Waffle Chart */}
          <div className="flex-shrink-0">
            <div
              className="grid gap-0.5"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: `${size}px`,
                height: `${size}px`,
              }}
            >
              {generateSquares()}
            </div>
          </div>

          {/* Readings display - positioned next to the chart */}
          <div className="flex flex-col flex-1">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                Soil Organism Composition
              </div>

              {/* Organism breakdown */}
              <div className="text-sm text-gray-500 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: colors.bacteria }}
                    />
                    <span className="font-medium">Bacteria</span>
                  </div>
                  <span className="font-semibold">
                    {currentBacteria.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: colors.fungi }}
                    />
                    <span className="font-medium">Fungi</span>
                  </div>
                  <span className="font-semibold">
                    {currentFungi.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: colors.protozoa }}
                    />
                    <span className="font-medium">Protozoa</span>
                  </div>
                  <span className="font-semibold">
                    {currentProtozoa.toFixed(1)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: colors.other }}
                    />
                    <span className="font-medium">Other</span>
                  </div>
                  <span className="font-semibold">
                    {currentOther.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PLFA;
