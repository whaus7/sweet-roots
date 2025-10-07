"use client";
import React from "react";
import MapComponent from "@/app/components/map/MapComponent";
import HeroBanner from "@/app/components/HeroBannerNew";
import { PropertyArea } from "@/types/PropertyArea";

export default function LandSurveyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      {/* Full Width Banner */}
      <HeroBanner
        title="Water Flow"
        subtitle="Water is the cornerstone for productive land. Use this tool to help sequester water, prevent excessive runoff from your property and colloborate with neighbors for larger watershed management."
        backgroundImage="/images/water-flow-banner.webp"
        altText="Water Survey Banner"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MapComponent />
      </div>

      <div className="max-w-[1100] mx-auto px-4">
        {/* Water Flow Algorithm Explanation - Always visible below map */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                <path d="M12 6L8 10h8l-4-4z" opacity="0.7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                How the Water Flow Simulation Works
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  This simulation shows how water flows across your land based
                  on elevation data from satellite imagery. Your current view
                  when water flow is toggled will be the calculated area. Zoom
                  in and use the refresh button for a more detailed flow
                  pattern.
                </p>
                <br />
                <p>
                  <strong>How it works:</strong>
                  <br />
                  Water flows from higher elevations to lower elevations. The
                  algorithm creates a grid of points across your map and
                  simulates water movement over multiple steps.
                </p>
                <br />
                <p>
                  <strong>Arrow thickness:</strong>
                  <br />
                  Thicker arrows indicate higher water flow amounts - where more
                  water is moving. Thinner arrows show lighter flow. The arrows
                  point in the direction water is flowing.
                </p>
                <br />
                <p>
                  <strong>Pooling markers:</strong>
                  <br />
                  Show areas where water will accumulate and pool.
                </p>
                <br />
                <p>
                  <strong>Rain Amount Slider:</strong>
                  <br />
                  Adjust the rainfall slider to see how different amounts of
                  precipitation affect water flow patterns.
                </p>
                <br />
                <p>
                  <strong>Save Position:</strong>
                  <br />
                  Saves your current map position and zoom if page is reloaded
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      {/* <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Land Survey Tools Coming Soon
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're developing comprehensive land survey tools to help you analyze
            soil health, create field maps, and plan your agricultural
            operations. Check back soon for advanced mapping and surveying
            capabilities.
          </p>
        </div> */}
    </div>
  );
}
