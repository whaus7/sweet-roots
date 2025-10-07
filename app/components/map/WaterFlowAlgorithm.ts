/**
 * Water Flow Algorithm Module
 * Handles water flow simulation, flow line generation, and water pool visualization
 */

export interface WaterFlowGrid {
  elevation: number;
  lat: number;
  lng: number;
  waterDepth: number;
  flowsTo: number | null;
}

export interface WaterFlowVisualization {
  flowLines: google.maps.Polyline[];
}

export class WaterFlowAlgorithm {
  private map: google.maps.Map;
  private flowLines: google.maps.Polyline[] = [];
  private poolMarkers: google.maps.Circle[] = [];
  private depthMarkers: google.maps.Marker[] = [];
  private grid: WaterFlowGrid[][] = [];
  private poolMarkersVisible: boolean = false;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  /**
   * Generate water flow simulation for the current map bounds
   */
  async generateWaterFlowSimulation(
    rainfallAmount: number
  ): Promise<WaterFlowVisualization> {
    const bounds = this.map.getBounds();
    if (!bounds) {
      return { flowLines: [] };
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Create a grid of points for elevation sampling (20x20 for better resolution)
    const gridSize = 20;
    const points: google.maps.LatLng[] = [];
    const latStep = (ne.lat() - sw.lat()) / gridSize;
    const lngStep = (ne.lng() - sw.lng()) / gridSize;

    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        const lat = sw.lat() + i * latStep;
        const lng = sw.lng() + j * lngStep;
        points.push(new google.maps.LatLng(lat, lng));
      }
    }

