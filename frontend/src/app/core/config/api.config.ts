import { Injectable } from '@angular/core';
import { AppConfigService } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class ApiConfig {
  constructor(private appConfig: AppConfigService) {}

  /**
   * Get the base API URL
   */
  getBaseUrl(): string {
    return this.appConfig.getApiUrl();
  }

  /**
   * Get full URL for an endpoint
   */
  getFullUrl(endpoint: string): string {
    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.getBaseUrl()}${normalizedEndpoint}`;
  }

  /**
   * Get API version
   */
  getApiVersion(): string {
    return 'v1';
  }

  /**
   * Get timeout for requests (in milliseconds)
   */
  getRequestTimeout(): number {
    return this.appConfig.getRequestTimeout();
  }

  /**
   * Check if we're in development mode
   */
  isDevelopment(): boolean {
    return this.appConfig.isDevelopment();
  }

  /**
   * Get retry configuration
   */
  getRetryConfig() {
    return {
      count: 3,
      delay: 1000,
      backoff: 2
    };
  }
}
