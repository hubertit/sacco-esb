import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { StorageUtil } from '../utils/storage.util';
import { JwtUtil, JwtPayload } from '../utils/jwt.util';
import { DateUtil } from '../utils/date.util';
import { STORAGE_KEYS } from '../constants/api.constants';
import { User } from '../models/auth.models';

export interface CachedUserInfo {
  user: User;
  permissions: string[];
  tokenExpiry: Date;
  lastActivity: Date;
}

export interface CacheConfig {
  tokenRefreshThreshold: number; // minutes before expiry to refresh
  sessionTimeout: number; // minutes of inactivity before logout
  maxCacheAge: number; // hours to keep cache
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private userInfoSubject = new BehaviorSubject<CachedUserInfo | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();

  private config: CacheConfig = {
    tokenRefreshThreshold: 5, // 5 minutes before expiry
    sessionTimeout: 30, // 30 minutes of inactivity
    maxCacheAge: 24 // 24 hours
  };

  private activityTimer?: any;
  private tokenRefreshTimer?: any;

  constructor() {
    this.loadFromCache();
    this.startActivityTracking();
  }

  /**
   * Cache user information and tokens
   */
  cacheUserInfo(user: User, accessToken: string, refreshToken: string): void {
    const payload = JwtUtil.decodeToken(accessToken);
    if (!payload) return;

    const cachedInfo: CachedUserInfo = {
      user,
      permissions: payload.permissions || [],
      tokenExpiry: new Date(payload.exp * 1000),
      lastActivity: new Date()
    };

    // Store in localStorage
    StorageUtil.setItem(STORAGE_KEYS.CURRENT_USER, user);
    StorageUtil.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    StorageUtil.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    StorageUtil.setItem('cached_user_info', cachedInfo);

    // Update observable
    this.userInfoSubject.next(cachedInfo);

    // Start token refresh timer
    this.startTokenRefreshTimer(cachedInfo.tokenExpiry);
  }

  /**
   * Get cached user information
   */
  getCachedUserInfo(): CachedUserInfo | null {
    return this.userInfoSubject.value;
  }

  /**
   * Get cached user
   */
  getCachedUser(): User | null {
    const cachedInfo = this.getCachedUserInfo();
    return cachedInfo?.user || null;
  }

  /**
   * Get cached permissions
   */
  getCachedPermissions(): string[] {
    const cachedInfo = this.getCachedUserInfo();
    return cachedInfo?.permissions || [];
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const permissions = this.getCachedPermissions();
    return permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getCachedPermissions();
    return permissions.some(permission => userPermissions.includes(permission));
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this.getCachedPermissions();
    return permissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry(): Date | null {
    const cachedInfo = this.getCachedUserInfo();
    return cachedInfo?.tokenExpiry || null;
  }

  /**
   * Check if token needs refresh
   */
  needsTokenRefresh(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return false;

    const now = new Date();
    const threshold = new Date(now.getTime() + (this.config.tokenRefreshThreshold * 60 * 1000));
    
    return expiry <= threshold;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;

    return new Date() >= expiry;
  }

  /**
   * Update last activity time
   */
  updateActivity(): void {
    const cachedInfo = this.getCachedUserInfo();
    if (cachedInfo) {
      cachedInfo.lastActivity = new Date();
      StorageUtil.setItem('cached_user_info', cachedInfo);
      this.userInfoSubject.next(cachedInfo);
    }
  }

  /**
   * Check if session has timed out
   */
  isSessionTimedOut(): boolean {
    const cachedInfo = this.getCachedUserInfo();
    if (!cachedInfo) return true;

    const now = new Date();
    const timeout = new Date(cachedInfo.lastActivity.getTime() + (this.config.sessionTimeout * 60 * 1000));
    
    return now > timeout;
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid(): boolean {
    const cachedInfo = this.getCachedUserInfo();
    if (!cachedInfo) return false;

    const now = new Date();
    const maxAge = new Date(cachedInfo.lastActivity.getTime() + (this.config.maxCacheAge * 60 * 60 * 1000));
    
    return now <= maxAge;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    StorageUtil.clearAppData();
    StorageUtil.removeItem('cached_user_info');
    this.userInfoSubject.next(null);
    this.clearTimers();
  }

  /**
   * Load cached data on service initialization
   */
  private loadFromCache(): void {
    const cachedInfo = StorageUtil.getItem<CachedUserInfo>('cached_user_info');
    if (cachedInfo && this.isCacheValid() && !this.isTokenExpired()) {
      this.userInfoSubject.next(cachedInfo);
      this.startTokenRefreshTimer(cachedInfo.tokenExpiry);
    } else {
      this.clearCache();
    }
  }

  /**
   * Start activity tracking timer
   */
  private startActivityTracking(): void {
    // Update activity every 5 minutes
    this.activityTimer = setInterval(() => {
      this.updateActivity();
    }, 5 * 60 * 1000);
  }

  /**
   * Start token refresh timer
   */
  private startTokenRefreshTimer(expiry: Date): void {
    this.clearTokenRefreshTimer();
    
    const now = new Date();
    const refreshTime = new Date(expiry.getTime() - (this.config.tokenRefreshThreshold * 60 * 1000));
    const delay = Math.max(0, refreshTime.getTime() - now.getTime());

    this.tokenRefreshTimer = setTimeout(() => {
      // Emit event for token refresh
      this.userInfoSubject.next({
        ...this.userInfoSubject.value!,
        tokenExpiry: expiry
      });
    }, delay);
  }

  /**
   * Clear token refresh timer
   */
  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
      this.tokenRefreshTimer = undefined;
    }
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = undefined;
    }
    this.clearTokenRefreshTimer();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    hasUser: boolean;
    hasPermissions: boolean;
    tokenExpiry: Date | null;
    lastActivity: Date | null;
    isExpired: boolean;
    needsRefresh: boolean;
    isTimedOut: boolean;
  } {
    const cachedInfo = this.getCachedUserInfo();
    
    return {
      hasUser: !!cachedInfo?.user,
      hasPermissions: (cachedInfo?.permissions?.length || 0) > 0,
      tokenExpiry: cachedInfo?.tokenExpiry || null,
      lastActivity: cachedInfo?.lastActivity || null,
      isExpired: this.isTokenExpired(),
      needsRefresh: this.needsTokenRefresh(),
      isTimedOut: this.isSessionTimedOut()
    };
  }
}
