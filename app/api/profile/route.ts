import { NextResponse } from "next/server";
import { upsertProfile, getByEmail } from "@/lib/userStoreFirebase";
import { 
  getAuthenticatedUser, 
  validateRequiredFields, 
  createErrorResponse, 
  createSuccessResponse,
  sanitizeInput,
  checkRateLimit,
  withErrorHandling
} from "@/lib/api-utils";

export const POST = withErrorHandling(async (req: Request) => {
  // Rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`profile-update-${clientIP}`, 5, 60000)) {
    return createErrorResponse("RATE_LIMITED", "Too many profile updates. Please try again later.");
  }

  // Authentication
  const authResult = await getAuthenticatedUser();
  if ('error' in authResult) {
    return authResult.error;
  }
  const email = authResult.user.email as string;

  // Parse and validate request body
  let body;
  try {
    body = await req.json();
  } catch {
    return createErrorResponse("BAD_REQUEST", "Invalid JSON in request body");
  }

  const { name, branch, division, semester } = body;
  
  // Validate required fields
  const validationError = validateRequiredFields(body, ['name', 'branch', 'division', 'semester']);
  if (validationError) {
    return createErrorResponse("VALIDATION_ERROR", validationError);
  }

  // Sanitize inputs
  const sanitizedData = {
    email,
    name: sanitizeInput(name),
    branch: sanitizeInput(branch),
    division: sanitizeInput(division),
    semester: sanitizeInput(semester),
    profileCompleted: true
  };

  // Validate semester is a number
  if (!/^[1-8]$/.test(sanitizedData.semester)) {
    return createErrorResponse("VALIDATION_ERROR", "Semester must be between 1 and 8");
  }

  // Validate branch
  const validBranches = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'CU'];
  if (!validBranches.includes(sanitizedData.branch)) {
    return createErrorResponse("VALIDATION_ERROR", "Invalid branch selected");
  }

  // Validate division
  const validDivisions = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Nil'];
  if (!validDivisions.includes(sanitizedData.division)) {
    return createErrorResponse("VALIDATION_ERROR", "Invalid division selected");
  }

  // Update profile
  await upsertProfile(sanitizedData);
  
  const res = createSuccessResponse({ message: "Profile updated successfully" });
  // Signal middleware that onboarding just completed; expires in 5 minutes
  res.cookies.set("onboarded", "1", { path: "/", maxAge: 60 * 5, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return res;
});

export const GET = withErrorHandling(async () => {
  const authResult = await getAuthenticatedUser();
  if ('error' in authResult) {
    return createSuccessResponse({}); // Return empty profile for unauthenticated users
  }
  
  const email = authResult.user.email as string;
  const profile = await getByEmail(email);
  return createSuccessResponse(profile || {});
});
