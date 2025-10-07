/**
 * Terrain Algorithm Module
 * Handles elevation mapping with concentric circles and terraces visualization
 */

export interface TerrainVisualization {
  terraceCircles: google.maps.Circle[];
  elevationMarkers: google.maps.Marker[];
  contourLines: google.maps.Polyline[];
}

export interface TerraceLevel {
  elevation: number;
  radius: number;
  depth: number;
  color: string;
}

export class TerrainAlgorithm {
  private map: google.maps.Map;
  private terraceCircles: google.maps.Circle[] = [];
  private elevationMarkers: google.maps.Marker[] = [];
  private contourLines: google.maps.Polyline[] = [];
  private centerPoint: google.maps.LatLng | null = null;
  private terraceLevels: TerraceLevel[] = [];
  private markersVisible: boolean = false;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  /**
   * Generate terrain visualization for the current map bounds
   */
  async generateTerrainVisualization(
    centerPoint?: google.maps.LatLng,
    maxRadius: number = 500, // meters
    terraceCount: number = 8
  ): Promise<TerrainVisualization> {
    console.log("TerrainAlgorithm: Starting terrain visualization generation");
    const bounds = this.map.getBounds();
    if (!bounds) {
      console.log("TerrainAlgorithm: No map bounds available");
      return { terraceCircles: [], elevationMarkers: [], contourLines: [] };
    }

    // Use provided center point or default to map center
    this.centerPoint = centerPoint || this.map.getCenter()!;
    console.log(
      "TerrainAlgorithm: Center point:",
      this.centerPoint.lat(),
      this.centerPoint.lng()
    );

    try {
      console.log("TerrainAlgorithm: Getting elevation data...");
      const elevationData = await this.getElevationDataForTerrain(
        this.centerPoint,
        maxRadius
      );
      console.log(
        "TerrainAlgorithm: Elevation data received:",
        elevationData.length,
        "points"
      );
      return this.createTerrainVisualization(
        elevationData,
        maxRadius,
        terraceCount
      );
    } catch (error) {
      console.error("Error generating terrain visualization:", error);
      console.log("TerrainAlgorithm: Falling back to mock elevation data");
      // Fallback to mock data if elevation API fails
      const mockElevationData = this.createMockElevationData(terraceCount);
      return this.createTerrainVisualization(
        mockElevationData,
        maxRadius,
        terraceCount
      );
    }
  }

  /**
   * Get elevation data for terrain analysis
   */
  private getElevationDataForTerrain(
    center: google.maps.LatLng,
    maxRadius: number
  ): Promise<google.maps.ElevationResult[]> {
    return new Promise((resolve, reject) => {
      const points: google.maps.LatLng[] = [];

      // Create a grid of points radiating from center
      const radialPoints = 16; // Number of radial lines
      const pointsPerRadius = 20; // Points along each radius

      for (let r = 0; r < pointsPerRadius; r++) {
        const radius = (r / (pointsPerRadius - 1)) * maxRadius;

        for (let a = 0; a < radialPoints; a++) {
          const angle = (a / radialPoints) * 2 * Math.PI;

          // Convert radius and angle to lat/lng offset
          const latOffset = (radius * Math.cos(angle)) / 111000; // Rough conversion: 1 degree ≈ 111km
          const lngOffset =
            (radius * Math.sin(angle)) /
            (111000 * Math.cos((center.lat() * Math.PI) / 180));

          const point = new google.maps.LatLng(
            center.lat() + latOffset,
            center.lng() + lngOffset
          );
          points.push(point);
        }
      }

      // Always include the center point
      points.push(center);

      const elevator = new google.maps.ElevationService();
      console.log(
        "TerrainAlgorithm: Requesting elevation data for",
        points.length,
        "points"
      );
      elevator.getElevationForLocations(
        { locations: points },
        (results, status) => {
          console.log("TerrainAlgorithm: Elevation service response:", status);
          if (status === google.maps.ElevationStatus.OK && results) {
            console.log(
              "TerrainAlgorithm: Successfully received elevation data"
            );
            resolve(results);
          } else {
            console.error(
              "TerrainAlgorithm: Failed to get elevation data:",
              status
            );
            reject(new Error(`Failed to get elevation data: ${status}`));
          }
        }
      );
    });
  }

