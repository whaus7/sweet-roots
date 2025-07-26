// API Base URL - Update this for different environments:
// Development: http://localhost:3001/api
// How to update URL with latest??
// Production: Use NEXT_PUBLIC_API_URL environment variable
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://your-new-vercel-deployment-url.vercel.app/api"
    : "http://localhost:3001/api");

export interface BrixReading {
  id: string;
  plant_name: string;
  brix_value: number;
  reading_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PlantReference {
  id: string;
  plant_name: string;
  category: string;
  healthy_brix_min: number;
  healthy_brix_max: number;
  description: string;
  created_at: string;
}

export interface BrixStats {
  total_readings: number;
  average_brix: number;
  min_brix: number;
  max_brix: number;
  unique_plants: number;
}

class BrixApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Brix Readings
  async getReadings(params?: {
    plant_name?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; data: BrixReading[]; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.plant_name)
      searchParams.append("plant_name", params.plant_name);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const queryString = searchParams.toString();
    const endpoint = `/brix/readings${queryString ? `?${queryString}` : ""}`;

    return this.request(endpoint);
  }

  async getReading(
    id: string
  ): Promise<{ success: boolean; data: BrixReading }> {
    return this.request(`/brix/readings/${id}`);
  }

  async createReading(data: {
    plant_name: string;
    brix_value: number;
    reading_date: string;
    notes?: string;
  }): Promise<{ success: boolean; data: BrixReading }> {
    return this.request("/brix/readings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateReading(
    id: string,
    data: Partial<{
      plant_name: string;
      brix_value: number;
      reading_date: string;
      notes: string;
    }>
  ): Promise<{ success: boolean; data: BrixReading }> {
    return this.request(`/brix/readings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteReading(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request(`/brix/readings/${id}`, {
      method: "DELETE",
    });
  }

  // Plant Reference
  async getPlants(): Promise<{ success: boolean; data: PlantReference[] }> {
    return this.request("/brix/plants");
  }

  async getPlant(
    name: string
  ): Promise<{ success: boolean; data: PlantReference }> {
    return this.request(`/brix/plants/${encodeURIComponent(name)}`);
  }

  // Statistics
  async getStats(params?: {
    plant_name?: string;
  }): Promise<{ success: boolean; data: BrixStats }> {
    const searchParams = new URLSearchParams();
    if (params?.plant_name)
      searchParams.append("plant_name", params.plant_name);

    const queryString = searchParams.toString();
    const endpoint = `/brix/stats${queryString ? `?${queryString}` : ""}`;

    return this.request(endpoint);
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    environment: string;
  }> {
    return this.request("/health");
  }
}

export const brixApi = new BrixApiService();
