"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { ElevationAlgorithm } from "./ElevationAlgorithm";
import { WaterFlowAlgorithm } from "./WaterFlowAlgorithm";
import { TerrainAlgorithm } from "./TerrainAlgorithm";
import { OrganicTerrainAlgorithm } from "./OrganicTerrainAlgorithm";

interface MapComponentProps {
  onAreaCreated?: (area: any) => void;
}

export default function MapComponent({ onAreaCreated }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const elevationAlgorithmRef = useRef<ElevationAlgorithm | null>(null);
  const waterFlowAlgorithmRef = useRef<WaterFlowAlgorithm | null>(null);
  const terrainAlgorithmRef = useRef<TerrainAlgorithm | null>(null);
  const organicTerrainAlgorithmRef = useRef<OrganicTerrainAlgorithm | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWaterFlowView, setIsWaterFlowView] = useState(false);
  const [isTerrainView, setIsTerrainView] = useState(false);
  const [isOrganicTerrainView, setIsOrganicTerrainView] = useState(false);
  const [showTerrainMarkers, setShowTerrainMarkers] = useState(false);
  const [showOrganicTerrainMarkers, setShowOrganicTerrainMarkers] =
    useState(false);
  const [rainfallAmount, setRainfallAmount] = useState(1); // inches
  const [terraceCount, setTerraceCount] = useState(8);
  const [hasSavedState, setHasSavedState] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showPoolMarkers, setShowPoolMarkers] = useState(false);

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
        libraries: ["drawing", "geometry", "elevation", "places"],
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

          // Initialize Places services
          const autocompleteService =
            new google.maps.places.AutocompleteService();
          const placesService = new google.maps.places.PlacesService(map);
          setAutocompleteService(autocompleteService);
          setPlacesService(placesService);

          // Initialize algorithm instances
          elevationAlgorithmRef.current = new ElevationAlgorithm(map);
          waterFlowAlgorithmRef.current = new WaterFlowAlgorithm(map);
          terrainAlgorithmRef.current = new TerrainAlgorithm(map);
          organicTerrainAlgorithmRef.current = new OrganicTerrainAlgorithm(map);

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
  }, []);

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

  // Close predictions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".address-search-container")) {
        setShowPredictions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Handle address search autocomplete
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);

    if (query.length > 2 && autocompleteService) {
      autocompleteService.getPlacePredictions(
        {
          input: query,
          types: ["geocode"],
        },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(predictions);
            setShowPredictions(true);
          } else {
            setPredictions([]);
            setShowPredictions(false);
          }
        }
      );
    } else {
      setPredictions([]);
      setShowPredictions(false);
    }
  };

  // Handle address selection and navigation
  const handleAddressSelect = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    if (placesService && mapInstanceRef.current) {
      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["geometry", "name", "formatted_address"],
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place?.geometry?.location
          ) {
            // Navigate to the selected location
            mapInstanceRef.current?.panTo(place.geometry.location);
            mapInstanceRef.current?.setZoom(15);

            // Set the search query to the selected address
            setSearchQuery(place.formatted_address || prediction.description);
            setShowPredictions(false);

            // Add a marker at the location
            new google.maps.Marker({
              position: place.geometry.location,
              map: mapInstanceRef.current,
              title: place.name || prediction.description,
              animation: google.maps.Animation.DROP,
            });
          }
        }
      );
    }
  };

  // Clear search and predictions
  const clearSearch = () => {
    setSearchQuery("");
    setPredictions([]);
    setShowPredictions(false);
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

      {/* Address Search */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="relative address-search-container">
          <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-lg min-w-80">
            {/* Search Icon */}
            <div className="pl-3 pr-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => setShowPredictions(predictions.length > 0)}
              placeholder="Search for an address..."
              className="flex-1 px-2 py-3 text-sm border-none outline-none bg-transparent"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="pr-3 pl-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showPredictions && predictions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-30">
              {predictions.map((prediction, index) => (
                <button
                  key={prediction.place_id}
                  onClick={() => handleAddressSelect(prediction)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Location Icon */}
                    <svg
                      className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>

                    {/* Prediction Text */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {prediction.structured_formatting?.main_text ||
                          prediction.description}
                      </div>
                      {prediction.structured_formatting?.secondary_text && (
                        <div className="text-xs text-gray-500 truncate">
                          {prediction.structured_formatting.secondary_text}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap w-[55]">
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
          </div>
        </div>
      </div>
    </div>
  );
}
