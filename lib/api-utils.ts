import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Standard API error responses
export const ApiErrors = {
  UNAUTHORIZED: { message: "Unauthorized", status: 401 },
  FORBIDDEN: { message: "Forbidden", status: 403 },
  NOT_FOUND: { message: "Not found", status: 404 },
  BAD_REQUEST: { message: "Bad request", status: 400 },
  INTERNAL_ERROR: { message: "Internal server error", status: 500 },
  RATE_LIMITED: { message: "Too many requests", status: 429 },
  VALIDATION_ERROR: { message: "Validation failed", status: 422 },
} as const;

// Create standardized error response
export function createErrorResponse(error: keyof typeof ApiErrors, customMessage?: string) {
  const { message, status } = ApiErrors[error];
  return NextResponse.json(
    { error: true, message: customMessage || message },
    { status }
  );
}

// Create success response
export function createSuccessResponse(data: any = {}, status: number = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

// Validate required fields in request body
export function validateRequiredFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiting
export function checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Get authenticated user session with error handling
export async function getAuthenticatedUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: createErrorResponse("UNAUTHORIZED") };
    }
    return { user: session.user, session };
  } catch (error) {
    console.error("[API] Session error:", error);
    return { error: createErrorResponse("INTERNAL_ERROR") };
  }
}

// Validate email domain
export function validateEmailDomain(email: string, allowedDomain: string = "@rajagiri.edu.in"): boolean {
  return email.toLowerCase().endsWith(allowedDomain);
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

// Log security events
export function logSecurityEvent(event: string, details: any) {
  console.warn(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    ...details
  });
}

// API route wrapper with error handling
export function withErrorHandling(handler: Function) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error("[API] Unhandled error:", error);
      return createErrorResponse("INTERNAL_ERROR", "An unexpected error occurred");
    }
  };
}

// Validate admin access
export async function validateAdminAccess() {
  const authResult = await getAuthenticatedUser();
  if ('error' in authResult) {
    return authResult;
  }

  const isAdmin = (authResult.session as any)?.user?.role === 'admin';
  if (!isAdmin) {
    logSecurityEvent("UNAUTHORIZED_ADMIN_ACCESS", {
      email: authResult.user.email,
      userAgent: "N/A" // Would need to be passed from request
    });
    return { error: createErrorResponse("FORBIDDEN", "Admin access required") };
  }

  return { user: authResult.user, session: authResult.session };
}
