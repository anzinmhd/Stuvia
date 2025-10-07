import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { checkRateLimit, getClientIdentifier, RateLimitPresets } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get("email") || "").trim();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  // Rate limiting: 100 requests per minute per IP
  const rateLimitResult = checkRateLimit({
    identifier: getClientIdentifier(req, email),
    ...RateLimitPresets.API,
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const allowedDomain = "@rajagiri.edu.in";
  if (!email.toLowerCase().endsWith(allowedDomain)) {
    return NextResponse.json({ exists: false, reason: "invalid_domain" });
  }

  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    return NextResponse.json({ exists: true, name: userRecord.displayName || null });
  } catch (e: any) {
    // auth/user-not-found
    return NextResponse.json({ exists: false });
  }
}
