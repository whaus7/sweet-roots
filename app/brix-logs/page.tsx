"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import BrixLogEntry from "../components/BrixLogEntry";
import BrixReadingCard from "../components/BrixReadingCard";
import { Tile } from "../components/Tile";
import HeroBanner from "../components/HeroBannerNew";
import { brixApi } from "../services/brixApi";
import { plantBrixData, PlantBrixData } from "../data/plantBrixData";
import styles from "./brix-logs.module.css";
import { useUser } from "../contexts/UserContext";
import Login from "../components/Login";

// Sweet Roots Farm master user ID
const SWEET_ROOTS_FARM_USER_ID = "a7e21794-c0aa-4933-84a6-0b03a41d8ef0";

interface LocalBrixReading {
  id: string;
  plantName: string;
  brixValue: number;
  date: string;
  notes?: string;
}

// Plant Type Selection Tile Component
interface PlantTypeTileProps {
  plantName: string;
  isSelected: boolean;
  onClick: () => void;
}

function PlantTypeTile({ plantName, isSelected, onClick }: PlantTypeTileProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
        isSelected
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 text-sm">🌱</span>
        </div>
        <span className="font-semibold text-gray-900">{plantName}</span>
      </div>
    </button>
  );
}

// New Plant Type Select Component
interface NewPlantTypeSelectProps {
  onSelect: (plantName: string) => void;
  existingPlantTypes: string[];
}

