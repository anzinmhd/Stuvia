'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimetableSlot {
  subjectId: string;
  subjectName: string;
}

interface WeeklyTimetable {
  sunday?: TimetableSlot[];
  monday: TimetableSlot[];
  tuesday: TimetableSlot[];
  wednesday: TimetableSlot[];
  thursday: TimetableSlot[];
  friday: TimetableSlot[];
  saturday: TimetableSlot[];
}

interface AttendanceRecord {
  id: string;
  date: string;
  subjectId: string;
  subjectName?: string;
  period: number;
  status: 'present' | 'absent' | 'late';
}

interface Subject {
  id: string;
  name: string;
  code?: string;
}

interface Props {
  userEmail: string;
  semester: string;
  timetable: WeeklyTimetable;
}

export default function AttendanceCalendarView({ userEmail, semester, timetable }: Props) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Set default date range (last 30 days to today)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadData();
    }
  }, [startDate, endDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load subjects
      const subjectsRes = await fetch(`/api/subjects/${semester}`);
      const subjectsData = await subjectsRes.json();
      setSubjects(subjectsData.subjects || []);

      // Load attendance records
      const attendanceRes = await fetch(`/api/attendance/records?semester=${semester}`);
      const attendanceData = await attendanceRes.json();
      setAttendance(attendanceData.records || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDatesInRange = () => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const getDayName = (dateStr: string): keyof WeeklyTimetable => {
    const days: (keyof WeeklyTimetable)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const date = new Date(dateStr + 'T00:00:00');
    const dayIndex = date.getDay();
    return days[dayIndex] as keyof WeeklyTimetable;
  };

  const getAttendanceForDatePeriod = (date: string, period: number) => {
    return attendance.find(
      (a) => a.date === date && a.period === period
    );
  };

  const getSubjectCode = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.code || subject?.name?.split(' ').map(w => w[0]).join('').toUpperCase() || subjectId.slice(-6);
  };

  const getCellStyle = (date: string, period: number) => {
    const dayName = getDayName(date);
    const daySchedule = timetable[dayName] || [];
    const slot = daySchedule[period - 1];
    
    // No class scheduled
    if (!slot || !slot.subjectId) {
      return {
        bg: 'bg-gray-200 dark:bg-gray-700',
        text: '',
        label: ''
      };
    }

    const attendanceRecord = getAttendanceForDatePeriod(date, period);
    
    // Not marked yet (scheduled but no attendance record)
    if (!attendanceRecord) {
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600',
        text: 'text-yellow-900 dark:text-yellow-100',
        label: getSubjectCode(slot.subjectId)
      };
    }

    // Marked present
    if (attendanceRecord.status === 'present') {
      return {
        bg: 'bg-emerald-600 dark:bg-emerald-700',
        text: 'text-white',
        label: getSubjectCode(slot.subjectId)
      };
    }

    // Marked absent
    if (attendanceRecord.status === 'absent') {
      return {
        bg: 'bg-red-700 dark:bg-red-800',
        text: 'text-white font-semibold',
        label: getSubjectCode(slot.subjectId)
      };
    }

    // Marked late
    return {
      bg: 'bg-orange-500 dark:bg-orange-600',
      text: 'text-white',
      label: getSubjectCode(slot.subjectId)
    };
  };

  const getStats = () => {
    const dates = getDatesInRange();
    let totalClasses = 0;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let unmarkedCount = 0;

    for (const date of dates) {
      const dayName = getDayName(date);
      const daySchedule = timetable[dayName] || [];
      
      for (let period = 1; period <= 6; period++) {
        const slot = daySchedule[period - 1];
        if (slot && slot.subjectId) {
          totalClasses++;
          const record = getAttendanceForDatePeriod(date, period);
          
          if (!record) {
            unmarkedCount++;
          } else if (record.status === 'present') {
            presentCount++;
          } else if (record.status === 'absent') {
            absentCount++;
          } else if (record.status === 'late') {
            lateCount++;
          }
        }
      }
    }

    return { totalClasses, presentCount, absentCount, lateCount, unmarkedCount };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading attendance calendar...</p>
        </div>
      </div>
    );
  }

  const dates = getDatesInRange();
  const stats = getStats();
  const attendancePercentage = stats.totalClasses > 0 
    ? ((stats.presentCount + stats.lateCount) / stats.totalClasses * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Attendance Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Visual overview of your attendance records
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/attendance" 
          className="group inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 transform"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Back to Controls
          </span>
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.totalClasses}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Classes</div>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{stats.presentCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Present</div>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">{stats.absentCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Absent</div>
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{stats.lateCount}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Late</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl shadow-lg border-2 border-purple-200 dark:border-purple-800 p-6">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{attendancePercentage}%</div>
          <div className="text-sm text-purple-700 dark:text-purple-300 font-semibold">Attendance</div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-emerald-600 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-red-700 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Not Marked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">No Class</span>
          </div>
        </div>
      </div>

      {/* Calendar Table */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                <th className="px-4 py-4 text-left text-sm font-bold text-white border-r border-white/20 min-w-[140px] sticky left-0 bg-blue-600 z-10">
                  Date/Hours
                </th>
                {[1, 2, 3, 4, 5, 6].map((period) => (
                  <th key={period} className="px-4 py-4 text-center text-sm font-bold text-white border-r border-white/20 min-w-[100px]">
                    {period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((date, dateIndex) => {
                const dayName = getDayName(date);
                const dateObj = new Date(date + 'T00:00:00');
                const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <tr key={date} className={dateIndex % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800/50'}>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-700 dark:text-blue-400 border-r border-gray-300 dark:border-gray-600 sticky left-0 z-10" style={{backgroundColor: dateIndex % 2 === 0 ? 'rgb(249 250 251)' : 'white'}}>
                      <div>{dateObj.toLocaleDateString('en-GB')}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{dayOfWeek}</div>
                    </td>
                    {[1, 2, 3, 4, 5, 6].map((period) => {
                      const style = getCellStyle(date, period);
                      return (
                        <td
                          key={period}
                          className={`px-2 py-3 text-center text-xs border-r border-gray-300 dark:border-gray-600 ${style.bg} ${style.text}`}
                        >
                          {style.label}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {stats.unmarkedCount > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                {stats.unmarkedCount} classes not marked yet
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You have {stats.unmarkedCount} scheduled {stats.unmarkedCount === 1 ? 'class' : 'classes'} without attendance records. Consider marking them to keep your records up to date.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

