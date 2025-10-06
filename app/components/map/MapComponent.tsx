"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import ContextMenu from "./ContextMenu";
import { ElevationAlgorithm } from "./ElevationAlgorithm";
import { WaterFlowAlgorithm } from "./WaterFlowAlgorithm";
import { TerrainAlgorithm } from "./TerrainAlgorithm";
import { OrganicTerrainAlgorithm } from "./OrganicTerrainAlgorithm";

interface PropertyArea {
  id: string;
  name: string;
  polygon: google.maps.Polygon;
  area: number;
}

interface MapComponentProps {
  onAreaCreated?: (area: PropertyArea) => void;
  onAreaUpdated?: (area: PropertyArea) => void;
}

export default function MapComponent({
  onAreaCreated,
  onAreaUpdated,
}: MapComponentProps) {
  console.log(onAreaUpdated);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );
  const elevationAlgorithmRef = useRef<ElevationAlgorithm | null>(null);
  const waterFlowAlgorithmRef = useRef<WaterFlowAlgorithm | null>(null);
  const terrainAlgorithmRef = useRef<TerrainAlgorithm | null>(null);
  const organicTerrainAlgorithmRef = useRef<OrganicTerrainAlgorithm | null>(
    null
  );

  const [areas, setAreas] = useState<PropertyArea[]>([]);
  // const [isDrawing, setIsDrawing] = useState(false);
  const [selectedArea, setSelectedArea] = useState<PropertyArea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    position: { x: number; y: number };
    area: PropertyArea | null;
  }>({
    isVisible: false,
    position: { x: 0, y: 0 },
    area: null,
  });
  const [isElevationView, setIsElevationView] = useState(false);
  const [isWaterFlowView, setIsWaterFlowView] = useState(false);
  const [isTerrainView, setIsTerrainView] = useState(false);
  const [isOrganicTerrainView, setIsOrganicTerrainView] = useState(false);
  const [showPoolMarkers, setShowPoolMarkers] = useState(false);
  const [showTerrainMarkers, setShowTerrainMarkers] = useState(false);
  const [showOrganicTerrainMarkers, setShowOrganicTerrainMarkers] =
    useState(false);
  const [rainfallAmount, setRainfallAmount] = useState(2); // inches
  const [terraceCount, setTerraceCount] = useState(8);
  const [hasSavedState, setHasSavedState] = useState(false);

  // Function to highlight a polygon
  const highlightPolygon = (
    polygon: google.maps.Polygon,
    isHighlighted: boolean
  ) => {
    if (isHighlighted) {
      polygon.setOptions({
        fillColor: "#FF0000",
        fillOpacity: 0.4,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 4,
      });
    } else {
      polygon.setOptions({
        fillColor: "#FF0000",
        fillOpacity: 0.3,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });
    }
  };

  useEffect(() => {
    const initMap = async () => {
      // Prevent multiple map initializations
      if (mapInstanceRef.current) {
        return;
      }

      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        const errorMsg =
          "Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file";
        console.error(errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      const loader = new Loader({
        apiKey,
        version: "weekly",
        libraries: ["drawing", "geometry", "elevation"],
      });

      try {
        const google = await loader.load();

        if (mapRef.current) {
          // Try to restore saved map state
          const savedState = localStorage.getItem("mapState");
          let initialCenter = { lat: 47.6128, lng: -122.006 }; // Default to Seattle
          let initialZoom = 10;

          if (savedState) {
            try {
              const mapState = JSON.parse(savedState);
              initialCenter = {
                lat: mapState.center.lat,
                lng: mapState.center.lng,
              };
              initialZoom = mapState.zoom;
            } catch (error) {
              console.error("Error parsing saved map state:", error);
            }
          }

          const map = new google.maps.Map(mapRef.current, {
            center: initialCenter,
            zoom: initialZoom,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            gestureHandling: "greedy", // Enable mouse wheel zoom without Ctrl key
          });

          mapInstanceRef.current = map;

          // Initialize algorithm instances
          elevationAlgorithmRef.current = new ElevationAlgorithm(map);
          waterFlowAlgorithmRef.current = new WaterFlowAlgorithm(map);
          terrainAlgorithmRef.current = new TerrainAlgorithm(map);
          organicTerrainAlgorithmRef.current = new OrganicTerrainAlgorithm(map);

          // Initialize drawing manager
          const drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON],
            },
            polygonOptions: {
              fillColor: "#FF0000",
              fillOpacity: 0.3,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              draggable: true,
            },
          });

          drawingManager.setMap(map);
          drawingManagerRef.current = drawingManager;

          // Listen for polygon completion
          google.maps.event.addListener(
            drawingManager,
            "polygoncomplete",
            (polygon: google.maps.Polygon) => {
              const areaId = `area_${Date.now()}`;
              const area = calculatePolygonArea(polygon);

              // Set polygon styling to maintain visibility after completion
              polygon.setOptions({
                fillColor: "#FF0000",
                fillOpacity: 0.3,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 3,
                clickable: true,
                editable: true,
                draggable: true,
              });

              const newArea: PropertyArea = {
                id: areaId,
                name: `Property ${areas.length + 1}`,
                polygon,
                area,
              };

              setAreas((prev) => [...prev, newArea]);
              onAreaCreated?.(newArea);

              // Add click listener to polygon for editing
              polygon.addListener("click", () => {
                // Unhighlight previously selected area
                if (selectedArea) {
                  highlightPolygon(selectedArea.polygon, false);
                }
                // Highlight the newly selected area
                highlightPolygon(polygon, true);
                setSelectedArea(newArea);
              });

              // Add right-click listener for context menu
              polygon.addListener(
                "rightclick",
                (event: google.maps.MapMouseEvent) => {
                  if (event.domEvent) {
                    event.domEvent.preventDefault();
                    showContextMenu(event, newArea);
                  }
                }
              );
            }
          );

          // Reset drawing mode after polygon completion (without zoom reset)
          google.maps.event.addListener(
            drawingManager,
            "overlaycomplete",
            () => {
              drawingManager.setDrawingMode(null);
              // Note: Removed automatic zoom reset to maintain current view
            }
          );

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setError(
          "Failed to load Google Maps. Please check your API key and internet connection."
        );
        setIsLoading(false);
      }
    };

    initMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onAreaCreated]);

  // Effect to maintain highlighting of selected area
  useEffect(() => {
    if (selectedArea && selectedArea.polygon) {
      highlightPolygon(selectedArea.polygon, true);
    }
  }, [selectedArea]);

  // Effect to handle elevation view changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (isElevationView) {
        mapInstanceRef.current.setMapTypeId(google.maps.MapTypeId.TERRAIN);
      } else {
        mapInstanceRef.current.setMapTypeId(google.maps.MapTypeId.SATELLITE);
      }
    }
  }, [isElevationView]);

  // Effect to handle water flow view changes
  useEffect(() => {
    if (isWaterFlowView && waterFlowAlgorithmRef.current) {
      waterFlowAlgorithmRef.current
        .generateWaterFlowSimulation(rainfallAmount)
        .then(() => {
          // Sync pool markers visibility state after generation
          if (waterFlowAlgorithmRef.current) {
            setShowPoolMarkers(
              waterFlowAlgorithmRef.current.arePoolMarkersVisible()
            );
          }
        })
        .catch((error) =>
          console.error("Error generating water flow simulation:", error)
        );
    } else if (!isWaterFlowView && waterFlowAlgorithmRef.current) {
      waterFlowAlgorithmRef.current.clearWaterFlowData();
      setShowPoolMarkers(false); // Reset to default when clearing
    }
  }, [isWaterFlowView, rainfallAmount]);

  // Effect to handle terrain view changes
  useEffect(() => {
    if (isTerrainView && terrainAlgorithmRef.current) {
      terrainAlgorithmRef.current
        .generateTerrainVisualization(undefined, 500, terraceCount)
        .then(() => {
          // Sync terrain markers visibility state after generation
          if (terrainAlgorithmRef.current) {
            setShowTerrainMarkers(
              terrainAlgorithmRef.current.areMarkersVisible()
            );
          }
        })
        .catch((error) =>
          console.error("Error generating terrain visualization:", error)
        );
    } else if (!isTerrainView && terrainAlgorithmRef.current) {
      terrainAlgorithmRef.current.clearTerrainData();
      setShowTerrainMarkers(false); // Reset to default when clearing
    }
  }, [isTerrainView, terraceCount]);

  // Effect to handle organic terrain view changes
  useEffect(() => {
    if (isOrganicTerrainView && organicTerrainAlgorithmRef.current) {
      organicTerrainAlgorithmRef.current
        .generateOrganicTerrainVisualization(undefined, 22, terraceCount)
        .then(() => {
          // Sync organic terrain markers visibility state after generation
          if (organicTerrainAlgorithmRef.current) {
            setShowOrganicTerrainMarkers(
              organicTerrainAlgorithmRef.current.areMarkersVisible()
            );
          }
        })
        .catch((error) =>
          console.error(
            "Error generating organic terrain visualization:",
            error
          )
        );
    } else if (!isOrganicTerrainView && organicTerrainAlgorithmRef.current) {
      organicTerrainAlgorithmRef.current.clearOrganicTerrainData();
      setShowOrganicTerrainMarkers(false); // Reset to default when clearing
    }
  }, [isOrganicTerrainView, terraceCount]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (elevationAlgorithmRef.current) {
        elevationAlgorithmRef.current.clearElevationData();
      }
      if (waterFlowAlgorithmRef.current) {
        waterFlowAlgorithmRef.current.clearWaterFlowData();
      }
      if (terrainAlgorithmRef.current) {
        terrainAlgorithmRef.current.clearTerrainData();
      }
      if (organicTerrainAlgorithmRef.current) {
        organicTerrainAlgorithmRef.current.clearOrganicTerrainData();
      }
    };
  }, []);

  const calculatePolygonArea = (polygon: google.maps.Polygon): number => {
    const path = polygon.getPath();
    return google.maps.geometry.spherical.computeArea(path);
  };

  const showContextMenu = (
    event: google.maps.MapMouseEvent,
    area: PropertyArea
  ) => {
    if (mapInstanceRef.current && mapRef.current) {
      // Get the map container's position
      const mapContainer = mapRef.current;
      const mapRect = mapContainer.getBoundingClientRect();

      // Convert lat/lng to pixel coordinates using the map's projection
      const projection = mapInstanceRef.current.getProjection();
      if (projection && event.latLng) {
        const pixel = projection.fromLatLngToPoint(event.latLng);
        if (pixel) {
          const scale = Math.pow(2, mapInstanceRef.current.getZoom()!);
          const x = mapRect.left + pixel.x * scale;
          const y = mapRect.top + pixel.y * scale;

          setContextMenu({
            isVisible: true,
            position: { x, y },
            area,
          });
        }
      }
    }
  };

  // const startDrawing = () => {
  //   if (drawingManagerRef.current) {
  //     drawingManagerRef.current.setDrawingMode(
  //       google.maps.drawing.OverlayType.POLYGON
  //     );
  //     setIsDrawing(true);
  //   }
  // };

  // const stopDrawing = () => {
  //   if (drawingManagerRef.current) {
  //     drawingManagerRef.current.setDrawingMode(null);
  //     setIsDrawing(false);
  //   }
  // };

  const formatArea = (area: number): string => {
    const acres = area * 0.000247105; // Convert square meters to acres
    return `${acres.toFixed(2)} acres`;
  };

  const handleRenameArea = () => {
    if (!contextMenu.area) return;
    const newName = prompt("Enter new name:", contextMenu.area.name);
    if (newName) {
      setAreas((prev) =>
        prev.map((area) =>
          area.id === contextMenu.area!.id ? { ...area, name: newName } : area
        )
      );
      if (selectedArea?.id === contextMenu.area.id) {
        setSelectedArea({ ...selectedArea, name: newName });
      }
    }
    setContextMenu({ isVisible: false, position: { x: 0, y: 0 }, area: null });
  };

  const handleDeleteArea = () => {
    if (!contextMenu.area) return;
    if (confirm("Are you sure you want to delete this area?")) {
      setAreas((prev) => {
        const updated = prev.filter((area) => area.id !== contextMenu.area!.id);
        contextMenu.area!.polygon.setMap(null);
        return updated;
      });
      if (selectedArea?.id === contextMenu.area.id) {
        setSelectedArea(null);
      }
    }
    setContextMenu({ isVisible: false, position: { x: 0, y: 0 }, area: null });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ isVisible: false, position: { x: 0, y: 0 }, area: null });
  };

  const toggleWaterFlowView = async () => {
    const newWaterFlowView = !isWaterFlowView;
    setIsWaterFlowView(newWaterFlowView);

    if (newWaterFlowView && waterFlowAlgorithmRef.current) {
      try {
        await waterFlowAlgorithmRef.current.generateWaterFlowSimulation(
          rainfallAmount
        );
      } catch (error) {
        console.error("Error generating water flow simulation:", error);
      }
    } else if (!newWaterFlowView && waterFlowAlgorithmRef.current) {
      waterFlowAlgorithmRef.current.clearWaterFlowData();
    }
  };

  const refreshWaterFlow = async () => {
    if (waterFlowAlgorithmRef.current && isWaterFlowView) {
      try {
        // Clear existing water flow data first
        waterFlowAlgorithmRef.current.clearWaterFlowData();
        // Regenerate with current settings
        await waterFlowAlgorithmRef.current.generateWaterFlowSimulation(
          rainfallAmount
        );
        // Sync pool markers visibility state after regeneration
        if (waterFlowAlgorithmRef.current) {
          setShowPoolMarkers(
            waterFlowAlgorithmRef.current.arePoolMarkersVisible()
          );
        }
      } catch (error) {
        console.error("Error refreshing water flow simulation:", error);
      }
    }
  };

  const togglePoolMarkers = () => {
    if (waterFlowAlgorithmRef.current) {
      waterFlowAlgorithmRef.current.togglePoolMarkersVisibility();
      setShowPoolMarkers(waterFlowAlgorithmRef.current.arePoolMarkersVisible());
    }
  };

  const toggleTerrainMarkers = () => {
    if (terrainAlgorithmRef.current) {
      terrainAlgorithmRef.current.toggleMarkersVisibility();
      setShowTerrainMarkers(terrainAlgorithmRef.current.areMarkersVisible());
    }
  };

  const toggleOrganicTerrainView = async () => {
    const newOrganicTerrainView = !isOrganicTerrainView;
    console.log("Toggle organic terrain view:", newOrganicTerrainView);
    setIsOrganicTerrainView(newOrganicTerrainView);

    if (newOrganicTerrainView && organicTerrainAlgorithmRef.current) {
      try {
        console.log("Generating organic terrain visualization...");
        await organicTerrainAlgorithmRef.current.generateOrganicTerrainVisualization(
          undefined,
          22,
          terraceCount
        );
        setShowOrganicTerrainMarkers(
          organicTerrainAlgorithmRef.current.areMarkersVisible()
        );
        console.log("Organic terrain visualization generated successfully");
      } catch (error) {
        console.error("Error generating organic terrain visualization:", error);
      }
    } else if (!newOrganicTerrainView && organicTerrainAlgorithmRef.current) {
      console.log("Clearing organic terrain data...");
      organicTerrainAlgorithmRef.current.clearOrganicTerrainData();
      setShowOrganicTerrainMarkers(false);
    }
  };

  const toggleOrganicTerrainMarkers = () => {
    if (organicTerrainAlgorithmRef.current) {
      organicTerrainAlgorithmRef.current.toggleMarkersVisibility();
      setShowOrganicTerrainMarkers(
        organicTerrainAlgorithmRef.current.areMarkersVisible()
      );
    }
  };

  const refreshOrganicTerrain = async () => {
    if (organicTerrainAlgorithmRef.current && isOrganicTerrainView) {
      try {
        // Clear existing organic terrain data first
        organicTerrainAlgorithmRef.current.clearOrganicTerrainData();
        // Regenerate with current settings
        await organicTerrainAlgorithmRef.current.generateOrganicTerrainVisualization(
          undefined,
          22,
          terraceCount
        );
        // Sync organic terrain markers visibility state after regeneration
        if (organicTerrainAlgorithmRef.current) {
          setShowOrganicTerrainMarkers(
            organicTerrainAlgorithmRef.current.areMarkersVisible()
          );
        }
      } catch (error) {
        console.error("Error refreshing organic terrain visualization:", error);
      }
    }
  };

  // Save map state to localStorage
  const saveMapState = () => {
    if (mapInstanceRef.current) {
      const center = mapInstanceRef.current.getCenter();
      const zoom = mapInstanceRef.current.getZoom();

      if (center && zoom) {
        const mapState = {
          center: {
            lat: center.lat(),
            lng: center.lng(),
          },
          zoom: zoom,
          timestamp: Date.now(),
        };

        localStorage.setItem("mapState", JSON.stringify(mapState));
        setHasSavedState(true);

        // Show temporary feedback
        setTimeout(() => {
          setHasSavedState(false);
        }, 2000);
      }
    }
  };

  if (error) {
    return (
      <div className="w-full h-[600px] rounded-lg shadow-lg flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Map Error
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full"
      style={{ width: "100%", maxWidth: "100vw" }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="h-[600px]"
        style={{ width: "100%", maxWidth: "100vw" }}
      />

      {/* Modern Toolbar */}
      <div className="absolute top-4 left-1/4">
        <div className="flex items-center gap-3">
          {/* Water Flow Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleWaterFlowView}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isWaterFlowView
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              title={isWaterFlowView ? "Hide Water Flow" : "Show Water Flow"}
            >
              {/* Water Icon */}
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  isWaterFlowView ? "text-white" : "text-cyan-600"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                <path d="M12 6L8 10h8l-4-4z" opacity="0.7" />
              </svg>

              {/* Button Text */}
              <span className="font-medium text-sm">Water Flow</span>

              {/* Checkbox Indicator */}
              <div
                className={`ml-1 w-4 h-4 rounded border-2 transition-all duration-200 ${
                  isWaterFlowView
                    ? "bg-white border-white"
                    : "border-gray-400 group-hover:border-cyan-500"
                }`}
              >
                {isWaterFlowView && (
                  <svg
                    className="w-3 h-3 text-cyan-500 mt-0.5 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* Refresh Button - Only show when water flow is active */}
            {isWaterFlowView && (
              <button
                onClick={refreshWaterFlow}
                className="group relative flex items-center gap-1 px-2.5 py-2.5 rounded-lg transition-all duration-200 bg-white text-cyan-600 hover:bg-cyan-50 border border-cyan-200 hover:border-cyan-300 shadow-sm"
                title="Refresh water flow simulation"
              >
                {/* Refresh Icon */}
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Rainfall Slider - Compact inline version */}
          {isWaterFlowView && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Rain: {rainfallAmount}"
              </span>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={rainfallAmount}
                onChange={(e) => setRainfallAmount(parseFloat(e.target.value))}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                title="Adjust rainfall amount"
              />
            </div>
          )}

          {/* Pool Markers Toggle - Only show when water flow is active */}
          {isWaterFlowView && (
            <button
              onClick={togglePoolMarkers}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                showPoolMarkers
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              title={
                showPoolMarkers ? "Hide Pool Markers" : "Show Pool Markers"
              }
            >
              {/* Pool Icon */}
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  showPoolMarkers ? "text-white" : "text-blue-600"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" opacity="0.7" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>

              {/* Button Text */}
              <span className="font-medium text-sm">Pools</span>

              {/* Checkbox Indicator */}
              <div
                className={`ml-1 w-4 h-4 rounded border-2 transition-all duration-200 ${
                  showPoolMarkers
                    ? "bg-white border-white"
                    : "border-gray-400 group-hover:border-blue-500"
                }`}
              >
                {showPoolMarkers && (
                  <svg
                    className="w-3 h-3 text-blue-500 mt-0.5 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          )}

          {/* Organic Terrain Toggle Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log("Organic terrain button clicked!");
                toggleOrganicTerrainView();
              }}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isOrganicTerrainView
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              title={
                isOrganicTerrainView
                  ? "Hide Organic Terrain"
                  : "Show Organic Terrain"
              }
            >
              {/* Organic Terrain Icon */}
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  isOrganicTerrainView ? "text-white" : "text-green-600"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L3 9l9 7 9-7-9-7zM3 15l9 7 9-7M12 2v7M3 9l9 7" />
                <circle cx="12" cy="9" r="2" opacity="0.7" />
                <path d="M6 12c0-2 2-4 6-4s6 2 6 4" opacity="0.5" />
              </svg>

              {/* Button Text */}
              <span className="font-medium text-sm">Organic Terrain</span>

              {/* Checkbox Indicator */}
              <div
                className={`ml-1 w-4 h-4 rounded border-2 transition-all duration-200 ${
                  isOrganicTerrainView
                    ? "bg-white border-white"
                    : "border-gray-400 group-hover:border-green-500"
                }`}
              >
                {isOrganicTerrainView && (
                  <svg
                    className="w-3 h-3 text-green-500 mt-0.5 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* Refresh Button - Only show when organic terrain is active */}
            {isOrganicTerrainView && (
              <button
                onClick={refreshOrganicTerrain}
                className="group relative flex items-center gap-1 px-2.5 py-2.5 rounded-lg transition-all duration-200 bg-white text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-300 shadow-sm"
                title="Refresh organic terrain visualization"
              >
                {/* Refresh Icon */}
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Terrace Count Slider - Show when any terrain is active */}
          {(isTerrainView || isOrganicTerrainView) && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Terraces: {terraceCount}
              </span>
              <input
                type="range"
                min="4"
                max="12"
                step="1"
                value={terraceCount}
                onChange={(e) => setTerraceCount(parseInt(e.target.value))}
                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                title="Adjust number of terrace levels"
              />
            </div>
          )}

          {/* Terrain Markers Toggle - Only show when terrain is active */}
          {isTerrainView && (
            <button
              onClick={toggleTerrainMarkers}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                showTerrainMarkers
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              title={
                showTerrainMarkers
                  ? "Hide Terrain Markers"
                  : "Show Terrain Markers"
              }
            >
              {/* Marker Icon */}
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  showTerrainMarkers ? "text-white" : "text-orange-600"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>

              {/* Button Text */}
              <span className="font-medium text-sm">Markers</span>

              {/* Checkbox Indicator */}
              <div
                className={`ml-1 w-4 h-4 rounded border-2 transition-all duration-200 ${
                  showTerrainMarkers
                    ? "bg-white border-white"
                    : "border-gray-400 group-hover:border-orange-500"
                }`}
              >
                {showTerrainMarkers && (
                  <svg
                    className="w-3 h-3 text-orange-500 mt-0.5 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          )}

          {/* Organic Terrain Markers Toggle - Only show when organic terrain is active */}
          {isOrganicTerrainView && (
            <button
              onClick={toggleOrganicTerrainMarkers}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                showOrganicTerrainMarkers
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              title={
                showOrganicTerrainMarkers
                  ? "Hide Organic Terrain Markers"
                  : "Show Organic Terrain Markers"
              }
            >
              {/* Marker Icon */}
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  showOrganicTerrainMarkers ? "text-white" : "text-orange-600"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>

              {/* Button Text */}
              <span className="font-medium text-sm">Markers</span>

              {/* Checkbox Indicator */}
              <div
                className={`ml-1 w-4 h-4 rounded border-2 transition-all duration-200 ${
                  showOrganicTerrainMarkers
                    ? "bg-white border-white"
                    : "border-gray-400 group-hover:border-orange-500"
                }`}
              >
                {showOrganicTerrainMarkers && (
                  <svg
                    className="w-3 h-3 text-orange-500 mt-0.5 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          )}

          {/* Other Controls */}
          <div className="flex items-center gap-2">
            {/* Save Map State Button */}
            <button
              onClick={saveMapState}
              className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                hasSavedState
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              title="Save current map position and zoom"
            >
              {/* Save Icon */}
              <svg
                className={`w-5 h-5 transition-colors duration-200 ${
                  hasSavedState ? "text-white" : "text-green-600"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
              </svg>

              {/* Button Text */}
              <span className="font-medium text-sm">
                {hasSavedState ? "Saved!" : "Save Position"}
              </span>
            </button>

            {/* <button
              onClick={isDrawing ? stopDrawing : startDrawing}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDrawing
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              title={isDrawing ? "Stop Drawing" : "Draw Property"}
            >
              {isDrawing ? "Stop" : "Draw"}
            </button> */}

            {/* <button
              onClick={toggleElevationView}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isElevationView
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              title={isElevationView ? "Hide Elevation" : "Show Elevation"}
            >
              {isElevationView ? "Elevation On" : "Elevation"}
            </button> */}
          </div>
        </div>
      </div>

      {/* Areas List */}
      {/* <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Property Areas</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {areas.map((area) => (
            <div
              key={area.id}
              className={`p-2 border rounded cursor-pointer ${
                selectedArea?.id === area.id
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-300"
              }`}
              onClick={() => {
                // Unhighlight previously selected area
                if (selectedArea) {
                  highlightPolygon(selectedArea.polygon, false);
                }
                // Highlight the newly selected area
                highlightPolygon(area.polygon, true);
                setSelectedArea(area);
              }}
            >
              <div className="font-medium">{area.name}</div>
              <div className="text-sm text-gray-600">
                {formatArea(area.area)}
              </div>
            </div>
          ))}
          {areas.length === 0 && (
            <div className="text-gray-500 text-sm">No areas drawn yet</div>
          )}
        </div>
      </div> */}

      {/* Selected Area Details */}
      {selectedArea && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg">
          <h4 className="font-semibold">{selectedArea.name}</h4>
          <p className="text-sm text-gray-600">
            Area: {formatArea(selectedArea.area)}
          </p>
          <button
            onClick={() => {
              const newName = prompt("Enter new name:", selectedArea.name);
              if (newName) {
                setAreas((prev) =>
                  prev.map((area) =>
                    area.id === selectedArea.id
                      ? { ...area, name: newName }
                      : area
                  )
                );
                setSelectedArea({ ...selectedArea, name: newName });
              }
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Rename
          </button>
        </div>
      )}

      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        onRename={handleRenameArea}
        onDelete={handleDeleteArea}
        onClose={handleCloseContextMenu}
      />
    </div>
  );
}
