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
}

export default function BrixLogEntry({ onSubmit }: BrixLogEntryProps) {
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [brixValue, setBrixValue] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const selectedPlantData = plantBrixData.find(
    (plant) => plant.name === selectedPlant
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlant || !brixValue || !date) {
      alert("Please fill in all required fields");
      return;
    }

    const brixNum = parseFloat(brixValue);
    if (isNaN(brixNum) || brixNum < 0 || brixNum > 30) {
      alert("Please enter a valid Brix value between 0 and 30");
      return;
    }

    onSubmit({
      plantName: selectedPlant,
      brixValue: brixNum,
      date,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSelectedPlant("");
    setBrixValue("");
    setNotes("");
    setShowNoteInput(false);
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Add a New Plant Type
        </h3>
        <button
          type="button"
          onClick={() => setShowNoteInput(!showNoteInput)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Add Note
        </button>
      </div>

      {showNoteInput && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Single Row Layout */}
        <div className="flex items-end gap-4">
          {/* Plant Selection */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plant Type *
            </label>
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a plant...</option>
              {plantBrixData.map((plant) => (
                <option key={plant.name} value={plant.name}>
                  {plant.name} ({plant.category})
                </option>
              ))}
            </select>
            {selectedPlantData && (
              <div className="mt-1 text-xs text-gray-600">
                <span>
                  Target: {selectedPlantData.healthyBrixRange.min}-
                  {selectedPlantData.healthyBrixRange.max} Brix
                </span>
              </div>
            )}
          </div>

          {/* Date Input */}
          <div className="flex-1">
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
          <div className="flex-1">
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
