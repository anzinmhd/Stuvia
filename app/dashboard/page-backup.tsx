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

  // Determine if attendance setup exists for user's semester
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
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-900 p-6 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Rainbow gradient arc */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[900px] h-[450px] opacity-18">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-orange-500 to-yellow-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        {/* Primary floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-500/18 via-red-500/12 to-transparent rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-2xl animate-pulse delay-1000 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/10 via-indigo-500/6 to-transparent rounded-full blur-xl animate-pulse delay-500 opacity-50"></div>
        
        {/* Secondary floating elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-emerald-500/12 via-teal-500/8 to-transparent rounded-full blur-2xl animate-bounce opacity-40" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-tl from-orange-600/10 via-amber-500/6 to-transparent rounded-full blur-xl animate-pulse delay-2000 opacity-45"></div>
        <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-500/8 to-transparent rounded-full blur-lg animate-bounce opacity-30" style={{animationDuration: '5s'}}></div>
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 opacity-6" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)', backgroundSize: '60px 60px'}}></div>
      </div>
      
      <div className="mx-auto max-w-6xl grid gap-8 relative z-10">
        {/* Welcome header */}
        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold">Welcome, <span className="text-brand-600">{firstName(profile?.name || fallbackName)}</span></h1>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">Here’s a quick overview of your account.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/settings" className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition">Update profile</Link>
          </div>
        </section>

        {/* Enhanced Summary Cards */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { t: "Branch", v: profile?.branch || "CU", hint: "Your department", color: "orange", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
            { t: "Division", v: profile?.division || "Alpha", hint: "Your class division", color: "blue", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
            { t: "Semester", v: profile?.semester || "S1", hint: "Current semester", color: "purple", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
          ].map((c) => {
            const colorMap = {
              orange: { bg: "from-black/80 via-slate-900/70 to-orange-900/20", border: "border-orange-500/20 hover:border-orange-400/40", shadow: "hover:shadow-orange-500/20", icon: "from-orange-500 via-orange-600 to-red-600", iconGlow: "bg-orange-500/30", text: "from-orange-300 to-orange-400", value: "from-white to-orange-100", hint: "text-orange-200/60" },
              blue: { bg: "from-black/80 via-slate-900/70 to-blue-900/20", border: "border-blue-500/20 hover:border-blue-400/40", shadow: "hover:shadow-blue-500/20", icon: "from-blue-500 via-blue-600 to-indigo-600", iconGlow: "bg-blue-500/30", text: "from-blue-300 to-blue-400", value: "from-white to-blue-100", hint: "text-blue-200/60" },
              purple: { bg: "from-black/80 via-slate-900/70 to-purple-900/20", border: "border-purple-500/20 hover:border-purple-400/40", shadow: "hover:shadow-purple-500/20", icon: "from-purple-500 via-purple-600 to-indigo-600", iconGlow: "bg-purple-500/30", text: "from-purple-300 to-purple-400", value: "from-white to-purple-100", hint: "text-purple-200/60" }
            };
            const colorClasses = colorMap[c.color as keyof typeof colorMap];
            
            return (
              <div key={c.t} className={`group relative bg-gradient-to-br ${colorClasses.bg} rounded-2xl shadow-xl border ${colorClasses.border} p-5 backdrop-blur-md transition-all duration-500 ${colorClasses.shadow} hover:scale-[1.02] transform`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses.iconGlow.replace('bg-', 'from-')}/10 via-transparent ${colorClasses.iconGlow.replace('bg-', 'to-')}/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative">
                      <div className={`absolute inset-0 ${colorClasses.iconGlow} rounded-lg blur-sm group-hover:blur-md transition-all duration-300`}></div>
                      <div className={`relative w-7 h-7 bg-gradient-to-br ${colorClasses.icon} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                        </svg>
                      </div>
                    </div>
                    <div className={`text-xs font-bold bg-gradient-to-r ${colorClasses.text} bg-clip-text text-transparent uppercase tracking-wider`}>{c.t}</div>
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${colorClasses.value} bg-clip-text text-transparent mb-1`}>{c.v}</div>
                  <div className={`text-xs ${colorClasses.hint}`}>{c.hint}</div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Attendance setup hint */}
        {!hasTimetable && (
          <section className="card p-5 border border-amber-300/30 bg-amber-50/50 dark:bg-amber-500/10">
            <div className="text-sm text-amber-800 dark:text-amber-200">
              Attendance setup is not completed{userSem ? ` for Semester ${userSem}` : ''}. Please configure your subjects and 5-day, 6-period timetable.
            </div>
            <Link href="/dashboard/attendance/setup" className="mt-3 inline-block px-4 py-2 rounded-lg bg-brand-600 text-white">Complete Attendance Setup</Link>
          </section>
        )}

        {/* Quick navigation */}
        <section className="grid sm:grid-cols-2 gap-4">
          <Link href="/dashboard/attendance" className="card p-5 hover:ring-1 hover:ring-brand-400 transition">
            <div className="text-sm uppercase tracking-wide text-black/50 dark:text-white/50">Attendance</div>
            <div className="mt-1 text-xl font-semibold">Attendance Controls</div>
            <div className="mt-1 text-xs text-black/50 dark:text-white/50">Mark attendance and view insights</div>
          </Link>
          {isAdmin && (
            <Link href="/admin" className="card p-5 hover:ring-1 hover:ring-brand-400 transition">
              <div className="text-sm uppercase tracking-wide text-black/50 dark:text-white/50">Admin</div>
              <div className="mt-1 text-xl font-semibold">Admin controls</div>
              <div className="mt-1 text-xs text-black/50 dark:text-white/50">Manage templates, holidays, and class changes</div>
            </Link>
          )}
        </section>

        {/* Announcements */}
        <section className="card p-6">
          <h2 className="font-medium">Announcements</h2>
          <ul className="mt-3 space-y-2 text-sm text-black/70 dark:text-white/70">
            <li>• Welcome to Stuvia! Your profile helps personalize your experience.</li>
            <li>• You can change password anytime from Settings.</li>
          </ul>
        </section>

        {/* Placeholder analytics */}
        <section className="card p-6">
          <h2 className="font-medium">Overview</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-gradient-to-br from-brand-200 to-brand-400/60 h-32" />
            <div className="rounded-xl bg-gradient-to-br from-rose-200 to-rose-400/60 h-32" />
            <div className="rounded-xl bg-gradient-to-br from-emerald-200 to-emerald-400/60 h-32" />
          </div>
          <p className="mt-3 text-xs text-black/50 dark:text-white/50">Analytics coming soon.</p>
        </section>
      </div>
    </main>
  );
}

function firstName(full: string) {
  const s = String(full);
  const i = s.indexOf(" ");
  return i === -1 ? s : s.slice(0, i);
}
