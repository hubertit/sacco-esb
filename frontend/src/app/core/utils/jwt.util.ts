export interface JwtPayload {
  permissions: string[];
  sub: string;
  iat: number;
  exp: number;
}

export class JwtUtil {
  /**
   * Decode JWT token and return payload
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  static getTimeUntilExpiry(token: string): number {
    const payload = this.decodeToken(token);
    if (!payload) return 0;
    
    const currentTime = Date.now() / 1000;
    return Math.max(0, (payload.exp - currentTime) * 1000);
  }

  /**
   * Check if token needs refresh (within threshold)
   */
  static needsRefresh(token: string, thresholdMinutes: number = 10): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    const thresholdMs = thresholdMinutes * 60 * 1000;
    return timeUntilExpiry <= thresholdMs;
  }
}
