/**
 * Organic Terrain Algorithm Module
 * Creates topographic-style terrace rings that follow natural terrain contours
 */

export interface ContourPoint {
  lat: number;
  lng: number;
  elevation: number;
}

export interface ContourLine {
  elevation: number;
  points: ContourPoint[];
  path: string; // SVG path string
}

export interface OrganicTerrainVisualization {
  contourLines: google.maps.Polygon[];
  elevationMarkers: google.maps.Marker[];
  svgOverlay: google.maps.OverlayView | null;
}

export class OrganicTerrainAlgorithm {
  private map: google.maps.Map;
  private contourLines: google.maps.Polygon[] = [];
  private elevationMarkers: google.maps.Marker[] = [];
  private svgOverlay: google.maps.OverlayView | null = null;
  private grid: ContourPoint[][] = [];
  private centerPoint: google.maps.LatLng | null = null;
  private markersVisible: boolean = false;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  /**
   * Generate organic terrain visualization with contour-following terraces
   */
  async generateOrganicTerrainVisualization(
    centerPoint?: google.maps.LatLng,
    gridSize: number = 22, // Number of grid points (22x22 = 484 points, under 500 limit)
    terraceCount: number = 8
  ): Promise<OrganicTerrainVisualization> {
    console.log("OrganicTerrainAlgorithm: Starting organic terrain generation");

    const bounds = this.map.getBounds();
    if (!bounds) {
      return { contourLines: [], elevationMarkers: [], svgOverlay: null };
    }

    // Use provided center point or default to map center
    this.centerPoint = centerPoint || this.map.getCenter()!;
    console.log(
      "OrganicTerrainAlgorithm: Center point:",
      this.centerPoint.lat(),
      this.centerPoint.lng()
    );

    try {
      // Create a dense grid of elevation points
      const elevationGrid = await this.createElevationGrid(
        this.centerPoint,
        gridSize
      );

      // Generate contour lines from the elevation grid
      const contourData = this.generateContourLines(
        elevationGrid,
        terraceCount
      );

      // Create the visualization
      return this.createOrganicVisualization(contourData, terraceCount);
    } catch (error) {
      console.error("Error generating organic terrain visualization:", error);
      console.log(
        "OrganicTerrainAlgorithm: Falling back to mock elevation data"
      );
      // Fallback to mock data if elevation API fails
      const mockElevationGrid = this.createMockElevationGrid(gridSize);
      const contourData = this.generateContourLines(
        mockElevationGrid,
        terraceCount
      );
      return this.createOrganicVisualization(contourData, terraceCount);
    }
  }

