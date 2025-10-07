"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SiteLogo } from "@/components/site-logo";

export default function LandingTopbar() {
  const { status } = useSession();

  // Hide this landing bar when user is authenticated (the global Header will show instead)
  if (status === "authenticated") return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
      <SiteLogo />
      <div className="flex gap-3">
        <Link href="/login" className="px-4 py-2 rounded-lg bg-black text-white hover:bg-brand-600 transition">Login</Link>
        <a href="#features" className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/20">Features</a>
      </div>
    </div>
  );
}
