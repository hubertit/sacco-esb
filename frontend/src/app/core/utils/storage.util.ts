export class StorageUtil {
  /**
   * Set item in localStorage with error handling
   */
  static setItem(key: string, value: any): boolean {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Get item from localStorage with error handling
   */
  static getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item);
      } catch {
        return item as T;
      }
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all app-related items from localStorage
   */
  static clearAppData(): void {
    const keysToRemove = [
      'access_token',
      'refresh_token',
      'current_user',
      'language',
      'account'
    ];
    
    keysToRemove.forEach(key => this.removeItem(key));
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}