    try {
      const elevationResults = await this.getElevationData(points);
      return this.simulateWaterFlow(
        elevationResults,
        points,
        gridSize,
        rainfallAmount
      );
    } catch (error) {
      console.error("Error generating water flow simulation:", error);
      return { flowLines: [] };
    }
  }

  /**
   * Get elevation data for a set of points
   */
  private getElevationData(
    points: google.maps.LatLng[]
  ): Promise<google.maps.ElevationResult[]> {
    return new Promise((resolve, reject) => {
      const elevator = new google.maps.ElevationService();
      elevator.getElevationForLocations(
        { locations: points },
        (results, status) => {
          if (status === google.maps.ElevationStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error("Failed to get elevation data"));
          }
        }
      );
    });
  }

  /**
   * Simulate water flow based on elevation data
   */
  private simulateWaterFlow(
    elevationResults: google.maps.ElevationResult[],
    points: google.maps.LatLng[],
    gridSize: number,
    rainfallAmount: number
  ): WaterFlowVisualization {
    this.clearWaterFlowData();

    // Create a 2D grid for easier access
    this.grid = [];

    for (let i = 0; i <= gridSize; i++) {
      this.grid[i] = [];
      for (let j = 0; j <= gridSize; j++) {
        const index = i * (gridSize + 1) + j;
        this.grid[i][j] = {
          elevation: elevationResults[index].elevation,
          lat: points[index].lat(),
          lng: points[index].lng(),
          waterDepth: rainfallAmount * 0.0254, // Convert inches to meters
          flowsTo: null,
        };
      }
    }

    // Simulate water flow (water flows to lowest neighbor including diagonal directions)
    const flowLines: google.maps.Polyline[] = [];
    const iterations = 50; // Number of flow iterations

    for (let iter = 0; iter < iterations; iter++) {
      for (let i = 0; i <= gridSize; i++) {
        for (let j = 0; j <= gridSize; j++) {
          if (this.grid[i][j].waterDepth <= 0.001) continue;

          // Find lowest neighbor
          const lowestNeighbor = this.findLowestNeighbor(i, j, gridSize);

          // Transfer water to lowest neighbor
          if (lowestNeighbor) {
            const flowAmount = this.grid[i][j].waterDepth * 0.3; // Flow 30% of water per iteration
            this.grid[i][j].waterDepth -= flowAmount;
            this.grid[lowestNeighbor.i][lowestNeighbor.j].waterDepth +=
              flowAmount;

            // Create flow line visualization (only for significant flows)
            if (flowAmount > 0.005 && iter % 5 === 0) {
              const flowLine = this.createFlowLine(
                i,
                j,
                lowestNeighbor.i,
                lowestNeighbor.j,
                flowAmount
              );
              flowLines.push(flowLine);
            }
          }
        }
      }
    }

    this.flowLines = flowLines;

    return {
      flowLines,
    };
  }

  /**
   * Find the lowest neighbor for water flow (including diagonal neighbors)
   */
  private findLowestNeighbor(
    i: number,
    j: number,
    gridSize: number
  ): { i: number; j: number; elevation: number } | null {
    let lowestNeighbor: {
      i: number;
      j: number;
      elevation: number;
    } | null = null;

    // Include all 8 neighbors: 4 orthogonal + 4 diagonal
    const neighbors = [
      // Orthogonal neighbors (N, S, E, W)
      { i: i - 1, j },
      { i: i + 1, j },
      { i, j: j - 1 },
      { i, j: j + 1 },
      // Diagonal neighbors (NW, NE, SW, SE)
      { i: i - 1, j: j - 1 },
      { i: i - 1, j: j + 1 },
      { i: i + 1, j: j - 1 },
      { i: i + 1, j: j + 1 },
    ];

    for (const neighbor of neighbors) {
      if (
        neighbor.i >= 0 &&
        neighbor.i <= gridSize &&
        neighbor.j >= 0 &&
        neighbor.j <= gridSize
      ) {
        const neighborElevation =
          this.grid[neighbor.i][neighbor.j].elevation +
          this.grid[neighbor.i][neighbor.j].waterDepth;
        const currentElevation =
          this.grid[i][j].elevation + this.grid[i][j].waterDepth;

        if (
          neighborElevation < currentElevation &&
          (!lowestNeighbor || neighborElevation < lowestNeighbor.elevation)
        ) {
          lowestNeighbor = {
            i: neighbor.i,
            j: neighbor.j,
            elevation: neighborElevation,
          };
        }
      }
    }

    return lowestNeighbor;
  }

  /**
   * Create a flow line visualization
   */
  private createFlowLine(
    fromI: number,
    fromJ: number,
    toI: number,
    toJ: number,
    flowAmount: number
  ): google.maps.Polyline {
    // Calculate the direction vector from source to destination
    const fromLat = this.grid[fromI][fromJ].lat;
    const fromLng = this.grid[fromI][fromJ].lng;
    const toLat = this.grid[toI][toJ].lat;
    const toLng = this.grid[toI][toJ].lng;

    // Calculate the distance and direction
    const latDiff = toLat - fromLat;
    const lngDiff = toLng - fromLng;
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    // Make the arrow 80% of the full distance to avoid overlap at convergence points
    const arrowLength = distance * 0.9;

    // Calculate the end point of the arrow (80% of the way to the destination)
    const endLat = fromLat + (latDiff * arrowLength) / distance;
    const endLng = fromLng + (lngDiff * arrowLength) / distance;

    return new google.maps.Polyline({
      path: [
        new google.maps.LatLng(fromLat, fromLng),
        new google.maps.LatLng(endLat, endLng),
      ],
      strokeColor: "#00BFFF",
      strokeOpacity: Math.min(0.6, flowAmount * 100),
      strokeWeight: Math.max(1, flowAmount * 100),
      map: this.map,
      zIndex: 1, // Lower z-index for the line
      icons: [
        {
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: Math.max(2, Math.min(4, flowAmount * 80)), // Scale arrow with flow but keep it reasonable
            strokeColor: "#00BFFF", // Darker blue for better visibility
            fillColor: "#00BFFF", // Fill the arrow for better visibility
            strokeWeight: 1,
            fillOpacity: 1.0, // Ensure arrow is fully opaque
            strokeOpacity: 1.0, // Ensure arrow outline is fully opaque
          },
          offset: "100%",
        },
      ],
    });
  }

  /**
   * Clear all water flow visualization elements
   */
  clearWaterFlowData(): void {
    this.flowLines.forEach((line) => line.setMap(null));
    this.flowLines = [];
    this.poolMarkers.forEach((marker) => marker.setMap(null));
    this.poolMarkers = [];
    this.depthMarkers.forEach((marker) => marker.setMap(null));
    this.depthMarkers = [];
    this.grid = [];
  }

  /**
   * Get current flow lines
   */
  getFlowLines(): google.maps.Polyline[] {
    return this.flowLines;
  }

  /**
   * Get current pool markers
   */
  getPoolMarkers(): google.maps.Circle[] {
    return this.poolMarkers;
  }

  /**
   * Get current depth markers
   */
  getDepthMarkers(): google.maps.Marker[] {
    return this.depthMarkers;
  }

  /**
   * Get current grid data
   */
  getGrid(): WaterFlowGrid[][] {
    return this.grid;
  }

  /**
   * Toggle pool markers visibility (depth markers only)
   */
  togglePoolMarkersVisibility(): void {
    this.poolMarkersVisible = !this.poolMarkersVisible;

    this.depthMarkers.forEach((marker) => {
      marker.setVisible(this.poolMarkersVisible);
    });
  }

  /**
   * Set pool markers visibility (depth markers only)
   */
  setPoolMarkersVisibility(visible: boolean): void {
    this.poolMarkersVisible = visible;

    this.depthMarkers.forEach((marker) => {
      marker.setVisible(this.poolMarkersVisible);
    });
  }

  /**
   * Check if pool markers are visible
   */
  arePoolMarkersVisible(): boolean {
    return this.poolMarkersVisible;
  }
}
