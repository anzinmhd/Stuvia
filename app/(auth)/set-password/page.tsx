"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { SiteLogo } from "@/components/site-logo";

export default function SetPasswordPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    // Not logged in → go to login
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    // Already has password provider → go home
    const hasPwd = (session as any)?.user?.hasPasswordProvider;
    if (hasPwd) {
      router.replace("/");
    }
  }, [status, session, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to set password");
      }
      setSuccess("Password set successfully. You can now log in with email and password.");
      // After a short delay, go home
      setTimeout(() => router.replace("/"), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md card p-6">
        <div className="flex items-center justify-between">
          <SiteLogo />
          <h1 className="text-xl font-semibold">Set your password</h1>
        </div>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Create a password for your account so you can also log in with email and password later.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm">New Password</label>
            <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="confirm" className="text-sm">Confirm Password</label>
            <input id="confirm" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full rounded-lg border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button disabled={loading} className="mt-2 w-full rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 transition">
            {loading ? "Saving..." : "Save password"}
          </button>
        </form>
      </div>
    </main>
  );
}