  /**
   * Create mock elevation data for testing when API fails
   */
  private createMockElevationData(
    terraceCount: number
  ): google.maps.ElevationResult[] {
    console.log("TerrainAlgorithm: Creating mock elevation data");
    const mockData: google.maps.ElevationResult[] = [];

    // Create mock elevation points with varying elevations
    for (let i = 0; i < terraceCount; i++) {
      mockData.push({
        elevation: 100 + i * 50, // Mock elevation from 100m to 450m
        resolution: 1.0,
        location: this.centerPoint!,
      });
    }

    return mockData;
  }

  /**
   * Create terrain visualization with concentric terraces
   */
  private createTerrainVisualization(
    elevationResults: google.maps.ElevationResult[],
    maxRadius: number,
    terraceCount: number
  ): TerrainVisualization {
    console.log("TerrainAlgorithm: Creating terrain visualization");

    // Store the center point before clearing
    const currentCenterPoint = this.centerPoint;

    this.clearTerrainData();

    // Restore the center point after clearing
    this.centerPoint = currentCenterPoint;

    // Analyze elevation data to determine terrace levels
    this.terraceLevels = this.analyzeTerraceLevels(
      elevationResults,
      terraceCount
    );
    console.log(
      "TerrainAlgorithm: Created",
      this.terraceLevels.length,
      "terrace levels"
    );

    // Create concentric terrace circles
    const terraceCircles = this.createTerraceCircles(maxRadius);
    console.log(
      "TerrainAlgorithm: Created",
      terraceCircles.length,
      "terrace circles"
    );

    // Create elevation markers
    const elevationMarkers = this.createElevationMarkers();
    console.log(
      "TerrainAlgorithm: Created",
      elevationMarkers.length,
      "elevation markers"
    );

    // Create contour lines
    const contourLines = this.createContourLines();
    console.log(
      "TerrainAlgorithm: Created",
      contourLines.length,
      "contour lines"
    );

    this.terraceCircles = terraceCircles;
    this.elevationMarkers = elevationMarkers;
    this.contourLines = contourLines;

    return {
      terraceCircles,
      elevationMarkers,
      contourLines,
    };
  }

  /**
   * Analyze elevation data to determine terrace levels
   */
  private analyzeTerraceLevels(
    elevationResults: google.maps.ElevationResult[],
    terraceCount: number
  ): TerraceLevel[] {
    console.log(
      "TerrainAlgorithm: analyzeTerraceLevels - input data:",
      elevationResults.length,
      "results"
    );

    const elevations = elevationResults
      .map((result) => result.elevation)
      .filter((elevation) => elevation !== undefined)
      .sort((a, b) => a - b);

    console.log(
      "TerrainAlgorithm: analyzeTerraceLevels - filtered elevations:",
      elevations.length
    );

    if (elevations.length === 0) {
      console.log(
        "TerrainAlgorithm: analyzeTerraceLevels - No valid elevations found"
      );
      return [];
    }

    const minElevation = elevations[0];
    const maxElevation = elevations[elevations.length - 1];
    const elevationRange = maxElevation - minElevation;

    console.log(
      "TerrainAlgorithm: analyzeTerraceLevels - elevation range:",
      minElevation,
      "to",
      maxElevation,
      "range:",
      elevationRange
    );

    const terraceLevels: TerraceLevel[] = [];

    for (let i = 0; i < terraceCount; i++) {
      const elevation =
        minElevation + (i / (terraceCount - 1)) * elevationRange;
      const radius = (i / (terraceCount - 1)) * 500; // Max radius in meters
      const depth = (elevationRange / terraceCount) * 0.5; // Average depth for this terrace

      // Color gradient from green (low) to brown (high)
      const hue = Math.max(0, 120 - (i / terraceCount) * 120); // 120 (green) to 0 (red)
      const color = `hsl(${hue}, 70%, 50%)`;

      terraceLevels.push({
        elevation,
        radius,
        depth,
        color,
      });
    }

    console.log(
      "TerrainAlgorithm: analyzeTerraceLevels - created",
      terraceLevels.length,
      "terrace levels"
    );
    return terraceLevels;
  }

