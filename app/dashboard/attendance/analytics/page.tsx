import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AttendanceAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  return (
    <main className="min-h-screen bg-black p-6 relative overflow-hidden">
      {/* Solar Space Background Effects */}
      <div className="absolute inset-0">
        {/* Deep space nebula */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/30 to-pink-900/20"></div>
        
        {/* Twinkling stars layer 1 */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Twinkling stars layer 2 - larger stars */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={`bigstar-${i}`}
              className="absolute w-2 h-2 bg-blue-200 rounded-full animate-pulse opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Solar flares and cosmic orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/10 via-yellow-500/15 to-red-500/10 rounded-full blur-3xl animate-pulse opacity-40" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/8 via-indigo-500/12 to-purple-500/8 rounded-full blur-2xl animate-pulse opacity-50" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/6 w-64 h-64 bg-gradient-to-r from-pink-500/6 via-purple-500/10 to-indigo-500/6 rounded-full blur-xl animate-pulse opacity-30" style={{animationDuration: '10s', animationDelay: '4s'}}></div>
        
        {/* Cosmic dust and particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={`dust-${i}`}
              className="absolute w-0.5 h-0.5 bg-purple-300/40 rounded-full animate-bounce opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>
        
        {/* Shooting stars */}
        <div className="absolute top-1/4 left-0 w-2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-ping opacity-60" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-0 w-2 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent animate-ping opacity-40" style={{animationDuration: '4s', animationDelay: '3s'}}></div>
      </div>
      
      <div className="mx-auto max-w-6xl space-y-10 relative z-10">
        {/* Enhanced Header */}
        <header className="flex items-center justify-between animate-fade-in">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-600/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border border-emerald-500/30 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                  <svg className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-300">
                  Attendance Analytics
                </h1>
                <p className="text-slate-300/90 mt-2 text-lg">
                  Comprehensive insights and reports for your attendance performance
                </p>
              </div>
            </div>
          </div>
          <Link 
            href="/dashboard/attendance" 
            className="group relative px-6 py-3 bg-gradient-to-r from-slate-800/60 to-emerald-900/40 rounded-2xl border border-slate-600/40 hover:border-emerald-400/60 transition-all duration-500 shadow-lg hover:shadow-emerald-500/20 backdrop-blur-sm hover:scale-105 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center gap-3 text-slate-200 group-hover:text-emerald-300 transition-colors duration-300">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Controls</span>
            </div>
          </Link>
        </header>

        {/* Enhanced Coming Soon Card */}
        <div className="bg-gradient-to-br from-black/90 via-slate-900/90 to-emerald-900/20 rounded-3xl shadow-2xl border border-emerald-500/30 p-12 text-center backdrop-blur-md hover:border-emerald-400/50 transition-all duration-700 hover:shadow-emerald-500/20 hover:scale-[1.01] transform group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
              <svg className="w-12 h-12 text-emerald-400 group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent mb-6">Advanced Analytics Coming Soon</h2>
          <p className="text-slate-300/80 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            We're developing comprehensive analytics features including attendance trends, subject-wise performance charts, 
            predictive insights, and detailed reports to help you optimize your academic attendance.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-2xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300"></div>
              <span className="text-emerald-200 font-medium">Trend Analysis</span>
            </div>
            <div className="group flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-2xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300" style={{animationDelay: '0.5s'}}></div>
              <span className="text-blue-200 font-medium">Performance Charts</span>
            </div>
            <div className="group flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse group-hover:scale-125 transition-transform duration-300" style={{animationDelay: '1s'}}></div>
              <span className="text-purple-200 font-medium">Predictive Insights</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
