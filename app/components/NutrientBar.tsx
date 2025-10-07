"use client";
import React, { useState, useEffect } from "react";

interface NutrientBarProps {
  value: number;
  ideal: { min: number; max: number };
  range: { min: number; max: number };
  label: string;
  unit: string;
  barWidth: number;
  barHeight: number;
}

export default function NutrientBar({
  value,
  ideal,
  range,
  label,
  unit,
  barWidth,
  barHeight,
}: NutrientBarProps) {
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
  const getPosition = (value: number, range: { min: number; max: number }) => {
    return ((value - range.min) / (range.max - range.min)) * 100;
  };

  const getMinPosition = (
    idealMin: number,
    range: { min: number; max: number }
  ) => {
    return ((idealMin - range.min) / (range.max - range.min)) * 100;
  };

  const getMaxPosition = (
    idealMax: number,
    range: { min: number; max: number }
  ) => {
    return ((idealMax - range.min) / (range.max - range.min)) * 100;
  };

  const getIdealPosition = (
    ideal: { min: number; max: number },
    range: { min: number; max: number }
  ) => {
    const start = ((ideal.min - range.min) / (range.max - range.min)) * 100;
    const width = ((ideal.max - ideal.min) / (range.max - range.min)) * 100;
    return { start, width };
  };

  const position = Math.max(0, Math.min(100, getPosition(currentValue, range)));
  const idealPos = getIdealPosition(ideal, range);
  const minPosition = Math.max(
    0,
    Math.min(100, getMinPosition(ideal.min, range))
  );
  const maxPosition = Math.max(
    0,
    Math.min(100, getMaxPosition(ideal.max, range))
  );

  return (
    <div className="flex items-center space-x-4">
      <div className="relative drop-shadow-sm" style={{ width: barWidth }}>
        {/* Minimum ideal indicator */}
        <div
          className="absolute top-4 text-xs font-medium text-gray-400"
          style={{
            left: `${minPosition}%`,
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <div className="text-center mt-1">{ideal.min}</div>
        </div>

        {/* Value indicator */}
        <div
          className="absolute -top-6 text-xs font-medium text-gray-800"
          style={{
            left: `${position}%`,
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <div className="text-center mt-1">
            {currentValue < 10
              ? currentValue.toFixed(1)
              : currentValue.toFixed(0)}
          </div>
          <div className="text-center w-0 h-0 border-l-6 border-r-6 border-t-8 border-transparent border-t-gray-600 mx-auto"></div>
        </div>

        {/* Maximum ideal indicator */}
        <div
          className="absolute top-4 text-xs font-medium text-gray-400"
          style={{
            left: `${maxPosition}%`,
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          <div className="text-center mt-1">{ideal.max}</div>
        </div>

        {/* Bar container */}
        <div
          className="relative bg-white rounded-full"
          style={{ height: barHeight }}
        >
          {/* Ideal range indicator */}
          <div
            className="absolute"
            style={{
              left: `${idealPos.start}%`,
              width: `${idealPos.width}%`,
              height: "100%",
              backgroundColor: "#66d9a8",
            }}
          />
        </div>
      </div>

      {/* Value display */}
      <div className="text-center" style={{ width: "120px" }}>
        <div className="text-2xl font-bold text-gray-800">
          {currentValue.toFixed(1)}
        </div>
        <div className="text-xs text-gray-600">
          {label} ({unit})
        </div>
        <div className="text-xs text-green-600 font-medium">
          Ideal: {ideal.min}-{ideal.max}
        </div>
      </div>
    </div>
  );
}