function NewPlantTypeSelect({
  onSelect,
  existingPlantTypes,
}: NewPlantTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter out existing plant types and filter by search term
  const availablePlants = plantBrixData
    .filter((plant: PlantBrixData) => !existingPlantTypes.includes(plant.name))
    .filter(
      (plant: PlantBrixData) =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (plantName: string) => {
    onSelect(plantName);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl border-2 transition-all duration-200 text-left w-full ${
          isOpen
            ? "border-blue-500 bg-blue-50 shadow-md"
            : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-sm">➕</span>
          </div>
          <span className="font-semibold text-gray-900">
            Add New Plant Type
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search plant types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="py-2">
            {availablePlants.length > 0 ? (
              availablePlants.map((plant: PlantBrixData) => (
                <button
                  key={plant.name}
                  onClick={() => handleSelect(plant.name)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-xs">🌱</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {plant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {plant.category}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                {searchTerm
                  ? "No matching plant types found"
                  : "No new plant types available"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrixLogsPage() {
  const { user, loading, login } = useUser();
  const [readings, setReadings] = useState<LocalBrixReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlantType, setSelectedPlantType] = useState<string>("");

  const loadReadings = useCallback(
    async (userId: string) => {
      try {
        setLoadingReadings(true);
        setError(null);

        // Try to load from API first
        try {
          const response = await brixApi.getReadings({ user_id: userId });
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

        // Fallback to localStorage only for logged-in users
        if (user) {
          const savedReadings = localStorage.getItem("brixReadings");
          if (savedReadings) {
            setReadings(JSON.parse(savedReadings));
          }
        }
      } catch (error) {
        setError("Failed to load readings");
        console.error("Error loading readings:", error);
      } finally {
        setLoadingReadings(false);
      }
    },
    [user]
  );

  // Load readings on mount
  useEffect(() => {
    if (user) {
      // Load user's own readings
      loadReadings(user.id);
    } else if (!loading) {
      // Load Sweet Roots Farm demo readings
      loadReadings(SWEET_ROOTS_FARM_USER_ID);
    }
  }, [user, loading, loadReadings]);

  // Save readings to localStorage whenever they change (fallback for logged-in users only)
  useEffect(() => {
    if (user) {
      localStorage.setItem("brixReadings", JSON.stringify(readings));
    }
  }, [readings, user]);

  // Get unique plant types from existing readings
  const getUniquePlantTypes = () => {
    const plantTypes = new Set(readings.map((reading) => reading.plantName));
    return Array.from(plantTypes).sort();
  };

  const handleAddReadingToPlant = async (
    plantName: string,
    brixValue: number,
    date: string,
    notes?: string
  ) => {
    if (!user) return; // Only allow adding readings when logged in

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
        user_id: user.id,
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

  const handleSelectPlantType = (plantName: string) => {
    setSelectedPlantType(plantName);
  };

  const handleDeleteReading = async (id: string) => {
    if (!user) return; // Only allow deleting readings when logged in

    // Try to delete from API first
    try {
      await brixApi.deleteReading(id);
    } catch (apiError) {
      console.log("API not available, using localStorage fallback:", apiError);
    }

    // Remove from local state
    setReadings((prev) => prev.filter((reading) => reading.id !== id));
  };

  // Show loading state
  if (loading || loadingReadings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Brix readings...</p>
        </div>
      </div>
    );
  }

  const uniquePlantTypes = getUniquePlantTypes();
  const isDemoMode = !user;

  return (
    <div
      className={`min-h-screen ${styles.brixLogsPage}`}
      style={{ background: "#fcfcfc" }}
    >
      {/* Full Width Banner */}
      <HeroBanner
        title="Brix Logs"
        subtitle="Track your plant Brix readings over time to monitor nutrient density and crop health."
        backgroundImage="/images/brix-banner.png"
        altText="Brix Logs Banner"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Demo Notice for Non-Logged-In Users */}
        {isDemoMode && (
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Demo Text and Learn More Button */}
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">🌾</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sweet Roots Farm Demo
                    </h3>
                    <p className="text-gray-700 mb-4">
                      You&apos;re currently viewing Brix readings from Sweet
                      Roots Farm. This is a demonstration of how the Brix
                      tracking system works. Sign in with your Google account to
                      start tracking your own Brix readings and monitor your
                      crop health.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/details/brix")}
                      className="px-4 py-2 text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50 transition-colors duration-200"
                    >
                      Learn More About Brix
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Login Component */}
              <div className="flex-shrink-0">
                <Login
                  onLoginSuccess={login}
                  onLoginError={(error) => console.error(error)}
                  minimal
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Forms Section - Only show for logged-in users */}
        {!isDemoMode && (
          <div className="mb-8">
            {/* Add Reading Form */}
            <Tile title="Add a Reading" type="brix" altStyle={false}>
              <div className="space-y-6">
                {/* Select existing plant type */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Plant Type
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {uniquePlantTypes.map((plantType) => (
                          <PlantTypeTile
                            key={plantType}
                            plantName={plantType}
                            isSelected={selectedPlantType === plantType}
                            onClick={() => handleSelectPlantType(plantType)}
                          />
                        ))}
                        <NewPlantTypeSelect
                          onSelect={handleSelectPlantType}
                          existingPlantTypes={uniquePlantTypes}
                        />
                      </div>
                    </div>

                    {selectedPlantType && (
                      <div className="mt-6">
                        <BrixLogEntry
                          onSubmit={(entry) => {
                            handleAddReadingToPlant(
                              selectedPlantType,
                              entry.brixValue,
                              entry.date,
                              entry.notes
                            );
                            setSelectedPlantType(""); // Reset selection after adding
                          }}
                          preSelectedPlant={selectedPlantType}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tile>
          </div>
        )}

        {/* Brix Reading Cards */}
        {readings.length > 0 ? (
          <div className="space-y-6">
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
                ([_plantName, plantReadings]) => {
                  console.log(_plantName);
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
                      isDemo={isDemoMode}
                    />
                  </Tile>
                ));
            })()}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isDemoMode
                ? "No Brix readings available"
                : "No Brix readings yet"}
            </h3>
            <p className="text-gray-600">
              {isDemoMode
                ? "Sweet Roots Farm hasn't added any Brix readings yet"
                : "Add your first Brix reading to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
