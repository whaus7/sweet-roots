"use client";
import React from "react";
import MapComponent from "@/app/components/map/MapComponent";
import HeroBanner from "@/app/components/HeroBannerNew";

interface PropertyArea {
  id: string;
  name: string;
  polygon: google.maps.Polygon;
  area: number;
}

export default function LandSurveyPage() {
  const handleAreaCreated = (area: PropertyArea) => {
    console.log("New area created:", area);
  };

  const handleAreaUpdated = (area: PropertyArea) => {
    console.log("Area updated:", area);
  };

  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      {/* Full Width Banner */}
      <HeroBanner
        title="Land Survey"
        subtitle="Water is the cornerstone for productive land. Use this tool to help sequester water and prevent it from running off your property."
        backgroundImage="/images/brix-banner.png"
        altText="Land Survey Banner"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MapComponent
          onAreaCreated={handleAreaCreated}
          onAreaUpdated={handleAreaUpdated}
        />
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
