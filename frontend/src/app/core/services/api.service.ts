import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig
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
    });
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.post<T>(url, data, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.put<T>(url, data, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.delete<T>(url, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data: any, params?: HttpParams): Observable<T> {
    const url = this.apiConfig.getFullUrl(endpoint);
    return this.http.patch<T>(url, data, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Get base URL for external use
   */
  getBaseUrl(): string {
    return this.apiConfig.getBaseUrl();
  }
}
