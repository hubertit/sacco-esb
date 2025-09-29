import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationRequest, AuthenticationResponse, User } from '../models/auth.models';
import { ApiService } from './api.service';
import { JwtUtil } from '../utils/jwt.util';
import { StorageUtil } from '../utils/storage.util';
import { DateUtil } from '../utils/date.util';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/api.constants';
import { APP_CONFIG } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Authenticate user with username and password
   */
  login(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.apiService.post<AuthenticationResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        tap(response => {
          this.setTokens(response.access_token, response.refresh_token);
          this.loadCurrentUser();
        })
      );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<AuthenticationResponse> {
    const refreshToken = StorageUtil.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.apiService.post<AuthenticationResponse>(API_ENDPOINTS.AUTH.REFRESH, refreshToken)
      .pipe(
        tap(response => {
          this.setTokens(response.access_token, response.refresh_token);
        })
      );
  }

  /**
   * Get current user information
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = StorageUtil.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token && !JwtUtil.isTokenExpired(token);
  }

  /**
   * Logout user and clear tokens
   */
  logout(): void {
    StorageUtil.clearAppData();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return StorageUtil.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return StorageUtil.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set tokens in localStorage
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    StorageUtil.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    StorageUtil.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  /**
   * Load current user from JWT token
   */
  private loadCurrentUser(): void {
    const token = this.getAccessToken();
    if (!token) return;

    const payload = JwtUtil.decodeToken(token);
    if (!payload) return;

    const user = this.createUserFromPayload(payload);
    this.currentUserSubject.next(user);
    StorageUtil.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  /**
   * Create User object from JWT payload
   */
  private createUserFromPayload(payload: any): User {
    const firstName = payload.firstName || payload.given_name || '';
    const lastName = payload.lastName || payload.family_name || '';
    
    return {
      userId: payload.sub || payload.userId,
      username: payload.username || payload.sub,
      email: payload.email || '',
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || payload.username || payload.sub,
      role: payload.role || payload.roleName || 'User',
      userType: payload.userType || 'USER',
      isActive: true,
      avatar: payload.avatar,
      createdAt: payload.iat ? DateUtil.toISOString(new Date(payload.iat * 1000)) : DateUtil.now(),
      updatedAt: payload.exp ? DateUtil.toISOString(new Date(payload.exp * 1000)) : DateUtil.now()
    };
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): void {
    const user = StorageUtil.getItem<User>(STORAGE_KEYS.CURRENT_USER);
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Check if user is logged in (alias for isAuthenticated)
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get user role
   */
  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || 'Guest';
  }

  /**
   * Validate password (for lock screen)
   */
  validatePassword(password: string): Observable<boolean> {
    // This would typically make an API call to validate password
    // For now, we'll return a simple observable
    return new Observable(observer => {
      // In a real implementation, this would call the backend
      observer.next(true);
      observer.complete();
    });
  }
}