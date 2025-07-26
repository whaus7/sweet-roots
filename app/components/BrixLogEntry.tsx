"use client";
import React, { useState } from "react";
import { plantBrixData, PlantBrixData } from "../data/plantBrixData";

interface BrixLogEntryProps {
  onSubmit: (entry: {
    plantName: string;
    brixValue: number;
    date: string;
    notes?: string;
  }) => void;
  preSelectedPlant?: string;
}

export default function BrixLogEntry({
  onSubmit,
  preSelectedPlant,
}: BrixLogEntryProps) {
  const [brixValue, setBrixValue] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>("");

  const selectedPlantData = plantBrixData.find(
    (plant) => plant.name === preSelectedPlant
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!preSelectedPlant || !brixValue || !date) {
      alert("Please fill in all required fields");
      return;
    }

    const brixNum = parseFloat(brixValue);
    if (isNaN(brixNum) || brixNum < 0 || brixNum > 30) {
      alert("Please enter a valid Brix value between 0 and 30");
      return;
    }

    onSubmit({
      plantName: preSelectedPlant,
      brixValue: brixNum,
      date,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setBrixValue("");
    setNotes("");
  };

  const getStatusColor = (brix: number, plantData?: PlantBrixData) => {
    if (!plantData) return "text-gray-500";

    if (brix >= plantData.healthyBrixRange.max) {
      return "text-green-600";
    } else if (brix >= plantData.healthyBrixRange.min) {
      return "text-yellow-600";
    } else {
      return "text-red-600";
    }
  };

  const getStatusText = (brix: number, plantData?: PlantBrixData) => {
    if (!plantData) return "Select a plant";

    if (brix >= plantData.healthyBrixRange.max) {
      return "Excellent";
    } else if (brix >= plantData.healthyBrixRange.min) {
      return "Good";
    } else {
      return "Below Target";
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:items-end gap-4">
          {/* Plant Display (read-only) */}
          <div className="lg:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plant Type
            </label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
              {preSelectedPlant}
            </div>
          </div>

          {/* Date Input */}
          <div className="lg:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Brix Value */}
          <div className="lg:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brix Reading *
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={brixValue}
                onChange={(e) => setBrixValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0-30"
                required
              />
              {brixValue && selectedPlantData && (
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    parseFloat(brixValue),
                    selectedPlantData
                  )}`}
                >
                  {getStatusText(parseFloat(brixValue), selectedPlantData)}
                </span>
              )}
            </div>
          </div>

          {/* Notes Input */}
          <div className="lg:flex-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <input
              value={notes}
              placeholder="Add a note..."
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button for large screens - inline with form */}
          <div className="hidden lg:block">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit Button - Full width on mobile, auto width on medium+ */}
        <div className="flex justify-start lg:hidden">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
