/**
 * Date utility functions to ensure consistent date formatting across the application
 * and prevent hydration errors caused by server/client locale differences
 */

/**
 * Format a date consistently across server and client
 * @param date - Date object or date string
 * @param options - Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default to US locale to ensure consistency between server and client
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format a date with time consistently across server and client
 * @param date - Date object or date string
 * @param options - Intl.DateTimeFormatOptions for custom formatting
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format a date for display in a user-friendly format
 * @param date - Date object or date string
 * @returns User-friendly date string (e.g., "Jan 15, 2024")
 */
export function formatDateDisplay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a date for display in a compact format
 * @param date - Date object or date string
 * @returns Compact date string (e.g., "01/15/24")
 */
export function formatDateCompact(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * Format a date for use in forms (ISO date format)
 * @param date - Date object or date string
 * @returns ISO date string (e.g., "2024-01-15")
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toISOString().split('T')[0];
}

/**
 * Format a relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date object or date string
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInSeconds = Math.round(diffInMs / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (Math.abs(diffInDays) >= 1) {
    return diffInDays > 0 ? `in ${diffInDays} day${diffInDays > 1 ? 's' : ''}` : `${Math.abs(diffInDays)} day${Math.abs(diffInDays) > 1 ? 's' : ''} ago`;
  } else if (Math.abs(diffInHours) >= 1) {
    return diffInHours > 0 ? `in ${diffInHours} hour${diffInHours > 1 ? 's' : ''}` : `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) > 1 ? 's' : ''} ago`;
  } else if (Math.abs(diffInMinutes) >= 1) {
    return diffInMinutes > 0 ? `in ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}` : `${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

/**
 * Get current date formatted consistently
 * @param options - Intl.DateTimeFormatOptions for custom formatting
 * @returns Current date formatted string
 */
export function getCurrentDate(options?: Intl.DateTimeFormatOptions): string {
  return formatDate(new Date(), options);
}

/**
 * Check if a date is today
 * @param date - Date object or date string
 * @returns True if the date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
}

/**
 * Check if a date is yesterday
 * @param date - Date object or date string
 * @returns True if the date is yesterday
 */
export function isYesterday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return dateObj.getDate() === yesterday.getDate() &&
         dateObj.getMonth() === yesterday.getMonth() &&
         dateObj.getFullYear() === yesterday.getFullYear();
}
