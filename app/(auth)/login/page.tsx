"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "password">("email");
  const [welcomeName, setWelcomeName] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const err = searchParams?.get("error");
    if (!err) return;
    if (err === "AccessDenied") {
      setError("Only @rajagiri.edu.in emails are allowed. Please use your college account.");
    } else if (err === "OAuthCallback" || err === "OAuthSignin") {
      setError("Google sign-in failed. Please try again or use your college account.");
    } else {
      setError("Sign-in failed. Please try again.");
    }
  }, [searchParams]);

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/user-exists?email=${encodeURIComponent(email)}`, { cache: "no-store" });
      if (!res.ok) {
        // Try to read json, else text
        let msg = "Failed to verify email";
        try {
          const data = await res.json();
          msg = data?.message || msg;
        } catch {
          try {
            const txt = await res.text();
            if (txt) msg = txt;
          } catch {}
        }
        throw new Error(msg);
      }
      const data = await res.json().catch(() => null);
      if (!data) throw new Error("Unexpected response. Please try again.");
      if (data.exists) {
        setWelcomeName(data.name || null);
        setStep("password");
      } else {
        if (data.reason === "invalid_domain") {
          setError("Only @rajagiri.edu.in emails are allowed. Please use your college account.");
          return;
        }
        // New user with valid domain: take to signup page
        router.push(`/signup?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err.message || "Could not verify email");
    } finally {
      setLoading(false);
    }
  }

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res) {
      setError("Unexpected error. Try again.");
      return;
    }
    if (res.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen grid md:grid-cols-[55%_45%] bg-white dark:bg-gray-950">
      {/* Left Panel - Elegant Brand Showcase */}
      <div className="hidden md:flex relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 overflow-hidden">
        {/* Subtle Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-violet-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl"></div>
        </div>
        
        {/* Elegant Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(100,116,139,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <div className="transform hover:scale-105 transition-transform duration-300">
          <SiteLogo />
          </div>
          
          <div className="space-y-8 max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Smart Attendance System</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
              Welcome to
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
                Stuvia
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
              Modern attendance tracking for colleges.<br />
              <span className="text-gray-500 dark:text-gray-500">Simple, secure, and elegantly designed.</span>
            </p>
            
            {/* Refined Feature Cards */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {[
                { icon: "⚡", label: "Fast" },
                { icon: "🔒", label: "Secure" },
                { icon: "📊", label: "Insights" }
              ].map((feature) => (
                <div key={feature.label} className="group p-4 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{feature.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
            <p>© {new Date().getFullYear()} Stuvia</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Refined Login Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden mb-8">
            <SiteLogo />
          </div>

          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </Link>
              </div>

              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sign in</h1>
                <p className="text-base text-gray-500 dark:text-gray-400">
                  Welcome back! Please enter your details.
                </p>
              </div>
            </div>

          {step === "email" && (
              <form className="space-y-6" onSubmit={onEmailSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    College Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  placeholder="uid@rajagiri.edu.in"
                  pattern="^[^@\s]+@rajagiri\.edu\.in$"
                  title="Please use your @rajagiri.edu.in email"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Use your @rajagiri.edu.in email address
                  </p>
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</span>
                    </div>
              </div>
                )}
                
                <button 
                  type="submit"
                  disabled={loading || !email} 
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] transform flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Checking...
                    </>
                  ) : (
                    <>
                      Continue
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
              </button>
            </form>
          )}

          {step === "password" && (
              <form className="space-y-6" onSubmit={onPasswordSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-4 py-3">
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{email}</span>
                    <button 
                      type="button" 
                      onClick={() => { setStep("email"); setPassword(""); setError(null); }} 
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-50 via-blue-50/50 to-violet-50/50 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-violet-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Welcome back{welcomeName ? `, ${welcomeName}` : ""}! 👋
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Enter your password to continue
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={e=>setPassword(e.target.value)} 
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</span>
                </div>
              </div>
                )}

                <button 
                  type="submit"
                  disabled={loading || !password} 
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] transform flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
          </div>

            {/* Google Sign In */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
          </button>

            {/* Footer Notes */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Only <span className="font-semibold text-indigo-600 dark:text-indigo-400">@rajagiri.edu.in</span> emails</span>
              </div>
              <p className="text-xs text-center text-gray-400 dark:text-gray-600">
                By signing in, you agree to our <span className="text-gray-600 dark:text-gray-500 hover:underline cursor-pointer">Terms</span> and <span className="text-gray-600 dark:text-gray-500 hover:underline cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


