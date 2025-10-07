"use client";

import React, { useEffect, useState } from "react";

interface PLFADonutChartProps {
  bacteria: number; // percentage
  fungi: number; // percentage
  protozoa: number; // percentage
  other: number; // percentage
  size?: number;
}

const PLFADonutChart: React.FC<PLFADonutChartProps> = ({
  bacteria = 0,
  fungi = 0,
  protozoa = 0,
  other = 0,
  size = 240,
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    bacteria: 0,
    fungi: 0,
    protozoa: 0,
    other: 0,
  });

  // Colors for each organism type
  const colors = {
    bacteria: "#FF6B6B", // Coral red
    fungi: "#B19CD9", // Violet
    protozoa: "#45B7D1", // Sky blue
    other: "#A0A0A0", // Grey
  };

  // Animate values on mount and when props change
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        bacteria: bacteria * easeOutCubic,
        fungi: fungi * easeOutCubic,
        protozoa: protozoa * easeOutCubic,
        other: other * easeOutCubic,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [bacteria, fungi, protozoa, other]);

  // Calculate cumulative percentages for pie chart segments
  const total =
    animatedValues.bacteria +
    animatedValues.fungi +
    animatedValues.protozoa +
    animatedValues.other;
  const bacteriaPercent =
    total > 0 ? (animatedValues.bacteria / total) * 100 : 0;
  const fungiPercent = total > 0 ? (animatedValues.fungi / total) * 100 : 0;
  const protozoaPercent =
    total > 0 ? (animatedValues.protozoa / total) * 100 : 0;
  const otherPercent = total > 0 ? (animatedValues.other / total) * 100 : 0;

  // SVG path calculations for donut chart
  const radius = (size - 40) / 2; // Account for stroke width
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = 20;

  // Helper function to create SVG arc path
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number
  ) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      endAngle
    );
    const innerEnd = polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      startAngle
    );

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      "Z",
    ].join(" ");
  };

  // Helper function to convert polar coordinates to cartesian
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Calculate angles for each segment
  let currentAngle = 0;
  const bacteriaAngle = (bacteriaPercent / 100) * 360;
  const fungiAngle = (fungiPercent / 100) * 360;
  const protozoaAngle = (protozoaPercent / 100) * 360;
  const otherAngle = (otherPercent / 100) * 360;

  const segments = [
    {
      name: "Bacteria",
      percentage: bacteriaPercent,
      angle: bacteriaAngle,
      color: colors.bacteria,
      startAngle: currentAngle,
      endAngle: currentAngle + bacteriaAngle,
    },
    {
      name: "Fungi",
      percentage: fungiPercent,
      angle: fungiAngle,
      color: colors.fungi,
      startAngle: (currentAngle += bacteriaAngle),
      endAngle: currentAngle + fungiAngle,
    },
    {
      name: "Protozoa",
      percentage: protozoaPercent,
      angle: protozoaAngle,
      color: colors.protozoa,
      startAngle: (currentAngle += fungiAngle),
      endAngle: currentAngle + protozoaAngle,
    },
    {
      name: "Other",
      percentage: otherPercent,
      angle: otherAngle,
      color: colors.other,
      startAngle: (currentAngle += protozoaAngle),
      endAngle: currentAngle + otherAngle,
    },
  ].filter((segment) => segment.percentage > 0);

  return (
    <div className="flex justify-between gap-4 min-w-[330px] mb-3">
      {/* Donut Chart */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />

          {/* Chart segments */}
          {segments.map((segment, index) => (
            <path
              key={segment.name}
              d={createArcPath(
                segment.startAngle,
                segment.endAngle,
                radius - strokeWidth / 2,
                radius
              )}
              fill={segment.color}
              className="transition-all duration-1000 ease-out"
              style={{
                stroke: segment.color,
                strokeWidth: 2,
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.1))`,
              }}
            />
          ))}
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="text-lg font-bold text-gray-800">
            {total.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 text-center">Total</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col flex-1 justify-center">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-2">
            Soil Organism Composition
          </div>
        </div>

        {/* Organism breakdown */}
        <div className="text-sm text-gray-500 space-y-3">
          {segments.map((segment) => (
            <div
              key={segment.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="font-medium">{segment.name}</span>
              </div>
              <span className="font-semibold">
                {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PLFADonutChart;
