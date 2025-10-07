import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";
import { sendMail } from "@/lib/email";
import crypto from "node:crypto";
import { checkRateLimit, getClientIdentifier, RateLimitPresets } from "@/lib/rate-limit";

const COLL = "emailOtps";
const OTP_TTL_SEC = 5 * 60; // 5 minutes
const RESEND_COOLDOWN_SEC = 30; // 30 seconds between sends

function normalizeEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

function isAllowedDomain(email: string) {
  return email.endsWith("@rajagiri.edu.in");
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const norm = normalizeEmail(email);
    if (!norm || !isAllowedDomain(norm)) {
      return NextResponse.json({ message: "Only @rajagiri.edu.in emails are allowed" }, { status: 400 });
    }

    // Rate limiting: 3 OTP requests per 5 minutes per IP/user
    const rateLimitResult = checkRateLimit({
      identifier: getClientIdentifier(req, norm),
      ...RateLimitPresets.OTP,
    });

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        { 
          message: "Too many OTP requests. Please try again later.",
          retryAfter 
        },
        { status: 429 }
      );
    }

    // Cooldown check
    const ref = db.collection(COLL).doc(norm);
    const snap = await ref.get();
    const now = Date.now();
    const lastSentAt = Number(snap.data()?.lastSentAt || 0);
    const elapsed = (now - lastSentAt) / 1000;
    if (lastSentAt && elapsed < RESEND_COOLDOWN_SEC) {
      const retryAfter = Math.ceil(RESEND_COOLDOWN_SEC - elapsed);
      return NextResponse.json({ message: `Please wait ${retryAfter}s before requesting a new code`, retryAfter }, { status: 429 });
    }

    const code = (Math.floor(100000 + Math.random() * 900000)).toString();
    const hash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = now + OTP_TTL_SEC * 1000;

    await ref.set({
      hash,
      expiresAt,
      attempts: 0,
      createdAt: snap.exists ? snap.data()?.createdAt || now : now,
      lastSentAt: now,
    }, { merge: true });

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Stuvia verification code</h2>
        <p>Your one-time verification code is:</p>
        <div style="font-size:24px;font-weight:700;letter-spacing:4px">${code}</div>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `;

    await sendMail({ to: norm, subject: "Your Stuvia verification code", html });

    return NextResponse.json({ ok: true, cooldown: RESEND_COOLDOWN_SEC });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Failed to send OTP" }, { status: 500 });
  }
}
