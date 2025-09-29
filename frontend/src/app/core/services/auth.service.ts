import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError, map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationRequest, AuthenticationResponse, User, ApiResponse } from '../models/auth.models';
import { ApiService } from './api.service';
import { JwtUtil, JwtPayload } from '../utils/jwt.util';
import { StorageUtil } from '../utils/storage.util';
import { DateUtil } from '../utils/date.util';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/api.constants';
import { APP_CONFIG } from '../constants/app.constants';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    private cacheService: CacheService
  ) {
    this.initializeAuth();
  }

  /**
   * Authenticate user with username and password
   */
  login(credentials: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.apiService.post<ApiResponse<AuthenticationResponse>>(API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        tap(response => {
          // Extract tokens from the nested result object
          const tokens = response.result;
          this.setTokens(tokens.access_token, tokens.refresh_token);
          this.loadCurrentUser();
          // Cache user info with tokens
          const user = this.createUserFromToken(tokens.access_token);
          this.cacheService.cacheUserInfo(user, tokens.access_token, tokens.refresh_token);
        }),
        // Map to return just the tokens
        map(response => response.result)
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
    
    return this.apiService.post<ApiResponse<AuthenticationResponse>>(API_ENDPOINTS.AUTH.REFRESH, refreshToken)
      .pipe(
        tap(response => {
          // Extract tokens from the nested result object
          const tokens = response.result;
          this.setTokens(tokens.access_token, tokens.refresh_token);
          // Update cache with new tokens
          const user = this.createUserFromToken(tokens.access_token);
          this.cacheService.cacheUserInfo(user, tokens.access_token, tokens.refresh_token);
        }),
        // Map to return just the tokens
        map(response => response.result)
      );
  }

  /**
   * Get current user information
   */
  getCurrentUser(): User | null {
    return this.cacheService.getCachedUser();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !this.cacheService.isTokenExpired() && 
           !this.cacheService.isSessionTimedOut() && 
           this.cacheService.isCacheValid();
  }

  /**
   * Logout user and clear tokens
   */
  logout(): void {
    this.cacheService.clearCache();
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
   * Initialize authentication system
   */
  private initializeAuth(): void {
    // Load user from cache if available
    const cachedUser = this.cacheService.getCachedUser();
    if (cachedUser) {
      this.currentUserSubject.next(cachedUser);
    }

    // Subscribe to cache changes
    this.cacheService.userInfo$.subscribe(cachedInfo => {
      if (cachedInfo) {
        this.currentUserSubject.next(cachedInfo.user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Load current user from JWT token
   */
  private loadCurrentUser(): void {
    const token = this.getAccessToken();
    if (!token) return;

    const user = this.createUserFromToken(token);
    this.currentUserSubject.next(user);
  }

  /**
   * Create User object from JWT token
   */
  private createUserFromToken(token: string): User {
    const payload = JwtUtil.decodeToken(token);
    if (!payload) {
      throw new Error('Invalid token');
    }

    return {
      userId: payload.sub,
      username: payload.sub,
      email: '', // Not available in JWT
      firstName: '', // Not available in JWT
      lastName: '', // Not available in JWT
      name: payload.sub,
      role: 'User', // Default role
      userType: 'USER',
      isActive: true,
      avatar: undefined,
      createdAt: DateUtil.toISOString(new Date(payload.iat * 1000)),
      updatedAt: DateUtil.toISOString(new Date(payload.exp * 1000))
    };
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
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    return this.cacheService.hasPermission(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return this.cacheService.hasAnyPermission(permissions);
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    return this.cacheService.hasAllPermissions(permissions);
  }

  /**
   * Get all user permissions
   */
  getUserPermissions(): string[] {
    return this.cacheService.getCachedPermissions();
  }

  /**
   * Update user activity
   */
  updateActivity(): void {
    this.cacheService.updateActivity();
  }

  /**
   * Check if token needs refresh
   */
  needsTokenRefresh(): boolean {
    return this.cacheService.needsTokenRefresh();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cacheService.getCacheStats();
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