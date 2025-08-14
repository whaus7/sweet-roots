import { configService } from "./config";

// Get API base URL from configuration service
const API_BASE_URL = configService.getApiBaseUrl();

export interface User {
  id: string;
  email: string;
  name: string;
  provider: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface LoginData {
  email: string;
  name: string;
  provider: string;
  providerId: string;
  avatarUrl?: string;
}

class AuthApiService {
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
      console.error("Auth API request failed:", error);
      throw error;
    }
  }

  // Login user
  async login(
    loginData: LoginData
  ): Promise<{ success: boolean; data: { user: User } }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    });
  }

  // Get user by ID
  async getUser(id: string): Promise<{ success: boolean; data: User }> {
    return this.request(`/auth/user/${id}`);
  }

  // Get user by provider and provider ID
  async getUserByProvider(
    provider: string,
    providerId: string
  ): Promise<{ success: boolean; data: User }> {
    return this.request(`/auth/user/provider/${provider}/${providerId}`);
  }
}

export const authApi = new AuthApiService();
