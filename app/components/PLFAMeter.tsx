"use client";

import React, { useEffect, useState } from "react";

interface PLFAMeterProps {
  bacteria: number; // percentage
  fungi: number; // percentage
  protozoa: number; // percentage
  other: number; // percentage
  size?: number;
}

const PLFAMeterOLD: React.FC<PLFAMeterProps> = ({
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

  return (
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
              <span className="font-semibold">{currentFungi.toFixed(1)}%</span>
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
              <span className="font-semibold">{currentOther.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PLFAMeterOLD;
