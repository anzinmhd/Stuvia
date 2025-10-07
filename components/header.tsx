"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { SiteLogo } from "@/components/site-logo";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");
  const isHome = pathname === "/";

  // On the landing page, hide header for unauthenticated users
  if (status !== "authenticated" && (isHome || isAuthPage)) return null;

  return (
    <header className="w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <SiteLogo />
        </Link>
        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <>
              <Link href="/onboarding" className="hidden" aria-hidden="true">Onboarding</Link>
              <Link href="/" className="hidden" aria-hidden="true">Home</Link>
              {(session as any)?.user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="group relative px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-950/30 dark:hover:to-blue-950/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 shadow-sm hover:shadow-md"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Admin
                  </span>
                </Link>
              )}
              <Link 
                href="/settings" 
                className="group relative px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 shadow-sm hover:shadow-md"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group relative px-5 py-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 hover:from-brand-600 hover:to-orange-600 dark:hover:from-brand-500 dark:hover:to-orange-500 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </span>
              </button>
            </>
          ) : (
            !isAuthPage && (
              <Link 
                href="/login" 
                className="group relative px-5 py-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 hover:from-brand-600 hover:to-orange-600 dark:hover:from-brand-500 dark:hover:to-orange-500 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </span>
              </Link>
            )
          )}
        </div>
      </div>
      {/* ProfileStatusBanner removed per request */}
    </header>
  );
}

function ProfileStatusBanner() {
  const { data: session } = useSession();
  const hasOnboardedCookie = typeof document !== 'undefined' && document.cookie.includes('onboarded=1');
  const router = useRouter();
  const profileCompleted = Boolean((session as any)?.user?.profileCompleted);
  const hasPasswordProvider = Boolean((session as any)?.user?.hasPasswordProvider);

  if (hasOnboardedCookie || (profileCompleted && hasPasswordProvider)) return null;

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-900/20 border-t border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
      <div className="mx-auto max-w-6xl px-6 py-2 text-sm flex items-center justify-between gap-3">
        <div>
          {!hasPasswordProvider && <span className="font-medium">Set a password</span>}
          {(!hasPasswordProvider && !profileCompleted) && <span> • </span>}
          {!profileCompleted && <span className="font-medium">Complete your profile</span>}
        </div>
        <button onClick={() => router.push("/onboarding")} className="underline">Continue setup</button>
      </div>
    </div>
  );
}
