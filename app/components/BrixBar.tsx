"use client";
import React, { useState, useEffect } from "react";

interface BrixBarProps {
  value: number;
  threshold: number;
  maxBrix: number;
  label: string;
  barWidth: number;
  barHeight: number;
}

export default function BrixBar({
  value,
  threshold,
  maxBrix,
  label,
  barWidth,
  barHeight,
}: BrixBarProps) {
  const [currentValue, setCurrentValue] = useState(0);

  // Animate values on mount
  useEffect(() => {
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

  // Calculate positions
  const getPosition = (value: number) => {
    return Math.min((value / maxBrix) * 100, 100);
  };

  const getThresholdPosition = (threshold: number) => {
    return Math.min((threshold / maxBrix) * 100, 100);
  };

  const position = Math.max(0, Math.min(100, getPosition(currentValue)));
  const thresholdPosition = Math.max(
    0,
    Math.min(100, getThresholdPosition(threshold))
  );

  // Get color for each segment based on Brix value and maxBrix
  const getSegmentColor = (brixValue: number) => {
    // Calculate color based on percentage of maxBrix
    const percentage = (brixValue / maxBrix) * 100;

    if (percentage >= 80) {
      return "#22c55e"; // Green for excellent (80-100% of max)
    } else if (percentage >= 60) {
      return "#84cc16"; // Light green for very good (60-79% of max)
    } else if (percentage >= 40) {
      return "#eab308"; // Yellow for good (40-59% of max)
    } else if (percentage >= 20) {
      return "#f97316"; // Orange for fair (20-39% of max)
    } else {
      return "#ef4444"; // Red for poor (0-19% of max)
    }
  };

  // Determine status and color for the current value
  const getStatus = () => {
    if (currentValue >= threshold) {
      return {
        text: "Excellent",
        color: "text-green-600",
        bgColor: "bg-green-500",
      };
    } else if (currentValue >= threshold * 0.8) {
      return {
        text: "Good",
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
      };
    } else if (currentValue >= threshold * 0.6) {
      return {
        text: "Fair",
        color: "text-orange-600",
        bgColor: "bg-orange-500",
      };
    } else {
      return { text: "Poor", color: "text-red-600", bgColor: "bg-red-500" };
    }
  };

  const status = getStatus();

  return (
    <div className="flex items-center space-x-4">
      <div className="relative drop-shadow-sm" style={{ width: barWidth }}>
        {/* Threshold indicator */}
        {/* <div
          className="absolute top-4 text-xs font-medium text-gray-600"
          style={{
            left: `${thresholdPosition}%`,
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <div className="text-center mt-1">{threshold}</div>
          <div className="text-center w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-gray-600 mx-auto"></div>
        </div> */}

        {/* Value indicator */}
        <div
          className="absolute -top-6 text-xs font-medium text-gray-800"
          style={{
            left: `${position}%`,
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <div className="text-center mt-1">{currentValue.toFixed(1)}</div>
          <div className="text-center w-0 h-0 border-l-6 border-r-6 border-t-8 border-transparent border-t-gray-600 mx-auto"></div>
        </div>

        {/* Bar container */}
        <div
          className="relative bg-gray-200 rounded-full shadow-md"
          style={{ height: barHeight }}
        >
          {/* Segmented background */}
          {Array.from({ length: Math.ceil(maxBrix / 2) }, (_, i) => {
            const segmentStart = i * 2; // Every 2 Brix units
            const segmentMidpoint = segmentStart + 1; // Use midpoint for color
            const color = getSegmentColor(segmentMidpoint);
            const left = (segmentStart / maxBrix) * 100;
            const width = (2 / maxBrix) * 100; // 2 Brix units width

            return (
              <div
                key={i}
                className="absolute h-full"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: color,
                }}
              />
            );
          })}

          {/* Value indicator line */}
          <div
            className={`absolute top-0 bottom-0 w-1 ${status.bgColor} rounded-full`}
            style={{
              left: `${position}%`,
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* Scale markers */}
        <div className="absolute top-8 inset-0 flex justify-between items-center px-2">
          {(() => {
            const markers = [];
            // Always show 0
            markers.push(0);

            // Show intermediate markers every 4 units
            for (let i = 4; i < maxBrix; i += 4) {
              markers.push(i);
            }

            // Always show the max value
            if (maxBrix > 0) {
              markers.push(maxBrix);
            }

            return markers.map((mark) => (
              <div
                key={mark}
                className="text-xs text-gray-600"
                style={{
                  left: `${(mark / maxBrix) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {mark}
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Value display */}
      <div className="text-center" style={{ width: "120px" }}>
        <div className="text-md text-gray-600">{label}</div>
        <div className="text-2xl font-bold text-gray-800">
          {currentValue.toFixed(1)}%
        </div>
        <div className={`text-xs font-medium ${status.color}`}>
          {status.text}
        </div>
        <div className="text-xs text-gray-500">Target: ≥{threshold}</div>
      </div>
    </div>
  );
}
