import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  environment: 'development' | 'production' | 'staging';
  features: {
    enableLogging: boolean;
    enableAnalytics: boolean;
    enableNotifications: boolean;
  };
  timeouts: {
    request: number;
    refresh: number;
    retry: number;
  };
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    return {
      apiUrl: environment.apiUrl,
      appName: 'SACCO ESB',
      version: '1.0.0',
      environment: environment.production ? 'production' : 'development',
      features: {
        enableLogging: !environment.production,
        enableAnalytics: environment.production,
        enableNotifications: true
      },
      timeouts: {
        request: 120000, // 2 minutes for slow VPN connections
        refresh: 30000, // 30 seconds
        retry: 10000 // 10 seconds
      },
      pagination: {
        defaultPageSize: 10,
        maxPageSize: 100
      }
    };
  }

  /**
   * Get the complete configuration
   */
  getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Get API base URL
   */
  getApiUrl(): string {
    return this.config.apiUrl;
  }

  /**
   * Get app name
   */
  getAppName(): string {
    return this.config.appName;
  }

  /**
   * Get app version
   */
  getVersion(): string {
    return this.config.version;
  }

  /**
   * Get current environment
   */
  getEnvironment(): string {
    return this.config.environment;
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Get timeout for requests
   */
  getRequestTimeout(): number {
    return this.config.timeouts.request;
  }

  /**
   * Get pagination settings
   */
  getPaginationConfig() {
    return this.config.pagination;
  }

  /**
   * Check if we're in development mode
   */
  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  /**
   * Check if we're in production mode
   */
  isProduction(): boolean {
    return this.config.environment === 'production';
  }
}
