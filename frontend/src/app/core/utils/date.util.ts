export class DateUtil {
  /**
   * Format date to ISO string
   */
  static toISOString(date: Date | string | number): string {
    const d = new Date(date);
    return d.toISOString();
  }

  /**
   * Format date to readable string
   */
  static formatDate(date: Date | string | number, format: 'short' | 'long' | 'time' = 'short'): string {
    const d = new Date(date);
    
    switch (format) {
      case 'short':
        return d.toLocaleDateString();
      case 'long':
        return d.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'time':
        return d.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      default:
        return d.toLocaleDateString();
    }
  }

  /**
   * Get current timestamp
   */
  static now(): string {
    return this.toISOString(new Date());
  }

  /**
   * Add days to date
   */
  static addDays(date: Date | string | number, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  /**
   * Check if date is today
   */
  static isToday(date: Date | string | number): boolean {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }

  /**
   * Get relative time (e.g., "2 hours ago")
   */
  static getRelativeTime(date: Date | string | number): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return this.formatDate(d, 'short');
  }
}
