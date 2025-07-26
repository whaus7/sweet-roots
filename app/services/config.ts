// Configuration service for handling dynamic API URLs
export interface ApiConfig {
  baseUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

class ConfigService {
  private config: ApiConfig;

  constructor() {
    this.config = this.resolveConfig();
  }

  private resolveConfig(): ApiConfig {
    const isProduction = process.env.NODE_ENV === "production";
    const isDevelopment = process.env.NODE_ENV === "development";

    let baseUrl: string;

    // Priority order for API URL resolution:
    // 1. Explicitly set NEXT_PUBLIC_API_URL
    // 2. Vercel's VERCEL_URL (for preview deployments)
    // 3. Custom API domain (for production)
    // 4. Development fallback

    // if (process.env.NEXT_PUBLIC_API_URL) {
    //   baseUrl = process.env.NEXT_PUBLIC_API_URL;
    // } else

    if (isProduction) {
      // For Vercel preview deployments
      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}/api`;
      } else if (process.env.NEXT_PUBLIC_API_DOMAIN) {
        // For production, use a stable API domain
        baseUrl = `https://${process.env.NEXT_PUBLIC_API_DOMAIN}/api`;
      } else {
        // Fallback - you should set NEXT_PUBLIC_API_DOMAIN in production
        console.warn("No API URL configured for production. Using fallback.");
        baseUrl = "https://your-api-domain.vercel.app/api";
      }
    } else {
      // Development
      baseUrl = "http://localhost:3001/api";
    }

    return {
      baseUrl,
      isProduction,
      isDevelopment,
    };
  }

  getConfig(): ApiConfig {
    return this.config;
  }

  getApiBaseUrl(): string {
    return this.config.baseUrl;
  }

  // Helper method to log current configuration (useful for debugging)
  logConfig(): void {
    console.log("API Configuration:", {
      baseUrl: this.config.baseUrl,
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      customApiUrl: process.env.NEXT_PUBLIC_API_URL,
      customApiDomain: process.env.NEXT_PUBLIC_API_DOMAIN,
    });
  }
}

export const configService = new ConfigService();
