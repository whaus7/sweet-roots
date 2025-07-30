"use client";

import React, { useEffect, useState } from "react";

interface BrixMeterProps {
  brixValue: number; // 0-32% Brix
  size?: number;
}

const BrixMeter: React.FC<BrixMeterProps> = ({ brixValue = 0 }) => {
  const [currentBrix, setCurrentBrix] = useState(0);

  // Calculate the split position based on BRIX value (0-15% maps to 0-100%)
  const getSplitPosition = (brix: number) => {
    const normalizedValue = Math.min(Math.max(brix, 0), 15);
    return (normalizedValue / 15) * 100; // Convert to percentage
  };

  useEffect(() => {
    // Animate the BRIX value
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;
    const targetValue = brixValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Spring animation with easing
      const springProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal =
        startValue + (targetValue - startValue) * springProgress;

      setCurrentBrix(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [brixValue]);

  const splitPosition = getSplitPosition(currentBrix);

  return (
    <div className="flex justify-between gap-6 min-w-[330] mb-6">
      {/* Meter */}
      <div className="flex-shrink-0 ml-[33]">
        <div className="relative w-22 h-45">
          {/* Main thermometer body */}
          <div className="relative h-full drop-shadow-lg">
            {/* Background gradient showing the split */}
            <div
              className="absolute inset-0 transition-all duration-2000 ease-out"
              style={{
                background: `linear-gradient(to bottom, #3b82f6 0%, #3b82f6 ${
                  100 - splitPosition
                }%, #FFFFFF ${100 - splitPosition}%, #FFFFFF 100%)`,
              }}
            />

            {/* Scale markers - every 3 BRIX with 3 markers per section */}
            <div className="absolute inset-0">
              {Array.from({ length: 5 }, (_, section) => {
                const sectionStart = section * 3; // 0, 3, 6, 9, 12
                return Array.from({ length: 3 }, (_, marker) => {
                  const mark = sectionStart + marker; // 0,1,2 then 3,4,5 etc.
                  if (mark > 15) return null; // Don't render beyond 15

                  const position = (mark / 15) * 100;
                  const isMainLabel = mark % 3 === 0; // Every 3rd mark is a main label

                  return (
                    <div
                      key={mark}
                      className="absolute w-full flex justify-between items-center"
                      style={{ top: `${100 - position}%` }}
                    >
                      {/* Left marker */}
                      <div
                        className={`h-0.5 bg-gray-800 ${
                          isMainLabel ? "w-4" : "w-2"
                        }`}
                      ></div>

                      {/* Right marker */}
                      <div
                        className={`h-0.5 bg-gray-800 ${
                          isMainLabel ? "w-4" : "w-2"
                        }`}
                      ></div>
                    </div>
                  );
                });
              })}
            </div>

            {/* Scale labels - every 3 BRIX */}
            <div className="absolute inset-0 flex flex-col justify-between -left-12">
              {[0, 3, 6, 9, 12, 15].map((mark) => {
                const position = (mark / 15) * 100;
                return (
                  <div
                    key={mark}
                    className="absolute text-sm font-bold text-gray-800 text-right w-10"
                    style={{
                      top: `${100 - position}%`,
                      transform: "translateY(-50%)",
                    }}
                  >
                    {mark}%
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quality indicators - positioned to the right of the meter */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div
              className="absolute text-xs font-bold text-green-600"
              style={{
                top: "0%",
                transform: "translateY(-50%)",
                right: "-2rem",
              }}
            >
              High
            </div>
            <div
              className="absolute text-xs font-bold text-red-600"
              style={{
                top: "100%",
                transform: "translateY(-50%)",
                right: "-2.1rem",
              }}
            >
              Low
            </div>
          </div>
        </div>
      </div>

      {/* Readings display - positioned next to the meter */}
      <div className="flex flex-col flex-1">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Brix Reading</div>
          <div className="text-3xl font-bold text-gray-800 mb-4">
            {currentBrix.toFixed(1)}%
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
                <div>0-15%</div>
                <div
                  className={
                    currentBrix >= 12
                      ? "text-green-600"
                      : currentBrix >= 8
                      ? "text-yellow-600"
                      : currentBrix >= 4
                      ? "text-orange-600"
                      : "text-red-600"
                  }
                >
                  {currentBrix >= 12
                    ? "Good"
                    : currentBrix >= 8
                    ? "Moderate"
                    : currentBrix >= 4
                    ? "Poor"
                    : "Very Poor"}
                </div>
                <div className="text-green-600">≥ 12%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrixMeter;
