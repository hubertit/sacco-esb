export class NameUtil {
  /**
   * Convert username to proper name format
   * Examples:
   * - jerome.rwego -> Jerome Rwego
   * - john.doe -> John Doe
   * - mary.jane.smith -> Mary Jane Smith
   * - admin -> Admin
   */
  static convertUsernameToName(username: string): string {
    if (!username) {
      return 'User';
    }

    // Split by dots and capitalize each part
    const parts = username.split('.');
    const capitalizedParts = parts.map(part => {
      // Handle empty parts
      if (!part.trim()) {
        return '';
      }
      
      // Capitalize first letter and make rest lowercase
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });

    // Join with spaces and filter out empty parts
    return capitalizedParts.filter(part => part.length > 0).join(' ');
  }

  /**
   * Get initials from a name
   * Examples:
   * - "Jerome Rwego" -> "JR"
   * - "John Doe" -> "JD"
   * - "Mary Jane Smith" -> "MJS"
   */
  static getInitials(name: string): string {
    if (!name) {
      return 'U';
    }

    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 0) {
      return 'U';
    }

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    // Take first letter of first two words, or first letter of each word if more than 2
    if (words.length === 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }

    // For 3+ words, take first letter of each
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }

  /**
   * Get a shortened version of the name for display
   * Examples:
   * - "Jerome Rwego" -> "Jerome R."
   * - "Mary Jane Smith" -> "Mary J. S."
   */
  static getShortName(name: string): string {
    if (!name) {
      return 'User';
    }

    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length <= 1) {
      return name;
    }

    if (words.length === 2) {
      return `${words[0]} ${words[1].charAt(0)}.`;
    }

    // For 3+ words, show first name and initials of others
    const firstWord = words[0];
    const initials = words.slice(1).map(word => word.charAt(0)).join('.');
    return `${firstWord} ${initials}.`;
  }
}
