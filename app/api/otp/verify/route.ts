import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import crypto from "node:crypto";
import { checkRateLimit, getClientIdentifier, RateLimitPresets } from "@/lib/rate-limit";

const COLL = "emailOtps";
const MAX_ATTEMPTS = 5;

function normalizeEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    const norm = normalizeEmail(email);
    const codeStr = String(code || "").trim();
    if (!norm || !codeStr) {
      return NextResponse.json({ message: "Email and code are required" }, { status: 400 });
    }

    // Rate limiting: 10 verification attempts per hour per IP/user
    const rateLimitResult = checkRateLimit({
      identifier: getClientIdentifier(req, norm),
      ...RateLimitPresets.STRICT,
    });

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { 
          message: "Too many verification attempts. Please try again later.",
          retryAfter 
        },
        { status: 429 }
      );
    }

    const snap = await db.collection(COLL).doc(norm).get();
    if (!snap.exists) {
      return NextResponse.json({ message: "OTP not found. Please request a new code." }, { status: 400 });
    }
    const data = snap.data() as any;
    if (data.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ message: "Too many attempts. Please request a new code." }, { status: 400 });
    }
    if (Date.now() > Number(data.expiresAt)) {
      return NextResponse.json({ message: "Code expired. Please request a new code." }, { status: 400 });
    }

    const hash = crypto.createHash("sha256").update(codeStr).digest("hex");
    if (hash !== data.hash) {
      await db.collection(COLL).doc(norm).set({ attempts: (data.attempts || 0) + 1 }, { merge: true });
      return NextResponse.json({ message: "Invalid code" }, { status: 400 });
    }

    // Mark as verified and clear hash
    // Mark verified, then delete the record to keep collection clean
    const ref = db.collection(COLL).doc(norm);
    await ref.set({ verified: true, hash: null, attempts: 0 }, { merge: true });
    await ref.delete().catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Verification failed" }, { status: 500 });
  }
}
