/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Unique identifier for the rate limit (e.g., IP address, user ID)
   */
  identifier: string;
  
  /**
   * Maximum number of requests allowed in the time window
   */
  limit: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 * @param config Rate limit configuration
 * @returns Rate limit result with success status and metadata
 */
export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  const { identifier, limit, windowMs } = config;
  const now = Date.now();
  const key = identifier;

  // Initialize or get existing entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  const entry = store[key];
  const remaining = Math.max(0, limit - entry.count - 1);

  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment counter
  entry.count++;

  return {
    success: true,
    limit,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request (IP or user ID)
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  
  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return `ip:${forwarded.split(',')[0].trim()}`;
  }
  
  if (realIp) {
    return `ip:${realIp}`;
  }
  
  // Fallback to a general identifier
  return 'ip:unknown';
}

/**
 * Preset rate limit configurations
 */
export const RateLimitPresets = {
  // Auth endpoints: 5 requests per 15 minutes
  AUTH: {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  },
  
  // OTP endpoints: 3 requests per 5 minutes
  OTP: {
    limit: 3,
    windowMs: 5 * 60 * 1000,
  },
  
  // API endpoints: 100 requests per minute
  API: {
    limit: 100,
    windowMs: 60 * 1000,
  },
  
  // Strict endpoints: 10 requests per hour
  STRICT: {
    limit: 10,
    windowMs: 60 * 60 * 1000,
  },
};

