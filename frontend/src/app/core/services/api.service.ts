import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';
import { ApiConfig } from '../config/api.config';
import { AppConfigService } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig,
    private appConfig: AppConfigService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    console.log('🔑 API Service - Token from localStorage:', token ? 'Present' : 'Missing');
    console.log('🔑 API Service - Full token:', token);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Accept': 'application/json'
    });
    
    console.log('🔑 API Service - Headers being sent:', headers);
    return headers;
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const cacheBustParams = params ? params.set('_t', timestamp.toString()) : new HttpParams().set('_t', timestamp.toString());
    
    console.log('🚀 ApiService GET request:');
    console.log('  📍 Endpoint:', endpoint);
    console.log('  🌐 Full URL:', url);
    console.log('  📦 Params:', cacheBustParams.toString());
    console.log('  🔑 Headers:', this.getHeaders());
    
    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params: cacheBustParams
    }).pipe(
      timeout(this.appConfig.getRequestTimeout()),
      catchError(error => {
        console.error('❌ ApiService GET Error:');
        console.error('  📍 Endpoint:', endpoint);
        console.error('  🌐 URL:', url);
        console.error('  ❌ Error:', error);
        console.error('  📊 Status:', error.status);
        console.error('  📝 Message:', error.message);
        
        if (error.name === 'TimeoutError') {
          console.error('⏰ Request timeout - backend may be slow or unreachable');
        } else if (error.status === 0) {
          console.error('🌐 Network error - check if backend is running');
        } else if (error.status === 401) {
          console.error('🔐 Unauthorized - check credentials/token');
        } else if (error.status === 404) {
          console.error('🔍 Not found - check endpoint URL');
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    console.log('🚀 Making POST request to:', url);
    console.log('📦 Request data:', data);
    
    return this.http.post<T>(url, data, {
      headers: this.getHeaders(),
      params
    }).pipe(
      timeout(30000), // 30 second timeout
      catchError(error => {
        console.error('❌ API Error:', error);
        if (error.name === 'TimeoutError') {
          console.error('⏰ Request timeout - backend may be slow or unreachable');
        } else if (error.status === 0) {
          console.error('🌐 Network error - check if backend is running on localhost:5501');
        } else if (error.status === 401) {
          console.error('🔐 Unauthorized - check credentials');
        } else if (error.status === 404) {
          console.error('🔍 Not found - check endpoint URL');
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.put<T>(url, data, {
      headers: this.getHeaders(),
      params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout())
    );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.delete<T>(url, {
      headers: this.getHeaders(),
      params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout())
    );
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.patch<T>(url, data, {
      headers: this.getHeaders(),
      params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout())
    );
  }

  /**
   * Get base URL for external use
   */
  getBaseUrl(): string {
    return this.apiConfig.getBaseUrl();
  }

  /**
   * GET request for user endpoints (without /api prefix)
   */
  getUserEndpoint<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint); // Use full URL with base URL
    console.log('🚀 ApiService GET user endpoint:');
    console.log('  📍 Endpoint:', endpoint);
    console.log('  🌐 Full URL:', url);
    console.log('  📦 Params:', params?.toString() || 'none');
    console.log('  🔑 Headers:', this.getHeaders());
    
    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout()),
      catchError(error => {
        console.error('❌ ApiService GET User Endpoint Error:');
        console.error('  📍 Endpoint:', endpoint);
        console.error('  🌐 URL:', url);
        console.error('  ❌ Error:', error);
        console.error('  📊 Status:', error.status);
        console.error('  📝 Message:', error.message);
        
        if (error.name === 'TimeoutError') {
          console.error('⏰ Request timeout - backend may be slow or unreachable');
        } else if (error.status === 0) {
          console.error('🌐 Network error - check if backend is running');
        } else if (error.status === 401) {
          console.error('🔐 Unauthorized - check credentials/token');
        } else if (error.status === 404) {
          console.error('🔍 Not found - check endpoint URL');
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * GET request for role endpoints (without /api prefix)
   */
  getRoleEndpoint<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint); // Use full URL with base URL
    console.log('🚀 ApiService GET role endpoint:');
    console.log('  📍 Endpoint:', endpoint);
    console.log('  🌐 Full URL:', url);
    console.log('  📦 Params:', params?.toString() || 'none');
    console.log('  🔑 Headers:', this.getHeaders());
    
    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout()),
      catchError(error => {
        console.error('❌ ApiService GET Role Endpoint Error:');
        console.error('  📍 Endpoint:', endpoint);
        console.error('  🌐 URL:', url);
        console.error('  ❌ Error:', error);
        console.error('  📊 Status:', error.status);
        console.error('  📝 Message:', error.message);
        
        if (error.name === 'TimeoutError') {
          console.error('⏰ Request timeout - backend may be slow or unreachable');
        } else if (error.status === 0) {
          console.error('🌐 Network error - check if backend is running');
        } else if (error.status === 401) {
          console.error('🔐 Unauthorized - check credentials/token');
        } else if (error.status === 404) {
          console.error('🔍 Not found - check endpoint URL');
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * POST request for role endpoints (without /api prefix)
   */
  postRoleEndpoint<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint); // Use full URL with base URL
    console.log('🚀 ApiService POST role endpoint:');
    console.log('  📍 Endpoint:', endpoint);
    console.log('  🌐 Full URL:', url);
    console.log('  📦 Data:', data);
    console.log('  📦 Params:', params?.toString() || 'none');
    console.log('  🔑 Headers:', this.getHeaders());
    
    return this.http.post<T>(url, data, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout()),
      catchError(error => {
        console.error('❌ ApiService POST Role Endpoint Error:');
        console.error('  📍 Endpoint:', endpoint);
        console.error('  🌐 URL:', url);
        console.error('  ❌ Error:', error);
        console.error('  📊 Status:', error.status);
        console.error('  📝 Message:', error.message);
        
        if (error.name === 'TimeoutError') {
          console.error('⏰ Request timeout - backend may be slow or unreachable');
        } else if (error.status === 0) {
          console.error('🌐 Network error - check if backend is running');
        } else if (error.status === 401) {
          console.error('🔐 Unauthorized - check credentials/token');
        } else if (error.status === 404) {
          console.error('🔍 Not found - check endpoint URL');
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * PUT request for role endpoints (without /api prefix)
   */
  putRoleEndpoint<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = endpoint; // Use endpoint directly without base URL
    console.log('🚀 ApiService PUT role endpoint:');
    console.log('  📍 Endpoint:', endpoint);
    console.log('  🌐 Full URL:', url);
    console.log('  📦 Data:', data);
    console.log('  📦 Params:', params?.toString() || 'none');
    console.log('  🔑 Headers:', this.getHeaders());
    
    return this.http.put<T>(url, data, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout()),
      catchError(error => {
        console.error('❌ ApiService PUT Role Endpoint Error:');
        console.error('  📍 Endpoint:', endpoint);
        console.error('  🌐 URL:', url);
        console.error('  ❌ Error:', error);
        console.error('  📊 Status:', error.status);
        console.error('  📝 Message:', error.message);
        
        if (error.name === 'TimeoutError') {
          console.error('⏰ Request timeout - backend may be slow or unreachable');
        } else if (error.status === 0) {
          console.error('🌐 Network error - check if backend is running');
        } else if (error.status === 401) {
          console.error('🔐 Unauthorized - check credentials/token');
        } else if (error.status === 404) {
          console.error('🔍 Not found - check endpoint URL');
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * GET request for partner endpoints (without /api prefix)
   */
  getPartnerEndpoint<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = endpoint; // Use endpoint directly without base URL
    console.log('🚀 ApiService GET partner endpoint:');
    console.log('  📍 Endpoint:', endpoint);
    console.log('  🌐 Full URL:', url);
    console.log('  📦 Params:', params?.toString() || 'none');
    console.log('  🔑 Headers:', this.getHeaders());
    
    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout()),
      catchError(error => {
        console.error('❌ ApiService GET Partner Endpoint Error:');
        console.error('  📍 Endpoint:', endpoint);
        console.error('  🌐 URL:', url);
        console.error('  ❌ Error:', error);
        console.error('  📊 Status:', error.status);
        console.error('  📝 Message:', error.message);
        
        if (error.name === 'TimeoutError') {
          console.error('⏰ Request timeout - backend may be slow or unreachable');
        } else if (error.status === 0) {
          console.error('🌐 Network error - check if backend is running');
        } else if (error.status === 401) {
          console.error('🔐 Unauthorized - check credentials/token');
        } else if (error.status === 404) {
          console.error('🔍 Not found - check endpoint URL');
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * POST request for logs endpoints (without /api prefix)
   */
  postLogsEndpoint<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = endpoint; // Use endpoint directly without base URL
    console.log('🚀 ApiService POST logs endpoint:');
    console.log('  📍 Endpoint:', endpoint);
    console.log('  🌐 Full URL:', url);
    console.log('  📦 Data:', data);
    console.log('  📋 Params:', params?.toString() || 'none');
    console.log('  🔑 Headers:', this.getHeaders());
    
    return this.http.post<T>(url, data, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      timeout(30000),
      catchError((error) => {
        console.error('❌ ApiService POST logs endpoint error:', error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        
        if (error.status === 401) {
          console.error('🔐 Unauthorized - check credentials/token');
        } else if (error.status === 404) {
          console.error('🔍 Not found - check endpoint URL');
        }
        
        return throwError(() => error);
      })
    );
  }
}
