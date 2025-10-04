/**
 * Elevation Algorithm Module
 * Handles elevation data processing, contour line generation, and elevation visualization
 */

export interface ElevationPoint {
  elevation: number;
  lat: number;
  lng: number;
}

export interface ElevationVisualization {
  contourLines: google.maps.Polyline[];
  elevationMarkers: google.maps.Marker[];
}

export class ElevationAlgorithm {
  private map: google.maps.Map;
  private elevationData: google.maps.ElevationResult[] = [];
  private contourLines: google.maps.Polyline[] = [];
  private elevationMarkers: google.maps.Marker[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  /**
   * Generate elevation data for the current map bounds
   */
  async generateElevationData(): Promise<google.maps.ElevationResult[]> {
    const bounds = this.map.getBounds();
    if (!bounds) return [];

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Create a grid of points for elevation sampling
    const points: google.maps.LatLng[] = [];
    const latStep = (ne.lat() - sw.lat()) / 10;
    const lngStep = (ne.lng() - sw.lng()) / 10;

    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        const lat = sw.lat() + i * latStep;
        const lng = sw.lng() + j * lngStep;
        points.push(new google.maps.LatLng(lat, lng));
      }
    }

    return new Promise((resolve, reject) => {
      const elevator = new google.maps.ElevationService();
      elevator.getElevationForLocations(
        { locations: points },
        (results, status) => {
          if (status === google.maps.ElevationStatus.OK && results) {
            this.elevationData = results;
            resolve(results);
          } else {
            reject(new Error("Failed to get elevation data"));
          }
        }
      );
    });
  }

  /**
   * Generate contour lines from elevation data
   */
  generateContourLines(
    elevationResults: google.maps.ElevationResult[],
    points: google.maps.LatLng[]
  ): google.maps.Polyline[] {
    // Clear existing contour lines
    this.clearContourLines();

    const elevations = elevationResults.map((result) => result.elevation);
    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);

    // Create contour lines at regular intervals
    const contourInterval = Math.max(
      10,
      Math.round((maxElevation - minElevation) / 10)
    );
    const contourLines: google.maps.Polyline[] = [];

    for (
      let elevation =
        Math.ceil(minElevation / contourInterval) * contourInterval;
      elevation <= maxElevation;
      elevation += contourInterval
    ) {
      const contourPoints = this.findContourPoints(
        elevation,
        elevationResults,
        points
      );

      if (contourPoints.length > 0) {
        const contourLine = new google.maps.Polyline({
          path: contourPoints,
          strokeColor: "#8B4513",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          map: this.map,
        });

        // Add elevation label
        if (contourPoints.length > 0) {
          const midPoint = contourPoints[Math.floor(contourPoints.length / 2)];
          new google.maps.Marker({
            position: midPoint,
            map: this.map,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="60" height="20" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="20" fill="white" stroke="#8B4513" stroke-width="1" rx="3"/>
                  <text x="30" y="14" text-anchor="middle" font-family="Arial" font-size="10" fill="#8B4513">${elevation}m</text>
                </svg>
              `),
              scaledSize: new google.maps.Size(60, 20),
              anchor: new google.maps.Point(30, 10),
            },
            title: `${elevation} meters above sea level`,
          });
        }

        contourLines.push(contourLine);
      }
    }

    this.contourLines = contourLines;
    return contourLines;
  }

  /**
   * Find contour points for a specific elevation
   */
  private findContourPoints(
    targetElevation: number,
    elevationResults: google.maps.ElevationResult[],
    points: google.maps.LatLng[]
  ): google.maps.LatLng[] {
    const contourPoints: google.maps.LatLng[] = [];
    const tolerance = 5; // meters

    for (let i = 0; i < elevationResults.length - 1; i++) {
      const currentElevation = elevationResults[i].elevation;
      const nextElevation = elevationResults[i + 1].elevation;

      if (
        Math.abs(currentElevation - targetElevation) <= tolerance ||
        (currentElevation < targetElevation &&
          nextElevation > targetElevation) ||
        (currentElevation > targetElevation && nextElevation < targetElevation)
      ) {
        contourPoints.push(points[i]);
      }
    }

    return contourPoints;
  }

  /**
   * Generate elevation markers from elevation data
   */
  generateElevationMarkers(
    elevationResults: google.maps.ElevationResult[],
    points: google.maps.LatLng[]
  ): google.maps.Marker[] {
    // Clear existing markers
    this.clearElevationMarkers();

    const markers: google.maps.Marker[] = [];

    // Add markers at key elevation points
    elevationResults.forEach((result, index) => {
      if (index % 5 === 0) {
        // Sample every 5th point to avoid clutter
        const marker = new google.maps.Marker({
          position: points[index],
          map: this.map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="40" height="16" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" fill="#4CAF50" stroke="white" stroke-width="1"/>
                <text x="20" y="12" font-family="Arial" font-size="10" fill="#4CAF50">${Math.round(
                  result.elevation
                )}m</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 16),
            anchor: new google.maps.Point(8, 8),
          },
          title: `${Math.round(result.elevation)} meters above sea level`,
        });
        markers.push(marker);
      }
    });

    this.elevationMarkers = markers;
    return markers;
  }

  /**
   * Generate complete elevation visualization
   */
  async generateElevationVisualization(): Promise<ElevationVisualization> {
    const bounds = this.map.getBounds();
    if (!bounds) {
      return { contourLines: [], elevationMarkers: [] };
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // Create a grid of points for elevation sampling
    const points: google.maps.LatLng[] = [];
    const latStep = (ne.lat() - sw.lat()) / 10;
    const lngStep = (ne.lng() - sw.lng()) / 10;

    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j <= 10; j++) {
        const lat = sw.lat() + i * latStep;
        const lng = sw.lng() + j * lngStep;
        points.push(new google.maps.LatLng(lat, lng));
      }
    }

    try {
      const elevationResults = await this.generateElevationData();
      const contourLines = this.generateContourLines(elevationResults, points);
      const elevationMarkers = this.generateElevationMarkers(
        elevationResults,
        points
      );

      return {
        contourLines,
        elevationMarkers,
      };
    } catch (error) {
      console.error("Error generating elevation visualization:", error);
      return { contourLines: [], elevationMarkers: [] };
    }
  }

  /**
   * Clear all elevation visualization elements
   */
  clearElevationData(): void {
    this.clearContourLines();
    this.clearElevationMarkers();
    this.elevationData = [];
  }

  /**
   * Clear contour lines from map
   */
  private clearContourLines(): void {
    this.contourLines.forEach((line) => line.setMap(null));
    this.contourLines = [];
  }

  /**
   * Clear elevation markers from map
   */
  private clearElevationMarkers(): void {
    this.elevationMarkers.forEach((marker) => marker.setMap(null));
    this.elevationMarkers = [];
  }

  /**
   * Get current elevation data
   */
  getElevationData(): google.maps.ElevationResult[] {
    return this.elevationData;
  }

  /**
   * Get current contour lines
   */
  getContourLines(): google.maps.Polyline[] {
    return this.contourLines;
  }

  /**
   * Get current elevation markers
   */
  getElevationMarkers(): google.maps.Marker[] {
    return this.elevationMarkers;
  }
}
