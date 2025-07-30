"use client";

import { useEffect, useState } from "react";

interface CompactionMeterProps {
  value?: number;
  size?: number;
}

export const CompactionMeter = ({
  value = 0,
  size = 200,
}: CompactionMeterProps) => {
  const [currentValue, setCurrentValue] = useState(0);

  // Reduce SVG size significantly for better fit
  const svgSize = Math.min(size, 180); // Cap at 180px max
  const radius = svgSize / 2 - 15; // Slightly smaller radius
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;

  // Calculate angle for the needle (0-400 maps to -225 to 45 degrees)
  const getAngle = (val: number) => {
    const normalizedValue = Math.min(Math.max(val, 0), 400);
    return -225 + (normalizedValue / 400) * 270;
  };

  // Get color based on value
  const getColor = (val: number) => {
    if (val <= 200) {
      // Green to yellow segments (0-200)
      const segment = Math.floor(val / 50);
      const colors = ["#00ff00", "#40ff00", "#80ff00", "#c0ff00", "#ffff00"];
      return colors[Math.min(segment, 4)];
    } else {
      // Yellow to red segments (200-400)
      const segment = Math.floor((val - 200) / 50);
      const colors = ["#ffff00", "#ffc000", "#ff8000", "#ff4000", "#ff0000"];
      return colors[Math.min(segment, 4)];
    }
  };

  // Create arc path for the meter
  const createArcPath = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  // Create needle path
  const createNeedlePath = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const needleLength = radius * 0.9;
    const needleWidth = 4; // Slightly thinner needle

    const tipX = centerX + needleLength * Math.cos(rad);
    const tipY = centerY + needleLength * Math.sin(rad);

    const perpRad = rad + Math.PI / 2;
    const perpX = needleWidth * Math.cos(perpRad);
    const perpY = needleWidth * Math.sin(perpRad);

    return `M ${centerX - perpX} ${centerY - perpY} L ${tipX} ${tipY} L ${
      centerX + perpX
    } ${centerY + perpY} Z`;
  };

  useEffect(() => {
    // Animate the needle to the target value
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;
    const targetValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Spring animation with easing
      const springProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal =
        startValue + (targetValue - startValue) * springProgress;

      setCurrentValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [value]);

  // Create discrete segments for the meter
  const segments = 8; // 8 segments of 50 units each (0-400)
  const segmentAngle = 270 / segments;

  return (
    <div className="flex justify-between gap-6 min-w-[330] mb-4">
      {/* Meter */}
      <div className="flex-shrink-0">
        <svg width={svgSize} height={svgSize} className="drop-shadow-lg">
          <defs>
            {/* Drop shadow filter */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="2"
                dy="2"
                stdDeviation="3"
                floodColor="rgba(0,0,0,0.3)"
              />
            </filter>
          </defs>
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 15}
            fill="#f8f9fa"
            stroke="#e9ecef"
            strokeWidth="2"
          />
          {/* Meter segments with discrete colors */}
          {Array.from({ length: segments }, (_, i) => {
            const startAngle = -225 + i * segmentAngle;
            const endAngle = startAngle + segmentAngle;
            const segmentValue = i * 50; // Each segment represents 50 units
            const color = getColor(segmentValue);

            return (
              <path
                key={i}
                d={createArcPath(startAngle, endAngle)}
                stroke={color}
                strokeWidth="30"
                fill="none"
              />
            );
          })}
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="12"
            fill="#343a40"
            filter="url(#shadow)"
          />
          {/* Needle */}
          <path
            d={createNeedlePath(getAngle(currentValue))}
            fill="#dc3545"
            filter="url(#shadow)"
          />
          {/* Center dot */}
          <circle cx={centerX} cy={centerY} r="5" fill="#fff" />
          {/* Scale markers - simplified for smaller size */}
          {[0, 100, 200, 300, 400].map((mark) => {
            const angle = getAngle(mark);
            const rad = (angle * Math.PI) / 180;
            const outerX = centerX + (radius + 15) * Math.cos(rad);
            const outerY = centerY + (radius + 15) * Math.sin(rad);
            const innerX = centerX + (radius - 15) * Math.cos(rad);
            const innerY = centerY + (radius - 15) * Math.sin(rad);

            return (
              <line
                key={mark}
                x1={outerX}
                y1={outerY}
                x2={innerX}
                y2={innerY}
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}
          {/* Scale labels - simplified for smaller size */}
          {[0, 100, 200, 300, 400].map((mark) => {
            const angle = getAngle(mark);
            const rad = (angle * Math.PI) / 180;
            const labelRadius = radius * 0.65;
            const x = centerX + labelRadius * Math.cos(rad);
            const y = centerY + labelRadius * Math.sin(rad);

            return (
              <text
                key={mark}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#6c757d"
                fontWeight="bold"
              >
                {mark}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Readings display - positioned next to the meter */}
      <div className="flex flex-col flex-1">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Compaction Reading</div>
          <div className="text-3xl font-bold text-gray-800 mb-4">
            {currentValue.toFixed(0)} PSI
          </div>

          {/* Additional information that can fit in the space */}
          <div className="text-sm text-gray-500">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2 text-right">
                <div className="font-medium">Range:</div>
                <div className="font-medium">Status:</div>
                <div className="font-medium">Target:</div>
              </div>
              <div className="space-y-2 text-left">
                <div>0-400 PSI</div>
                <div
                  className={
                    currentValue <= 200
                      ? "text-green-600"
                      : currentValue <= 300
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {currentValue <= 200
                    ? "Good"
                    : currentValue <= 300
                    ? "Moderate"
                    : "Poor"}
                </div>
                <div className="text-green-600">≤ 200 PSI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
