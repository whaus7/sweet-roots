"use client";
import React, { useState, useEffect } from "react";
import BrixLogEntry from "../components/BrixLogEntry";
import BrixReadingCard from "../components/BrixReadingCard";
import { Tile } from "../components/Tile";
import HeroBanner from "../components/HeroBanner";
import { brixApi } from "../services/brixApi";

interface LocalBrixReading {
  id: string;
  plantName: string;
  brixValue: number;
  date: string;
  notes?: string;
}

export default function BrixLogsPage() {
  const [readings, setReadings] = useState<LocalBrixReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load readings from API on mount
  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load from API first
      try {
        const response = await brixApi.getReadings();
        if (response.success) {
          const localReadings: LocalBrixReading[] = response.data.map(
            (reading) => ({
              id: reading.id,
              plantName: reading.plant_name,
              brixValue: reading.brix_value,
              date: reading.reading_date,
              notes: reading.notes,
            })
          );
          setReadings(localReadings);
          return;
        }
      } catch (apiError) {
        console.log(
          "API not available, using localStorage fallback:",
          apiError
        );
      }

      // Fallback to localStorage
      const savedReadings = localStorage.getItem("brixReadings");
      if (savedReadings) {
        setReadings(JSON.parse(savedReadings));
      }
    } catch (error) {
      setError("Failed to load readings");
      console.error("Error loading readings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save readings to localStorage whenever they change (fallback)
  useEffect(() => {
    localStorage.setItem("brixReadings", JSON.stringify(readings));
  }, [readings]);

  const handleAddReading = async (entry: {
    plantName: string;
    brixValue: number;
    date: string;
    notes?: string;
  }) => {
    const newReading: LocalBrixReading = {
      id: Date.now().toString(),
      ...entry,
    };

    // Try to save to API first
    try {
      const response = await brixApi.createReading({
        plant_name: entry.plantName,
        brix_value: entry.brixValue,
        reading_date: entry.date,
        notes: entry.notes,
      });

      if (response.success) {
        const apiReading: LocalBrixReading = {
          id: response.data.id,
          plantName: response.data.plant_name,
          brixValue: response.data.brix_value,
          date: response.data.reading_date,
          notes: response.data.notes,
        };
        setReadings((prev) => [...prev, apiReading]);
        return;
      }
    } catch (apiError) {
      console.log("API not available, using localStorage fallback:", apiError);
    }

    // Fallback to localStorage
    setReadings((prev) => [...prev, newReading]);
  };

  const handleAddReadingToPlant = async (
    plantName: string,
    brixValue: number,
    date: string,
    notes?: string
  ) => {
    const newReading: LocalBrixReading = {
      id: Date.now().toString(),
      plantName,
      brixValue,
      date,
      notes,
    };

    // Try to save to API first
    try {
      const response = await brixApi.createReading({
        plant_name: plantName,
        brix_value: brixValue,
        reading_date: date,
        notes,
      });

      if (response.success) {
        const apiReading: LocalBrixReading = {
          id: response.data.id,
          plantName: response.data.plant_name,
          brixValue: response.data.brix_value,
          date: response.data.reading_date,
          notes: response.data.notes,
        };
        setReadings((prev) => [...prev, apiReading]);
        return;
      }
    } catch (apiError) {
      console.log("API not available, using localStorage fallback:", apiError);
    }

    // Fallback to localStorage
    setReadings((prev) => [...prev, newReading]);
  };

  const handleDeleteReading = async (id: string) => {
    // Try to delete from API first
    try {
      await brixApi.deleteReading(id);
    } catch (apiError) {
      console.log("API not available, using localStorage fallback:", apiError);
    }

    // Remove from local state
    setReadings((prev) => prev.filter((reading) => reading.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Brix readings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#fcfcfc" }}>
      {/* Full Width Banner */}
      <HeroBanner
        title="Brix Logs"
        subtitle="Track your plant Brix readings over time to monitor nutrient density and crop health."
        backgroundImage="/images/brix-banner.png"
        altText="Brix Logs Banner"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Add New Reading */}
        <Tile title="Add a New Plant Type" type="brix" altStyle={false}>
          <BrixLogEntry onSubmit={handleAddReading} />
        </Tile>

        {/* Brix Reading Cards */}
        {readings.length > 0 ? (
          <div className="space-y-6 mt-6">
            {(() => {
              // Group readings by plant name
              const plantGroups = readings.reduce((groups, reading) => {
                if (!groups[reading.plantName]) {
                  groups[reading.plantName] = [];
                }
                groups[reading.plantName].push(reading);
                return groups;
              }, {} as Record<string, LocalBrixReading[]>);

              // Get the latest reading for each plant
              const latestReadings = Object.entries(plantGroups).map(
                ([plantName, plantReadings]) => {
                  const sortedReadings = plantReadings.sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  );
                  return sortedReadings[0]; // Latest reading
                }
              );

              return latestReadings
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((reading) => (
                  <Tile
                    key={reading.id}
                    title={reading.plantName}
                    type="brix"
                    altStyle={false}
                  >
                    <BrixReadingCard
                      reading={reading}
                      allReadings={readings}
                      onAddReading={handleAddReadingToPlant}
                      onDeleteReading={handleDeleteReading}
                    />
                  </Tile>
                ));
            })()}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Brix readings yet
            </h3>
            <p className="text-gray-600">
              Add your first Brix reading to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
