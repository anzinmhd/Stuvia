"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [division, setDivision] = useState("");
  const [semester, setSemester] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status !== "authenticated") return;
    (async () => {
      setLoadingProfile(true);
      setError(null);
      try {
        const res = await fetch("/api/profile", { method: "GET" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setName(data?.name || "");
        setBranch(data?.branch || "");
        setDivision(data?.division || "");
        setSemester(data?.semester || "");
      } catch (e: any) {
        setError(e?.message || "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [status, router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    // Client-side validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!branch) {
      setError("Please select a branch");
      return;
    }
    if (!division) {
      setError("Please select a division");
      return;
    }
    if (!semester) {
      setError("Please select a semester");
      return;
    }
    
    setSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          branch, 
          division, 
          semester 
        }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to save profile");
      }
      
      setMessage("Profile updated successfully!");
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setError(e?.message || "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    // Client-side validation
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }
    
    setSavingPassword(true);
    try {
      const res = await fetch("/api/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to change password");
      }
      
      setMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setError(e?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 md:p-8">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.08),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl grid gap-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {(message || error) && (
          <div className={`relative rounded-2xl border-2 p-5 shadow-lg backdrop-blur-sm animate-in slide-in-from-top duration-300 ${
            message 
              ? "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700" 
              : "bg-red-50/90 dark:bg-red-950/30 border-red-300 dark:border-red-700"
          }`}>
            <div className="flex items-center gap-3">
              {message ? (
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span className={`font-semibold text-base ${
                message ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"
              }`}>
                {message || error}
              </span>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
          </div>
          
          <form className="grid gap-6" onSubmit={saveProfile}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name *
                </label>
                <input 
                  id="name" 
                  type="text"
                  value={name} 
                  onChange={e=>setName(e.target.value)} 
                  disabled={loadingProfile || savingProfile}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="branch" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Branch *
                </label>
                <select 
                  id="branch" 
                  value={branch} 
                  onChange={e=>setBranch(e.target.value)} 
                  disabled={loadingProfile || savingProfile}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="">Select your branch</option>
                  <option value="CSE">CSE - Computer Science Engineering</option>
                  <option value="ECE">ECE - Electronics & Communication</option>
                  <option value="EEE">EEE - Electrical & Electronics</option>
                  <option value="ME">ME - Mechanical Engineering</option>
                  <option value="CE">CE - Civil Engineering</option>
                  <option value="CU">CU - Computer Engineering</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label htmlFor="division" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Division *
                </label>
                <select 
                  id="division" 
                  value={division} 
                  onChange={e=>setDivision(e.target.value)} 
                  disabled={loadingProfile || savingProfile}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="">Select your division</option>
                  <option value="Alpha">Alpha</option>
                  <option value="Beta">Beta</option>
                  <option value="Gamma">Gamma</option>
                  <option value="Delta">Delta</option>
                  <option value="Nil">Nil</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="semester" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Semester *
                </label>
                <select 
                  id="semester" 
                  value={semester} 
                  onChange={e=>setSemester(e.target.value)} 
                  disabled={loadingProfile || savingProfile}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 disabled:opacity-50 transition-all duration-200 text-gray-900 dark:text-white"
                >
                  <option value="">Select your semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={savingProfile || loadingProfile} 
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-600 to-orange-600 hover:from-brand-700 hover:to-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
            >
              {savingProfile ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Changes...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Profile
                </span>
              )}
            </button>
          </form>
        </section>

        {/* Password Section */}
        <section className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Change Password</h2>
          </div>
          
          <form className="grid gap-6" onSubmit={changePassword}>
            <div className="grid gap-2">
              <label htmlFor="currentPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Current Password *
              </label>
              <input 
                id="currentPassword" 
                type="password" 
                value={currentPassword} 
                onChange={e=>setCurrentPassword(e.target.value)} 
                disabled={savingPassword}
                placeholder="Enter your current password"
                className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500" 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  New Password *
                </label>
                <input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword} 
                  onChange={e=>setNewPassword(e.target.value)} 
                  disabled={savingPassword}
                  placeholder="Enter new password (min 6 characters)"
                  minLength={6}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Confirm New Password *
                </label>
                <input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e=>setConfirmPassword(e.target.value)} 
                  disabled={savingPassword}
                  placeholder="Confirm your new password"
                  minLength={6}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 disabled:opacity-50 transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword} 
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
            >
              {savingPassword ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating Password...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Update Password
                </span>
              )}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
