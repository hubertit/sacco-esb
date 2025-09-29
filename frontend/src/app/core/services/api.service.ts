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
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Accept': 'application/json'
    });
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const cacheBustParams = params ? params.set('_t', timestamp.toString()) : new HttpParams().set('_t', timestamp.toString());
    
    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params: cacheBustParams
    }).pipe(
      timeout(this.appConfig.getRequestTimeout())
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
}
