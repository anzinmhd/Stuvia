/**
 * Input Sanitization Utilities
 * Helps prevent XSS and injection attacks
 */

/**
 * Sanitize string input by removing potentially dangerous HTML/script tags
 * @param input - Raw string input
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Sanitize email input
 * @param email - Raw email input
 * @returns Sanitized and normalized email
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';
  
  return email
    .trim()
    .toLowerCase()
    // Remove any HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove special characters except @ . - _ +
    .replace(/[^a-z0-9@.\-_+]/g, '');
}

/**
 * Validate and sanitize name input
 * Allows: letters, spaces, hyphens, apostrophes
 * @param name - Raw name input
 * @returns Sanitized name
 */
export function sanitizeName(name: string): string {
  if (typeof name !== 'string') return '';
  
  return name
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Only allow letters, spaces, hyphens, apostrophes, and dots
    .replace(/[^a-zA-Z\s\-'.]/g, '')
    // Remove multiple spaces
    .replace(/\s+/g, ' ')
    // Limit length to prevent buffer overflow
    .slice(0, 100);
}

/**
 * Sanitize numeric input
 * @param input - Raw input
 * @returns Sanitized number or null
 */
export function sanitizeNumber(input: any): number | null {
  const num = Number(input);
  return isNaN(num) || !isFinite(num) ? null : num;
}

/**
 * Sanitize and validate date string (YYYY-MM-DD format)
 * @param dateStr - Raw date string
 * @returns Sanitized date string or null
 */
export function sanitizeDate(dateStr: string): string | null {
  if (typeof dateStr !== 'string') return null;
  
  const sanitized = dateStr.trim().replace(/[^0-9\-]/g, '');
  
  // Validate YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(sanitized)) return null;
  
  // Check if valid date
  const date = new Date(sanitized);
  if (isNaN(date.getTime())) return null;
  
  return sanitized;
}

/**
 * Sanitize object keys and string values recursively
 * Useful for sanitizing JSON payloads
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => 
      typeof item === 'object' ? sanitizeObject(item) : 
      typeof item === 'string' ? sanitizeString(item) : 
      item
    ) as any as T;
  }
  
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeString(key);
    
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[sanitizedKey] = sanitizeObject(value);
    } else {
      sanitized[sanitizedKey] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Escape HTML entities to prevent XSS
 * @param html - Raw HTML string
 * @returns Escaped string safe for display
 */
export function escapeHtml(html: string): string {
  if (typeof html !== 'string') return '';
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return html.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Validate and sanitize URL
 * @param url - Raw URL string
 * @returns Sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== 'string') return null;
  
  try {
    const parsed = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Validation helpers
 */
export const Validators = {
  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  /**
   * Validate Rajagiri email domain
   */
  isRajagiriEmail(email: string): boolean {
    return email.toLowerCase().endsWith('@rajagiri.edu.in');
  },
  
  /**
   * Validate password strength
   */
  isStrongPassword(password: string, minLength = 6): boolean {
    if (password.length < minLength) return false;
    return true;
  },
  
  /**
   * Validate semester number (1-8)
   */
  isValidSemester(semester: string | number): boolean {
    const num = Number(semester);
    return Number.isInteger(num) && num >= 1 && num <= 8;
  },
};

