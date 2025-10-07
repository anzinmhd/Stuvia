"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signIn } from "next-auth/react";
import SimpleSelect from "@/components/simple-select";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = useMemo(() => (searchParams?.get("email") || ""), [searchParams]);
  const otpEnabled = (process.env.NEXT_PUBLIC_ENABLE_EMAIL_OTP === "1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [division, setDivision] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // OTP state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Enhanced client-side validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^@\s]+@rajagiri\.edu\.in$/.test(email.trim())) {
      setError("Please use your @rajagiri.edu.in email");
      return;
    }
    if (otpEnabled && !otpVerified) {
      setError("Please verify the OTP sent to your email before continuing");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!name.trim()) {
      setError("Full name is required");
      return;
    }
    if (!branch) {
      setError("Please select your branch");
      return;
    }
    if (!division) {
      setError("Please select your division");
      return;
    }
    if (!semester) {
      setError("Please select your semester");
      return;
    }
    
    setLoading(true);
    try {

      setSuccess("Creating your account...");
      
      // 1) Create Firebase Auth user
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      setSuccess("Account created! Signing you in...");
      
      // 2) Establish NextAuth session
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error("Failed to sign in after account creation");
      }
      
      setSuccess("Saving your profile...");
      
      // 3) Save complete profile immediately
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          branch, 
          division, 
          semester 
        }),
      });
      
      if (!profileRes.ok) {
        const data = await profileRes.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to save profile");
      }
      
      setSuccess("Welcome to Stuvia! Redirecting...");
      
      // 4) Redirect to dashboard (skip onboarding)
      setTimeout(() => {
        router.push("/");
      }, 1500);
      
      return;
    } catch (err: any) {
      console.error("Signup error:", err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists. Please try signing in instead.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password is too weak. Please choose a stronger password.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email address. Please check and try again.");
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp() {
    try {
      setError(null);
      setSuccess(null);
      setOtpBusy(true);
      
      if (!email.trim()) {
        throw new Error("Please enter your email address first");
      }
      if (!/^[^@\s]+@rajagiri\.edu\.in$/.test(email.trim())) {
        throw new Error("Enter a valid @rajagiri.edu.in email first");
      }
      const res = await fetch("/api/otp/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to send code");
      }
      setOtpSent(true);
      setSuccess("Verification code sent to your email!");
    } catch (e: any) {
      setError(e?.message || "Failed to send code");
    } finally {
      setOtpBusy(false);
    }
  }

  async function verifyOtp() {
    try {
      setError(null);
      setSuccess(null);
      setOtpBusy(true);
      
      if (!otp.trim()) {
        throw new Error("Please enter the verification code");
      }
      if (otp.trim().length !== 6) {
        throw new Error("Please enter the complete 6-digit code");
      }
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: otp.trim().replace(/\s/g, "") }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Invalid code");
      }
      setOtpVerified(true);
      setSuccess("Email verified successfully!");
    } catch (e: any) {
      setError(e?.message || "Verification failed");
    } finally {
      setOtpBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md card p-6">
        <div className="flex items-center justify-between">
          <SiteLogo />
          <h1 className="text-xl font-semibold">Create Account</h1>
        </div>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Create your account and complete your profile.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm">College Email</label>
            {otpEnabled ? (
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e=>{ setEmail(e.target.value); setOtpSent(false); setOtpVerified(false); setError(null); setSuccess(null); }}
                  placeholder="uid@rajagiri.edu.in"
                  pattern="^[^@\s]+@rajagiri\.edu\.in$"
                  title="Please use your @rajagiri.edu.in email"
                  disabled={loading || otpBusy}
                  className="flex-1 rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
                  readOnly={Boolean(emailFromQuery)}
                />
                <button 
                  type="button" 
                  onClick={sendOtp} 
                  disabled={otpBusy || !email.trim() || !/^[^@\s]+@rajagiri\.edu\.in$/.test(email.trim())}
                  className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                >
                  {otpBusy ? "Sending..." : (otpSent ? "Resend" : "Send Code")}
                </button>
              </div>
            ) : (
              <input
                id="email"
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                placeholder="uid@rajagiri.edu.in"
                pattern="^[^@\s]+@rajagiri\.edu\.in$"
                title="Please use your @rajagiri.edu.in email"
                className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                readOnly={Boolean(emailFromQuery)}
              />
            )}
            <p className="text-xs text-black/60 dark:text-white/60">Use your college email (uid@rajagiri.edu.in).</p>
            {otpEnabled && otpSent && (
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label htmlFor="otp" className="text-sm">Verification code</label>
                  <input 
                    id="otp" 
                    type="text"
                    value={otp} 
                    onChange={e=>setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    placeholder="Enter 6-digit code" 
                    maxLength={6}
                    disabled={otpBusy || otpVerified}
                    className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 font-mono text-center tracking-widest" 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={verifyOtp} 
                  disabled={otpBusy || otpVerified || !otp.trim() || otp.trim().length !== 6}
                  className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                >
                  {otpVerified ? "✓ Verified" : (otpBusy ? "Verifying..." : "Verify")}
                </button>
              </div>
            )}
            {otpEnabled && otpVerified && <p className="text-xs text-emerald-600">Email verified</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">Create Password *</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="Enter password (min 6 characters)"
              minLength={6}
              disabled={loading}
              className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50" 
            />
            {password && password.length < 6 && (
              <p className="text-xs text-amber-600">Password must be at least 6 characters</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</label>
            <input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword} 
              onChange={e=>setConfirmPassword(e.target.value)} 
              placeholder="Confirm your password"
              disabled={loading}
              className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50" 
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-amber-600">Passwords do not match</p>
            )}
            {confirmPassword && password === confirmPassword && password.length >= 6 && (
              <p className="text-xs text-green-600">✓ Passwords match</p>
            )}
          </div>

          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
            <input 
              id="name" 
              type="text"
              value={name} 
              onChange={e=>setName(e.target.value)} 
              placeholder="Enter your full name"
              disabled={loading}
              className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50" 
            />
          </div>

          <SimpleSelect
            id="branch"
            label="Branch *"
            value={branch}
            onChange={setBranch}
            placeholder="Select your branch"
            options={[
              { label: "CSE - Computer Science Engineering", value: "CSE" },
              { label: "ECE - Electronics & Communication", value: "ECE" },
              { label: "EEE - Electrical & Electronics", value: "EEE" },
              { label: "ME - Mechanical Engineering", value: "ME" },
              { label: "CE - Civil Engineering", value: "CE" },
              { label: "CU - Computer Engineering", value: "CU" },
            ]}
          />

          <SimpleSelect
            id="division"
            label="Division *"
            value={division}
            onChange={setDivision}
            placeholder="Select your division"
            options={[
              { label: "Alpha", value: "Alpha" },
              { label: "Beta", value: "Beta" },
              { label: "Gamma", value: "Gamma" },
              { label: "Delta", value: "Delta" },
              { label: "Nil", value: "Nil" },
            ]}
          />

          <SimpleSelect
            id="semester"
            label="Semester *"
            value={semester}
            onChange={setSemester}
            placeholder="Select your semester"
            options={[
              { label: "1st Semester", value: "1" },
              { label: "2nd Semester", value: "2" },
              { label: "3rd Semester", value: "3" },
              { label: "4th Semester", value: "4" },
              { label: "5th Semester", value: "5" },
              { label: "6th Semester", value: "6" },
              { label: "7th Semester", value: "7" },
              { label: "8th Semester", value: "8" },
            ]}
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{success}</span>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading || (otpEnabled && !otpVerified) || !name.trim() || !branch || !division || !semester} 
            className="mt-2 w-full rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 transition-colors duration-200 font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {success || "Creating account..."}
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
