import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
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
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.get<T>(url, {
      headers: this.getHeaders(),
      params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout())
    );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.post<T>(url, data, {
      headers: this.getHeaders(),
      params
    }).pipe(
      timeout(this.appConfig.getRequestTimeout())
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
