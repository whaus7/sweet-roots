"use client";

import React from "react";

interface GraphToggleButtonProps {
  showGraph: boolean;
  onToggle: () => void;
  title?: string;
  className?: string;
}

const GraphToggleButton: React.FC<GraphToggleButtonProps> = ({
  showGraph,
  onToggle,
  title,
  className = "absolute -top-14 -right-1 z-10 p-2 hover:bg-gray-50 transition-colors duration-200",
}) => {
  const getTitle = () => {
    if (title) return title;
    return showGraph ? "Show Meter" : "Show Graph";
  };

  return (
    <button onClick={onToggle} className={className} title={getTitle()}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-600"
      >
        {showGraph ? (
          // Meter/Chart/Bar icon (depending on context)
          <>
            <path d="M9 2v6l3 3 3-3V2H9z" />
            <path d="M9 2v6l3 3 3-3V2H9z" />
            <path d="M3 10h18" />
            <path d="M12 2v20" />
          </>
        ) : (
          // Graph icon
          <>
            <path d="M3 3v18h18" />
            <path d="M18 17V9" />
            <path d="M13 17V5" />
            <path d="M8 17v-3" />
          </>
        )}
      </svg>
    </button>
  );
};

export default GraphToggleButton;
