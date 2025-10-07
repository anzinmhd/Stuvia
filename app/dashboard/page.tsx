import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getByEmail } from "@/lib/userStoreFirebase";
import { getWeeklyTimetable } from "@/lib/attendance/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  const fallbackName = session.user?.name || session.user?.email || "User";

  let profile: any = null;
  try {
    if (session.user?.email) {
      profile = await getByEmail(session.user.email as string);
    }
  } catch {}

  const userSem = (profile?.semester as string | undefined) || undefined;
  let hasTimetable = false;
  try {
    if (userSem) {
      const tt = await getWeeklyTimetable(session.user!.email as string, userSem);
      hasTimetable = !!tt;
    }
  } catch {}

  const isAdmin = (session as any).user?.role === 'admin';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-8">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      </div>
      
      <div className="mx-auto max-w-7xl relative z-10 space-y-8">
        {/* Header Section */}
        <header className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Welcome back, <span className="text-brand-600 dark:text-brand-500">{firstName(profile?.name || fallbackName)}</span>
                </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your attendance today
              </p>
            </div>
            <Link 
              href="/settings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-lg transition-all duration-200 group"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-500 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              <span className="font-medium">Settings</span>
            </Link>
          </div>
        </header>

        {/* Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              label: "Branch", 
              value: profile?.branch || "Not Set", 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              ),
              gradient: "from-blue-500 to-cyan-500",
              bgLight: "bg-blue-50 dark:bg-blue-950/30"
            },
            { 
              label: "Division", 
              value: profile?.division || "Not Set", 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              gradient: "from-purple-500 to-pink-500",
              bgLight: "bg-purple-50 dark:bg-purple-950/30"
            },
            { 
              label: "Semester", 
              value: profile?.semester || "Not Set", 
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
              ),
              gradient: "from-orange-500 to-red-500",
              bgLight: "bg-orange-50 dark:bg-orange-950/30"
            }
          ].map((item) => (
            <div key={item.label} className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                      </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Setup Alert */}
        {!hasTimetable && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Complete Your Attendance Setup
                </h3>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  {userSem ? `Set up your timetable for Semester ${userSem}` : 'Configure your subjects and timetable'} to start tracking attendance.
                </p>
                <Link 
                  href="/dashboard/attendance/setup"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 hover:shadow-lg transition-all duration-200"
                >
                  <span>Complete Setup</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Card */}
          <Link 
            href="/dashboard/attendance"
            className="group relative bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 rounded-2xl p-8 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Attendance Tracker
              </h2>
              <p className="text-blue-100">
                Mark your attendance and view detailed insights
              </p>
              <div className="mt-6 flex items-center text-white font-medium">
                <span>Go to Attendance</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Admin Card */}
          {isAdmin && (
            <Link 
              href="/admin"
              className="group relative bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 rounded-2xl p-8 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Admin Panel
                </h2>
                <p className="text-purple-100">
                  Manage templates, holidays, and configurations
                </p>
                <div className="mt-6 flex items-center text-white font-medium">
                  <span>Manage System</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Quick Info Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick Updates
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-2 h-2 bg-brand-500 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium">
                  Welcome to Stuvia!
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Your profile helps personalize your academic experience.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-gray-900 dark:text-white font-medium">
                  Update Anytime
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  You can update your credentials anytime from Settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function firstName(full: string) {
  const s = String(full);
  const i = s.indexOf(" ");
  return i === -1 ? s : s.slice(0, i);
}