  /**
   * Create a dense grid of elevation points around the center
   */
  private async createElevationGrid(
    center: google.maps.LatLng,
    gridSize: number
  ): Promise<ContourPoint[][]> {
    return new Promise((resolve, reject) => {
      let points: google.maps.LatLng[] = [];
      const grid: ContourPoint[][] = [];

      console.log(
        `OrganicTerrainAlgorithm: Creating grid with size: ${gridSize}x${gridSize}`
      );

      // Calculate grid bounds (roughly 1km x 1km area)
      const latRange = 0.009; // ~1km
      const lngRange = 0.009 / Math.cos((center.lat() * Math.PI) / 180);

      const startLat = center.lat() - latRange / 2;
      const startLng = center.lng() - lngRange / 2;

      const latStep = latRange / gridSize;
      const lngStep = lngRange / gridSize;

      // Create grid points
      for (let i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < gridSize; j++) {
          const lat = startLat + i * latStep;
          const lng = startLng + j * lngStep;
          const point = new google.maps.LatLng(lat, lng);
          points.push(point);
        }
      }

      console.log(
        `OrganicTerrainAlgorithm: Requesting elevation data for ${points.length} grid points (limit: 500)`
      );

      if (points.length > 500) {
        console.error(
          `OrganicTerrainAlgorithm: Too many points (${points.length}), reducing to 500`
        );
        points = points.slice(0, 500);
      }

      // Add a small delay to avoid rate limiting
      setTimeout(() => {
        const elevator = new google.maps.ElevationService();
        elevator.getElevationForLocations(
          { locations: points },
          (results, status) => {
            console.log(
              `OrganicTerrainAlgorithm: Elevation service response: ${status}`
            );
            if (status === google.maps.ElevationStatus.OK && results) {
              console.log(
                `OrganicTerrainAlgorithm: Successfully received elevation grid data (${results.length} points)`
              );

              // Populate the grid with elevation data
              let pointIndex = 0;
              for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                  const result = results[pointIndex];
                  grid[i][j] = {
                    lat: points[pointIndex].lat(),
                    lng: points[pointIndex].lng(),
                    elevation: result.elevation,
                  };
                  pointIndex++;
                }
              }

              this.grid = grid;
              resolve(grid);
            } else {
              console.error(
                "OrganicTerrainAlgorithm: Failed to get elevation grid data:",
                status
              );

              // Provide more specific error information
              let errorMessage = `Failed to get elevation grid data: ${status}`;
              if (status === "UNKNOWN_ERROR") {
                errorMessage +=
                  " (This usually means API quota exceeded or invalid request)";
              } else if (status === "REQUEST_DENIED") {
                errorMessage +=
                  " (API key may be invalid or elevation service not enabled)";
              } else if (status === "ZERO_RESULTS") {
                errorMessage +=
                  " (No elevation data available for this location)";
              }

              reject(new Error(errorMessage));
            }
          }
        );
      }, 100); // 100ms delay
    });
  }

  /**
   * Create mock elevation grid for testing when API fails
   */
  private createMockElevationGrid(gridSize: number): ContourPoint[][] {
    console.log("OrganicTerrainAlgorithm: Creating mock elevation grid");

    if (!this.centerPoint) {
      throw new Error("No center point available for mock data");
    }

    const grid: ContourPoint[][] = [];
    const latRange = 0.009; // ~1km
    const lngRange = 0.009 / Math.cos((this.centerPoint.lat() * Math.PI) / 180);

    const startLat = this.centerPoint.lat() - latRange / 2;
    const startLng = this.centerPoint.lng() - lngRange / 2;

    const latStep = latRange / gridSize;
    const lngStep = lngRange / gridSize;

    // Create mock terrain with some variation
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const lat = startLat + i * latStep;
        const lng = startLng + j * lngStep;

        // Create a mock elevation pattern (hill in center, lower around edges)
        const centerI = gridSize / 2;
        const centerJ = gridSize / 2;
        const distanceFromCenter = Math.sqrt(
          Math.pow(i - centerI, 2) + Math.pow(j - centerJ, 2)
        );
        const maxDistance = Math.sqrt(
          Math.pow(centerI, 2) + Math.pow(centerJ, 2)
        );

        // Base elevation with hill pattern
        const baseElevation = 100;
        const hillHeight = 50;
        const elevation =
          baseElevation + hillHeight * (1 - distanceFromCenter / maxDistance);

        // Add some random variation
        const variation = (Math.random() - 0.5) * 10;

        grid[i][j] = {
          lat,
          lng,
          elevation: Math.max(50, elevation + variation),
        };
      }
    }

    return grid;
  }

  /**
   * Generate contour lines from elevation grid using marching squares algorithm
   */
  private generateContourLines(
    elevationGrid: ContourPoint[][],
    terraceCount: number
  ): ContourLine[] {
    console.log("OrganicTerrainAlgorithm: Generating contour lines");

    const elevations = elevationGrid.flat().map((p) => p.elevation);
    const minElevation = Math.min(...elevations);
    const maxElevation = Math.max(...elevations);
    const elevationRange = maxElevation - minElevation;

    console.log(
      `OrganicTerrainAlgorithm: Elevation range: ${minElevation.toFixed(
        1
      )}m to ${maxElevation.toFixed(1)}m`
    );

    const contourLines: ContourLine[] = [];

    // Generate contour levels
    for (let i = 0; i < terraceCount; i++) {
      const contourElevation =
        minElevation + (i / (terraceCount - 1)) * elevationRange;

      // Use marching squares to find contour points based on actual elevation data
      const contourPoints = this.marchSquares(elevationGrid, contourElevation);

      console.log(
        `OrganicTerrainAlgorithm: Contour level ${i} (elevation ${contourElevation.toFixed(
          1
        )}m): ${contourPoints.length} points`
      );

      if (contourPoints.length > 0) {
        // Smooth the contour points to make them more organic
        const smoothedPoints = this.smoothContourPoints(contourPoints);

        // Create smooth SVG path from contour points
        const path = this.createSmoothPath(smoothedPoints);

        contourLines.push({
          elevation: contourElevation,
          points: smoothedPoints,
          path: path,
        });
      }
    }

    console.log(
      `OrganicTerrainAlgorithm: Generated ${contourLines.length} contour lines`
    );
    return contourLines;
  }

  /**
   * Create simple circular contours around the center point
   */
  private createSimpleContours(
    elevationGrid: ContourPoint[][],
    targetElevation: number,
    levelIndex: number,
    totalLevels: number
  ): ContourPoint[] {
    console.log(
      `OrganicTerrainAlgorithm: Creating simple contours for elevation ${targetElevation.toFixed(
        1
      )}m`
    );

    if (!this.centerPoint) {
      console.error(
        "OrganicTerrainAlgorithm: No center point available in createSimpleContours"
      );
      return [];
    }

    console.log(
      "OrganicTerrainAlgorithm: Center point in createSimpleContours:",
      this.centerPoint.lat(),
      this.centerPoint.lng()
    );

    const contourPoints: ContourPoint[] = [];

    // Create concentric circles with some organic variation
    const baseRadius = 0.001; // Base radius in degrees
    const maxRadius = 0.004; // Maximum radius
    const radius =
      baseRadius + (levelIndex / (totalLevels - 1)) * (maxRadius - baseRadius);

    // Add some organic variation to the radius
    const variation = 0.0005 * Math.sin(levelIndex * 0.5);
    const finalRadius = radius + variation;

    // Create points in a circle with some organic variation
    const numPoints = 32; // Number of points around the circle
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;

      // Add some organic variation to the angle
      const angleVariation =
        0.1 * Math.sin(angle * 3) * Math.cos(levelIndex * 0.3);
      const finalAngle = angle + angleVariation;

      // Calculate position with some organic offset
      const offsetX = 0.0002 * Math.sin(angle * 2) * Math.cos(levelIndex * 0.4);
      const offsetY = 0.0002 * Math.cos(angle * 2) * Math.sin(levelIndex * 0.4);

      const lat =
        this.centerPoint.lat() + finalRadius * Math.cos(finalAngle) + offsetX;
      const lng =
        this.centerPoint.lng() + finalRadius * Math.sin(finalAngle) + offsetY;

      contourPoints.push({
        lat,
        lng,
        elevation: targetElevation,
      });
    }

    console.log(
      `OrganicTerrainAlgorithm: Created ${contourPoints.length} simple contour points`
    );
    return contourPoints;
  }

  /**
   * Smooth contour points to make them more organic
   */
  private smoothContourPoints(points: ContourPoint[]): ContourPoint[] {
    if (points.length < 3) return points;

    const smoothed: ContourPoint[] = [];

    for (let i = 0; i < points.length; i++) {
      const prev = points[(i - 1 + points.length) % points.length];
      const curr = points[i];
      const next = points[(i + 1) % points.length];

      // Simple smoothing: average with neighbors
      const smoothedLat = (prev.lat + curr.lat + next.lat) / 3;
      const smoothedLng = (prev.lng + curr.lng + next.lng) / 3;

      smoothed.push({
        lat: smoothedLat,
        lng: smoothedLng,
        elevation: curr.elevation,
      });
    }

    return smoothed;
  }

  /**
   * Marching squares algorithm to find contour points
   */
  private marchSquares(
    elevationGrid: ContourPoint[][],
    targetElevation: number
  ): ContourPoint[] {
    const gridSize = elevationGrid.length;
    const contourPoints: ContourPoint[] = [];

    console.log(
      `OrganicTerrainAlgorithm: Marching squares for elevation ${targetElevation.toFixed(
        1
      )}m`
    );

    // Sample every point for better detail
    for (let i = 0; i < gridSize - 1; i++) {
      for (let j = 0; j < gridSize - 1; j++) {
        const cell = [
          elevationGrid[i][j], // Top-left
          elevationGrid[i][j + 1], // Top-right
          elevationGrid[i + 1][j], // Bottom-left
          elevationGrid[i + 1][j + 1], // Bottom-right
        ];

        // Check if contour crosses this cell
        const elevations = cell.map((p) => p.elevation);
        const minCellElevation = Math.min(...elevations);
        const maxCellElevation = Math.max(...elevations);

        if (
          targetElevation >= minCellElevation &&
          targetElevation <= maxCellElevation
        ) {
          // Interpolate contour points within this cell
          const interpolatedPoints = this.interpolateContourPoints(
            cell,
            targetElevation
          );
          contourPoints.push(...interpolatedPoints);
        }
      }
    }

    console.log(
      `OrganicTerrainAlgorithm: Found ${
        contourPoints.length
      } contour points for elevation ${targetElevation.toFixed(1)}m`
    );
    return contourPoints;
  }

  /**
   * Interpolate contour points within a grid cell
   */
  private interpolateContourPoints(
    cell: ContourPoint[],
    targetElevation: number
  ): ContourPoint[] {
    const points: ContourPoint[] = [];

    // Simple linear interpolation between adjacent points
    for (let i = 0; i < cell.length; i++) {
      const current = cell[i];
      const next = cell[(i + 1) % cell.length];

      if (
        (current.elevation <= targetElevation &&
          next.elevation >= targetElevation) ||
        (current.elevation >= targetElevation &&
          next.elevation <= targetElevation)
      ) {
        const ratio =
          (targetElevation - current.elevation) /
          (next.elevation - current.elevation);
        const interpolatedLat = current.lat + ratio * (next.lat - current.lat);
        const interpolatedLng = current.lng + ratio * (next.lng - current.lng);

        points.push({
          lat: interpolatedLat,
          lng: interpolatedLng,
          elevation: targetElevation,
        });
      }
    }

    return points;
  }

  /**
   * Create smooth SVG path from contour points
   */
  private createSmoothPath(points: ContourPoint[]): string {
    if (points.length < 2) return "";

    // Sort points to create a continuous path (simple nearest neighbor)
    const sortedPoints = this.sortContourPoints(points);

    // Create SVG path with smooth curves
    let path = `M ${sortedPoints[0].lng} ${sortedPoints[0].lat}`;

    for (let i = 1; i < sortedPoints.length; i++) {
      const point = sortedPoints[i];
      path += ` L ${point.lng} ${point.lat}`;
    }

    path += " Z"; // Close the path

    return path;
  }

  /**
   * Sort contour points to create a continuous path
   */
  private sortContourPoints(points: ContourPoint[]): ContourPoint[] {
    if (points.length <= 2) return points;

    const sorted = [points[0]];
    const remaining = points.slice(1);

    while (remaining.length > 0) {
      const lastPoint = sorted[sorted.length - 1];
      let closestIndex = 0;
      let closestDistance = this.distance(lastPoint, remaining[0]);

      for (let i = 1; i < remaining.length; i++) {
        const distance = this.distance(lastPoint, remaining[i]);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }

      sorted.push(remaining[closestIndex]);
      remaining.splice(closestIndex, 1);
    }

    return sorted;
  }

  /**
   * Calculate distance between two points
   */
  private distance(p1: ContourPoint, p2: ContourPoint): number {
    const latDiff = p1.lat - p2.lat;
    const lngDiff = p1.lng - p2.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  }

  /**
   * Create organic visualization with SVG overlay
   */
  private createOrganicVisualization(
    contourData: ContourLine[],
    terraceCount: number
  ): OrganicTerrainVisualization {
    console.log("OrganicTerrainAlgorithm: Creating organic visualization");
    console.log("Terrace count: " + terraceCount);
    console.log(
      "OrganicTerrainAlgorithm: Contour data received:",
      contourData.length,
      "contours"
    );

    // Store center point before clearing (since clearOrganicTerrainData sets it to null)
    const savedCenterPoint = this.centerPoint;

    this.clearOrganicTerrainData();

    // Restore center point after clearing
    this.centerPoint = savedCenterPoint;

    // Create polygon contours instead of SVG overlay
    const contourPolygons = this.createContourPolygons(contourData);

    // Create elevation markers
    const elevationMarkers = this.createElevationMarkers(contourData);

    this.contourLines = contourPolygons;
    this.elevationMarkers = elevationMarkers;

    return {
      contourLines: contourPolygons,
      elevationMarkers,
      svgOverlay: null,
    };
  }

  /**
   * Create polygon contours for organic terrain visualization
   */
  private createContourPolygons(
    contourData: ContourLine[]
  ): google.maps.Polygon[] {
    console.log("OrganicTerrainAlgorithm: Creating contour polygons");

    const polygons: google.maps.Polygon[] = [];

    contourData.forEach((contour, index) => {
      if (contour.points.length < 3) return; // Need at least 3 points for a polygon

      console.log(
        `OrganicTerrainAlgorithm: Creating polygon ${index} with ${contour.points.length} points`
      );

      // Convert contour points to LatLng array
      const path = contour.points.map(
        (point) => new google.maps.LatLng(point.lat, point.lng)
      );

      // Create polygon with organic styling
      const polygon = new google.maps.Polygon({
        paths: path,
        fillColor: this.getTerraceColor(index, contourData.length),
        fillOpacity: 0.3,
        strokeColor: this.getTerraceColor(index, contourData.length),
        strokeOpacity: 0.7,
        strokeWeight: 2,
        clickable: true,
        map: this.map,
      });

      polygons.push(polygon);
    });

    console.log(
      `OrganicTerrainAlgorithm: Created ${polygons.length} contour polygons`
    );
    return polygons;
  }

  /**
   * Create SVG overlay with organic contour shapes
   */
  private createSVGOverlay(
    contourData: ContourLine[]
  ): google.maps.OverlayView {
    class SVGTerrainOverlay extends google.maps.OverlayView {
      private contourData: ContourLine[];
      private div: HTMLDivElement;

      constructor(contourData: ContourLine[]) {
        super();
        console.log("OrganicTerrainAlgorithm: SVG overlay constructor called");
        this.contourData = contourData;
        this.div = document.createElement("div");
        this.div.style.position = "absolute";
        this.div.style.pointerEvents = "none";
        console.log("OrganicTerrainAlgorithm: SVG overlay div created");
      }

      onAdd() {
        console.log("OrganicTerrainAlgorithm: SVG overlay onAdd called");
        const panes = this.getPanes();
        if (panes) {
          console.log("OrganicTerrainAlgorithm: Adding overlay to panes");
          panes.overlayLayer.appendChild(this.div);
        } else {
          console.error("OrganicTerrainAlgorithm: No panes available");
        }
      }

      draw() {
        console.log("OrganicTerrainAlgorithm: SVG overlay draw called");
        const overlayProjection = this.getProjection();
        if (!overlayProjection) {
          console.error("OrganicTerrainAlgorithm: No projection available");
          return;
        }

        console.log(
          "OrganicTerrainAlgorithm: Creating SVG with",
          this.contourData.length,
          "contours"
        );

        // Create SVG element
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.style.position = "absolute";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svg.style.top = "0";
        svg.style.left = "0";

        // Clear previous content
        this.div.innerHTML = "";

        // Create terrain terrace shapes
        this.contourData.forEach((contour, index) => {
          console.log(
            `OrganicTerrainAlgorithm: Creating contour ${index} with ${contour.points.length} points`
          );
          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );

          // Convert lat/lng to pixel coordinates and create path
          let svgPath = "";
          let validPoints = 0;
          contour.points.forEach((point, pointIndex) => {
            const pixel = overlayProjection.fromLatLngToDivPixel(
              new google.maps.LatLng(point.lat, point.lng)
            );
            if (pixel) {
              const x = pixel.x;
              const y = pixel.y;
              validPoints++;
              if (pointIndex === 0) {
                svgPath += `M ${x} ${y}`;
              } else {
                svgPath += ` L ${x} ${y}`;
              }
            }
          });
          svgPath += " Z";

          console.log(
            `OrganicTerrainAlgorithm: Contour ${index} - ${validPoints}/${
              contour.points.length
            } valid pixels, path: ${svgPath.substring(0, 100)}...`
          );

          path.setAttribute("d", svgPath);
          path.setAttribute(
            "fill",
            this.getTerraceColor(index, this.contourData.length)
          );
          path.setAttribute("fill-opacity", "0.3");
          path.setAttribute(
            "stroke",
            this.getTerraceColor(index, this.contourData.length)
          );
          path.setAttribute("stroke-opacity", "0.7");
          path.setAttribute("stroke-width", "2");

          svg.appendChild(path);
        });

        this.div.appendChild(svg);
        console.log(
          `OrganicTerrainAlgorithm: SVG created with ${svg.children.length} paths, appended to div`
        );

        // Add a test rectangle to verify SVG is working
        const testRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        testRect.setAttribute("x", "100");
        testRect.setAttribute("y", "100");
        testRect.setAttribute("width", "100");
        testRect.setAttribute("height", "100");
        testRect.setAttribute("fill", "red");
        testRect.setAttribute("opacity", "0.5");
        svg.appendChild(testRect);
        console.log("OrganicTerrainAlgorithm: Added test red rectangle");
      }

      private getTerraceColor(index: number, total: number): string {
        // Color gradient from green (low) to brown (high)
        const hue = Math.max(0, 120 - (index / total) * 120);
        return `hsl(${hue}, 70%, 50%)`;
      }

      onRemove() {
        if (this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
        }
      }
    }

    const overlay = new SVGTerrainOverlay(contourData);
    console.log("OrganicTerrainAlgorithm: SVG overlay created and returned");
    return overlay;
  }

  /**
   * Create elevation markers
   */
  private createElevationMarkers(
    contourData: ContourLine[]
  ): google.maps.Marker[] {
    const markers: google.maps.Marker[] = [];

    if (!this.centerPoint) return markers;

    // Create markers for key contour levels
    contourData.forEach((contour, index) => {
      if (contour.points.length > 0) {
        // Use the first point of each contour as marker location
        const markerPoint = new google.maps.LatLng(
          contour.points[0].lat,
          contour.points[0].lng
        );

        const marker = new google.maps.Marker({
          position: markerPoint,
          map: this.map,
          visible: this.markersVisible,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="12" fill="${this.getTerraceColor(
                  index,
                  contourData.length
                )}" stroke="white" stroke-width="2"/>
                <text x="15" y="19" text-anchor="middle" font-family="Arial" font-size="8" fill="white" font-weight="bold">
                  ${contour.elevation.toFixed(0)}
                </text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 15),
          },
          title: `Terrace ${index + 1}: ${contour.elevation.toFixed(
            1
          )}m elevation`,
          zIndex: 3,
        });

        markers.push(marker);
      }
    });

    return markers;
  }

  /**
   * Get terrace color for visualization
   */
  private getTerraceColor(index: number, total: number): string {
    const hue = Math.max(0, 120 - (index / total) * 120);
    return `hsl(${hue}, 70%, 50%)`;
  }

  /**
   * Clear all organic terrain visualization elements
   */
  clearOrganicTerrainData(): void {
    this.contourLines.forEach((polygon) => polygon.setMap(null));
    this.contourLines = [];
    this.elevationMarkers.forEach((marker) => marker.setMap(null));
    this.elevationMarkers = [];
    if (this.svgOverlay) {
      this.svgOverlay.setMap(null);
      this.svgOverlay = null;
    }
    this.grid = [];
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
   * Set markers visibility
   */
  setMarkersVisibility(visible: boolean): void {
    this.markersVisible = visible;
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
