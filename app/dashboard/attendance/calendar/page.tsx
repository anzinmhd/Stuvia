import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getByEmail } from "@/lib/userStoreFirebase";
import { getWeeklyTimetable } from "@/lib/attendance/db";
import AttendanceCalendarView from "./AttendanceCalendarView";

export default async function AttendanceCalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  const email = session.user?.email as string;
  const profile = email ? await getByEmail(email) : null;
  const semester = (profile?.semester as string | undefined) || "";

  if (!semester) {
    return redirect("/dashboard/attendance/setup");
  }

  const timetable = await getWeeklyTimetable(email, semester);
  
  if (!timetable) {
    return redirect("/dashboard/attendance/setup");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 md:p-8">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.08),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-[1600px]">
        <AttendanceCalendarView 
          userEmail={email}
          semester={semester}
          timetable={timetable}
        />
      </div>
    </main>
  );
}