  /**
   * Create elevation markers at key points
   */
  private createElevationMarkers(): google.maps.Marker[] {
    const markers: google.maps.Marker[] = [];

    console.log(
      "TerrainAlgorithm: createElevationMarkers - centerPoint:",
      this.centerPoint
    );
    console.log(
      "TerrainAlgorithm: createElevationMarkers - terraceLevels length:",
      this.terraceLevels.length
    );

    if (!this.centerPoint || this.terraceLevels.length === 0) {
      console.log(
        "TerrainAlgorithm: createElevationMarkers - Early return due to missing data"
      );
      return markers;
    }

    // Create markers for each terrace level at cardinal directions
    const directions = [
      { name: "North", offset: { lat: 1, lng: 0 } },
      { name: "South", offset: { lat: -1, lng: 0 } },
      { name: "East", offset: { lat: 0, lng: 1 } },
      { name: "West", offset: { lat: 0, lng: -1 } },
    ];

    for (let i = 0; i < this.terraceLevels.length; i++) {
      const level = this.terraceLevels[i];

      for (const direction of directions) {
        const latOffset = (direction.offset.lat * level.radius) / 111000;
        const lngOffset =
          (direction.offset.lng * level.radius) /
          (111000 * Math.cos((this.centerPoint.lat() * Math.PI) / 180));

        const position = new google.maps.LatLng(
          this.centerPoint.lat() + latOffset,
          this.centerPoint.lng() + lngOffset
        );

        const marker = new google.maps.Marker({
          position,
          map: this.map,
          visible: this.markersVisible,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${
                  level.color
                }" stroke="white" stroke-width="2"/>
                <text x="20" y="25" text-anchor="middle" font-family="Arial" font-size="10" fill="white" font-weight="bold">
                  ${level.elevation.toFixed(0)}
                </text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20),
          },
          title: `Terrace ${i + 1} - ${
            direction.name
          }: ${level.elevation.toFixed(1)}m elevation`,
          zIndex: 3,
        });

        markers.push(marker);
      }
    }

    // Add center marker
    const centerMarker = new google.maps.Marker({
      position: this.centerPoint,
      map: this.map,
      visible: this.markersVisible,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="23" fill="#FF6B6B" stroke="white" stroke-width="3"/>
            <text x="25" y="30" text-anchor="middle" font-family="Arial" font-size="12" fill="white" font-weight="bold">
              CENTER
            </text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(50, 50),
        anchor: new google.maps.Point(25, 25),
      },
      title: `Terrain Center: ${this.terraceLevels[0]?.elevation.toFixed(
        1
      )}m elevation`,
      zIndex: 4,
    });

    markers.push(centerMarker);

    return markers;
  }

  /**
   * Create contour lines connecting terrace levels
   */
  private createContourLines(): google.maps.Polyline[] {
    const lines: google.maps.Polyline[] = [];

    console.log(
      "TerrainAlgorithm: createContourLines - centerPoint:",
      this.centerPoint
    );
    console.log(
      "TerrainAlgorithm: createContourLines - terraceLevels length:",
      this.terraceLevels.length
    );

    if (!this.centerPoint || this.terraceLevels.length === 0) {
      console.log(
        "TerrainAlgorithm: createContourLines - Early return due to missing data"
      );
      return lines;
    }

    // Create contour lines at 45-degree intervals
    const angles = [0, 45, 90, 135, 180, 225, 270, 315].map(
      (angle) => (angle * Math.PI) / 180
    );

    for (const angle of angles) {
      const path: google.maps.LatLng[] = [];

      for (const level of this.terraceLevels) {
        const latOffset = (Math.cos(angle) * level.radius) / 111000;
        const lngOffset =
          (Math.sin(angle) * level.radius) /
          (111000 * Math.cos((this.centerPoint.lat() * Math.PI) / 180));

        const point = new google.maps.LatLng(
          this.centerPoint.lat() + latOffset,
          this.centerPoint.lng() + lngOffset
        );

        path.push(point);
      }

      const line = new google.maps.Polyline({
        path,
        strokeColor: "#8B4513",
        strokeOpacity: 0.6,
        strokeWeight: 1,
        map: this.map,
        zIndex: 2,
        clickable: false,
      });

      lines.push(line);
    }

    return lines;
  }

  /**
   * Clear all terrain visualization elements
   */
  clearTerrainData(): void {
    this.terraceCircles.forEach((circle) => circle.setMap(null));
    this.terraceCircles = [];
    this.elevationMarkers.forEach((marker) => marker.setMap(null));
    this.elevationMarkers = [];
    this.contourLines.forEach((line) => line.setMap(null));
    this.contourLines = [];
    this.terraceLevels = [];
    this.centerPoint = null;
  }

  /**
   * Toggle elevation markers visibility
   */
  toggleMarkersVisibility(): void {
    this.markersVisible = !this.markersVisible;
    this.elevationMarkers.forEach((marker) => {
      marker.setVisible(this.markersVisible);
    });
  }

  /**
   * Check if markers are visible
   */
  areMarkersVisible(): boolean {
    return this.markersVisible;
  }
}
