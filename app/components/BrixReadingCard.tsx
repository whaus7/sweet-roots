"use client";
import React, { useState } from "react";
import BrixBar from "./BrixBar";
import { getPlantByName } from "../data/plantBrixData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface BrixReading {
  id: string;
  plantName: string;
  brixValue: number;
  date: string;
  notes?: string;
}

interface BrixReadingCardProps {
  reading: BrixReading;
  allReadings: BrixReading[]; // All readings for this plant
  onAddReading: (
    plantName: string,
    brixValue: number,
    date: string,
    notes?: string
  ) => void;
  onDeleteReading: (id: string) => void;
}

export default function BrixReadingCard({
  reading,
  allReadings,
  onAddReading,
  onDeleteReading,
}: BrixReadingCardProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [newBrixValue, setNewBrixValue] = useState("");
  const [newDate, setNewDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newNotes, setNewNotes] = useState("");

  const plantData = getPlantByName(reading.plantName);
  const threshold = plantData?.healthyBrixRange.min || 8;
  const maxBrix = plantData?.healthyBrixRange.max || 16;

  // Get all readings for this plant, sorted by date
  const plantReadings = allReadings
    .filter((r) => r.plantName === reading.plantName)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get the latest reading for this plant
  const latestReading = plantReadings[plantReadings.length - 1];

  const handleAddReading = () => {
    const brixNum = parseFloat(newBrixValue);
    if (isNaN(brixNum) || brixNum < 0 || brixNum > 30) {
      alert("Please enter a valid Brix value between 0 and 30");
      return;
    }

    onAddReading(reading.plantName, brixNum, newDate, newNotes);
    setNewBrixValue("");
    setNewNotes("");
    setShowNoteInput(false);
    setNewDate(new Date().toISOString().split("T")[0]);
  };

  const getStatusColor = (brix: number) => {
    if (brix >= threshold) {
      return "text-green-600";
    } else if (brix >= threshold * 0.8) {
      return "text-yellow-600";
    } else if (brix >= threshold * 0.6) {
      return "text-orange-600";
    } else {
      return "text-red-600";
    }
  };

  const getStatusText = (brix: number) => {
    if (brix >= threshold) {
      return "Excellent";
    } else if (brix >= threshold * 0.8) {
      return "Good";
    } else if (brix >= threshold * 0.6) {
      return "Fair";
    } else {
      return "Poor";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {reading.plantName}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {plantReadings.length} reading
            {plantReadings.length !== 1 ? "s" : ""}
          </span>
          {plantReadings.length > 1 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>
          )}
          <button
            onClick={() => onDeleteReading(reading.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Section 1: Gradient Graph with History */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Brix History
          </h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={plantReadings.map((r, index) => ({
                  name: `Reading ${index + 1}`,
                  brix: r.brixValue,
                  date: new Date(r.date).toLocaleDateString(),
                }))}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} tick={{ fontSize: 8 }} />
                <YAxis
                  domain={[0, 20]}
                  fontSize={10}
                  tick={{ fontSize: 8 }}
                  width={30}
                />
                <Tooltip
                  formatter={(value, name) => [value, "Brix %"]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.date;
                    }
                    return label;
                  }}
                />
                <ReferenceLine
                  y={threshold}
                  stroke="green"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  label={{
                    value: `Target: ${threshold}%`,
                    position: "right",
                    fill: "green",
                    fontSize: 10,
                  }}
                />
                <Bar dataKey="brix" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 2: BrixBar */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Latest Reading
          </h4>
          <BrixBar
            value={latestReading?.brixValue || reading.brixValue}
            threshold={threshold}
            maxBrix={maxBrix}
            label="Brix"
            barWidth={200}
            barHeight={20}
          />
          {latestReading && (
            <div className="mt-2 text-xs text-gray-600">
              Latest: {latestReading.brixValue}% on{" "}
              {new Date(latestReading.date).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Section 3: Add New Reading */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Add Reading
          </h4>

          {/* Date Input */}
          <div className="mb-3">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Brix Input */}
          <div className="mb-3">
            <input
              type="number"
              step="0.1"
              min="0"
              max="30"
              value={newBrixValue}
              onChange={(e) => setNewBrixValue(e.target.value)}
              placeholder="Enter Brix value"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notes Link */}
          <div className="mb-3">
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              {newNotes ? "Edit Note" : "Add Note"}
            </button>
            {showNoteInput && (
              <div className="mt-2">
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddReading}
            disabled={!newBrixValue}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Reading
          </button>
        </div>
      </div>

      {/* Display reading history */}
      {plantReadings.length > 1 && showHistory && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h5 className="text-sm font-medium text-gray-800 mb-2">
            Reading History
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 px-2">Date</th>
                  <th className="text-center py-1 px-2">Brix</th>
                  <th className="text-center py-1 px-2">Status</th>
                  <th className="text-left py-1 px-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {plantReadings
                  .slice(-5)
                  .reverse()
                  .map((r) => (
                    <tr key={r.id} className="border-b border-gray-100">
                      <td className="py-1 px-2">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="py-1 px-2 text-center font-medium">
                        {r.brixValue}%
                      </td>
                      <td
                        className={`py-1 px-2 text-center ${getStatusColor(
                          r.brixValue
                        )}`}
                      >
                        {getStatusText(r.brixValue)}
                      </td>
                      <td
                        className="py-1 px-2 max-w-32 truncate"
                        title={r.notes || ""}
                      >
                        {r.notes || ""}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Display current notes if they exist */}
      {latestReading?.notes && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Latest Notes:</strong> {latestReading.notes}
          </p>
        </div>
      )}
    </div>
  );
}
