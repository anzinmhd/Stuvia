import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminAuth } from "@/lib/firebase/admin";
import { checkRateLimit, getClientIdentifier, RateLimitPresets } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const email = String(session.user.email);

  // Rate limiting: 5 password changes per hour per user
  const rateLimitResult = checkRateLimit({
    identifier: getClientIdentifier(req, email),
    ...RateLimitPresets.STRICT,
  });

  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      { 
        message: "Too many password change attempts. Please try again later.",
        retryAfter 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        }
      }
    );
  }

  const { password, currentPassword } = await req.json().catch(() => ({}));
  if (!password || typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
  }

  try {
    // If currentPassword is provided, verify it against Firebase Auth REST API
    if (currentPassword) {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ message: "Server missing Firebase API key" }, { status: 500 });
      }
      const verifyResp = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: currentPassword, returnSecureToken: true }),
        }
      );
      if (!verifyResp.ok) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
      }
    }
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (e: any) {
      // If no user, create one (useful for Google-only accounts that don't yet exist in Firebase Auth)
      if (e?.errorInfo?.code === 'auth/user-not-found' || /no user record/i.test(e?.message || "")) {
        userRecord = await adminAuth.createUser({ email, password, emailVerified: true, disabled: false });
      } else {
        throw e;
      }
    }
    await adminAuth.updateUser(userRecord.uid, { password });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = e?.message || "Failed to set password";
    return NextResponse.json({ message: msg }, { status: 400 });
  }
}
