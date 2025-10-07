"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SiteLogo } from "@/components/site-logo";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const email = useMemo(() => (session?.user?.email || ""), [session]);
  const hasPasswordProvider = Boolean((session as any)?.user?.hasPasswordProvider);
  const profileCompleted = Boolean((session as any)?.user?.profileCompleted);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    // If profile is completed, redirect to dashboard
    if (profileCompleted) {
      router.replace("/");
      return;
    }
    // If user has no password provider (Google users), show password setup
    // Otherwise, redirect to signup to complete profile
    if (hasPasswordProvider) {
      router.replace(`/signup?email=${encodeURIComponent(email)}`);
    }
  }, [status, profileCompleted, hasPasswordProvider, email, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      if (!email) throw new Error("Missing email in session");
      if (!/^[^@\s]+@rajagiri\.edu\.in$/.test(email)) throw new Error("Please use your @rajagiri.edu.in email");

      setLoading(true);

      // Step 1: If user does not have password provider, set a password
      if (!hasPasswordProvider) {
        if (!password) throw new Error("Password is required");
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        if (!confirm) throw new Error("Please confirm your password");
        if (password !== confirm) throw new Error("Passwords do not match");
        
        setSuccess("Setting up your password...");
        const resPwd = await fetch("/api/set-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!resPwd.ok) {
          const data = await resPwd.json().catch(() => ({}));
          throw new Error(data?.message || "Failed to set password");
        }
      }

      setSuccess("Password set! Redirecting...");
      setTimeout(() => router.replace(`/signup?email=${encodeURIComponent(email)}`), 800);
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md card p-6">
        <div className="flex items-center justify-between">
          <SiteLogo />
          <h1 className="text-xl font-semibold">Welcome! Finish setup</h1>
        </div>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Set up your password to complete your account.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <label className="text-sm">Email</label>
            <div className="flex items-center justify-between rounded-lg border border-black/10 dark:border-white/20 bg-white/60 dark:bg-white/10 px-3 py-2">
              <span className="text-sm">{email}</span>
            </div>
          </div>

          {!hasPasswordProvider && (
            <>
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
                <label htmlFor="confirm" className="text-sm font-medium">Confirm Password *</label>
                <input 
                  id="confirm" 
                  type="password" 
                  value={confirm} 
                  onChange={e=>setConfirm(e.target.value)} 
                  placeholder="Confirm your password"
                  disabled={loading}
                  className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50" 
                />
                {confirm && password !== confirm && (
                  <p className="text-xs text-amber-600">Passwords do not match</p>
                )}
                {confirm && password === confirm && password.length >= 6 && (
                  <p className="text-xs text-green-600">✓ Passwords match</p>
                )}
              </div>
            </>
          )}


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
            disabled={loading || (!hasPasswordProvider && (!password || !confirm))} 
            className="mt-2 w-full rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 transition-colors duration-200 font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {success || "Setting up..."}
              </span>
            ) : (
              "Set Password"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
