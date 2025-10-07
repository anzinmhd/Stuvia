import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getByEmail } from "@/lib/userStoreFirebase";
import { getWeeklyTimetable } from "@/lib/attendance/db";
import Link from "next/link";

export default async function AttendanceControlsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  const email = session.user?.email as string;
  const profile = email ? await getByEmail(email) : null;
  const semester = (profile?.semester as string | undefined) || "";

  if (!semester) {
    // No semester set in profile, send to setup to collect details
    return redirect("/dashboard/attendance/setup");
  }

  const tt = await getWeeklyTimetable(email, semester);
  if (!tt) {
    // Hard redirect to setup if timetable not present
    return redirect("/dashboard/attendance/setup");
  }

  // Get basic attendance stats - count unique subjects across all days
  const allSubjects = new Set<string>();
  [tt.mon, tt.tue, tt.wed, tt.thu, tt.fri, tt.sat].forEach(day => {
    if (day?.enabled) {
      day.periods.forEach(period => allSubjects.add(period.subjectId));
    }
  });
  
  const attendanceStats = {
    totalSubjects: allSubjects.size,
    averageAttendance: 75, // This would be calculated from actual data
    totalClasses: 120,
    attendedClasses: 90
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-900 p-6 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        {/* Rainbow gradient arc inspired by Zenith */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-orange-500 to-yellow-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        {/* Primary floating orbs with enhanced colors */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-500/20 via-red-500/15 to-transparent rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-blue-600/18 via-cyan-500/12 to-transparent rounded-full blur-2xl animate-pulse delay-1000 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/12 via-indigo-500/8 to-transparent rounded-full blur-xl animate-pulse delay-500 opacity-50"></div>
        
        {/* Secondary floating elements with varied colors */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-2xl animate-bounce opacity-40" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-tl from-orange-600/12 via-amber-500/8 to-transparent rounded-full blur-xl animate-pulse delay-2000 opacity-45"></div>
        <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-lg animate-bounce opacity-30" style={{animationDuration: '5s'}}></div>
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 opacity-8" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '60px 60px'}}></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")'}}></div>
      </div>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Enhanced Header with floating animation */}
        <header className="flex items-center justify-between relative z-10 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-indigo-600/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 via-blue-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-2xl border border-indigo-500/30 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                  <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <div className="animate-slide-in-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-300">
                  Attendance Controls
                </h1>
                <p className="text-slate-300/90 mt-1 text-lg animate-fade-in animation-delay-500">
                  Manage your attendance and track academic progress
                </p>
              </div>
            </div>
          </div>
          <Link 
            href="/dashboard/attendance/setup" 
            className="group relative px-6 py-3 bg-gradient-to-r from-slate-800/60 to-indigo-900/40 rounded-2xl border border-slate-600/40 hover:border-indigo-400/60 transition-all duration-500 shadow-lg hover:shadow-indigo-500/20 backdrop-blur-sm hover:scale-105 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-3 text-slate-200 group-hover:text-indigo-300 transition-colors duration-300">
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Settings</span>
            </div>
          </Link>
        </header>

        {/* Compact Profile Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 relative z-10">
          <div className="group relative bg-gradient-to-br from-black/80 via-slate-900/70 to-cyan-900/20 rounded-2xl shadow-xl border border-cyan-500/20 p-4 backdrop-blur-md hover:border-cyan-400/40 transition-all duration-500 hover:shadow-cyan-500/20 hover:scale-[1.02] transform">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative w-6 h-6 bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xs font-bold bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent uppercase tracking-wider">Branch</h3>
              </div>
              <div className="text-lg font-bold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-0.5">{profile?.branch || 'CU'}</div>
              <p className="text-xs text-cyan-200/60">Your department</p>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-black/80 via-slate-900/70 to-violet-900/20 rounded-2xl shadow-xl border border-violet-500/20 p-4 backdrop-blur-md hover:border-violet-400/40 transition-all duration-500 hover:shadow-violet-500/20 hover:scale-[1.02] transform">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative w-6 h-6 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xs font-bold bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-transparent uppercase tracking-wider">Division</h3>
              </div>
              <div className="text-lg font-bold bg-gradient-to-r from-white to-violet-100 bg-clip-text text-transparent mb-0.5">{profile?.division || 'Alpha'}</div>
              <p className="text-xs text-violet-200/60">Your class division</p>
            </div>
          </div>
        </div>

        {/* Main Content Cards */}
        <div className="grid md:grid-cols-2 gap-8 h-auto relative z-10">
          {/* Attendance Insights */}
          <Link href="/dashboard/attendance/analytics" className="group h-full">
            <div className="bg-gradient-to-br from-black/90 via-gray-900/90 to-orange-900/40 rounded-3xl shadow-2xl border border-orange-500/30 p-8 hover:shadow-orange-500/20 transition-all duration-700 hover:border-orange-400/50 h-full flex flex-col backdrop-blur-sm hover:scale-[1.02] transform">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-black rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">Attendance Insights</h2>
                </div>
                <svg className="w-6 h-6 text-orange-400/60 group-hover:text-orange-300 group-hover:translate-x-2 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-orange-200/70 mb-6 text-base">
                Comprehensive analytics with charts, trends, and predictions
              </p>
              <div className="grid grid-cols-2 gap-6 mt-auto">
                <div className="text-center bg-gradient-to-br from-amber-500/10 to-black/30 rounded-2xl p-4 border border-amber-500/20">
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">{attendanceStats.averageAttendance}%</div>
                  <div className="text-sm text-amber-200/60 mt-1">Average</div>
                </div>
                <div className="text-center bg-gradient-to-br from-teal-500/10 to-black/30 rounded-2xl p-4 border border-teal-500/20">
                  <div className="text-3xl font-bold bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">{attendanceStats.totalSubjects}</div>
                  <div className="text-sm text-teal-200/60 mt-1">Subjects</div>
                </div>
              </div>
            </div>
          </Link>

          {/* Absence Marking */}
          <div className="bg-gradient-to-br from-black/90 via-gray-900/90 to-blue-900/40 rounded-3xl shadow-2xl border border-blue-500/30 p-8 h-full flex flex-col backdrop-blur-sm hover:border-blue-400/50 transition-all duration-700 hover:shadow-blue-500/20 hover:scale-[1.02] transform group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-600 to-black rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent">Absence Entry</h2>
            </div>
            <p className="text-blue-200/70 mb-6 text-base">
              Tools for marking and managing attendance absences
            </p>
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <Link href="/dashboard/attendance/calendar" className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-black/30 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-200 group-hover/item:text-blue-300 transition-colors duration-300">Calendar View</span>
                </div>
                <svg className="w-5 h-5 text-blue-400/60 group-hover/item:text-blue-300 group-hover/item:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/dashboard/attendance/absence-marker" className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-black/30 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-500 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-200 group-hover/item:text-blue-300 transition-colors duration-300">Bulk Marker</span>
                </div>
                <svg className="w-5 h-5 text-blue-400/60 group-hover/item:text-blue-300 group-hover/item:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Management Tools */}
        <div className="grid md:grid-cols-2 gap-8 relative z-10">
          {/* Data Management */}
          <div className="bg-gradient-to-br from-black/90 via-gray-900/90 to-purple-900/40 rounded-3xl shadow-2xl border border-purple-500/30 p-8 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-700 hover:shadow-purple-500/20 hover:scale-[1.02] transform group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-indigo-600 to-black rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-400 bg-clip-text text-transparent">Data Management</h2>
            </div>
            <p className="text-purple-200/70 mb-6 text-base">
              Manage your attendance data and system configuration
            </p>
            <div className="space-y-4">
              <Link href="/dashboard/attendance/setup" className="flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-black/30 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-indigo-600/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-purple-200 group-hover/item:text-purple-300 transition-colors duration-300">Manage Timetable</span>
                    <p className="text-sm text-purple-200/60">Configure subjects & schedule</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-purple-400/60 group-hover/item:text-purple-300 group-hover/item:translate-x-2 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/dashboard/attendance/setup" className="flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-black/30 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-indigo-600/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-purple-200 group-hover/item:text-purple-300 transition-colors duration-300">Import Data</span>
                    <p className="text-sm text-purple-200/60">Import attendance from files</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-purple-400/60 group-hover/item:text-purple-300 group-hover/item:translate-x-2 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-gradient-to-br from-black/90 via-gray-900/90 to-emerald-900/40 rounded-3xl shadow-2xl border border-emerald-500/30 p-8 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-700 hover:shadow-emerald-500/20 hover:scale-[1.02] transform group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-black rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent">Reports & Analytics</h2>
            </div>
            <p className="text-emerald-200/70 mb-6 text-base">
              Detailed insights and comprehensive reporting tools
            </p>
            <div className="space-y-4">
              <Link href="/dashboard/attendance/analytics" className="flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-black/30 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-500 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-600/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-200 group-hover/item:text-emerald-300 transition-colors duration-300">Detailed Analytics</span>
                    <p className="text-sm text-emerald-200/60">Charts, trends & predictions</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-emerald-400/60 group-hover/item:text-emerald-300 group-hover/item:translate-x-2 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/dashboard/attendance/calendar" className="flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-black/30 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-500 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-teal-600/30 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-200 group-hover/item:text-emerald-300 transition-colors duration-300">Calendar Reports</span>
                    <p className="text-sm text-emerald-200/60">Daily & monthly views</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-emerald-400/60 group-hover/item:text-emerald-300 group-hover/item:translate-x-2 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
