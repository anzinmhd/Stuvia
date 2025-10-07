'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
}

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

interface Props {
  userEmail: string;
  semester: string;
  profile: any;
}

export default function BulkAbsenceMarker({ userEmail, semester, profile }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [timetable, setTimetable] = useState<WeeklyTimetable | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Date selection
  const [dateMode, setDateMode] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState(new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Period selection - defaults to empty (6 periods total)
  const [periodMode, setPeriodMode] = useState<'all' | 'specific'>('specific');
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  
  const [results, setResults] = useState<{ success: number; failed: number; details: string[] }>({
    success: 0,
    failed: 0,
    details: []
  });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load subjects
      const subjectsRes = await fetch(`/api/subjects/${semester}`);
      const subjectsData = await subjectsRes.json();
      setSubjects(subjectsData.subjects || []);

      // Load timetable
      const timetableRes = await fetch(`/api/timetable/${semester}`);
      const timetableData = await timetableRes.json();
      setTimetable(timetableData.timetable || null);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDatesInRange = () => {
    if (dateMode === 'single') {
      return [singleDate];
    }
    
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

  const togglePeriod = (period: number) => {
    setSelectedPeriods(prev =>
      prev.includes(period)
        ? prev.filter(p => p !== period)
        : [...prev, period].sort()
    );
  };

  const markAttendance = async (subjectId: string, status: 'absent', period: number, date: string) => {
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semester,
          subjectId,
          status,
          period,
          date,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      return false;
    }
  };

  const processBulkAbsence = async () => {
    if (!timetable) {
      alert('Timetable not loaded');
      return;
    }

    const periods = periodMode === 'all' ? [1, 2, 3, 4, 5, 6] : selectedPeriods;

    if (periods.length === 0) {
      alert('Please select at least one period');
      return;
    }

    setProcessing(true);
    setShowResults(false);

    try {
      const dates = getDatesInRange();
      const details = [];
      let successCount = 0;
      let failedCount = 0;

      for (const date of dates) {
        const dayName = getDayName(date);
        const daySchedule = timetable[dayName] || [];

        for (const period of periods) {
          const slot = daySchedule[period - 1];
          
          if (slot && slot.subjectId) {
            const success = await markAttendance(slot.subjectId, 'absent', period, date);
            if (success) {
              successCount++;
              details.push(`✅ ${slot.subjectName} - Period ${period} on ${new Date(date).toLocaleDateString()}: Marked absent`);
            } else {
              failedCount++;
              details.push(`❌ ${slot.subjectName} - Period ${period} on ${new Date(date).toLocaleDateString()}: Failed`);
            }
          } else {
            details.push(`ℹ️ No class scheduled - Period ${period} on ${new Date(date).toLocaleDateString()}: Skipped`);
          }
        }
      }

      setResults({ success: successCount, failed: failedCount, details });
      setShowResults(true);
      
      if (successCount > 0) {
        setSelectedPeriods([]);
      }
      
    } catch (error) {
      console.error('Failed to process bulk absence:', error);
      setResults({
        success: 0,
        failed: 1,
        details: ['❌ An error occurred while processing the data']
      });
      setShowResults(true);
    } finally {
      setProcessing(false);
    }
  };

  // Calculate preview of what will be marked
  const getAbsencePreview = () => {
    if (!timetable) return { subjects: [], total: 0 };

    const dates = getDatesInRange();
    const periods = periodMode === 'all' ? [1, 2, 3, 4, 5, 6] : selectedPeriods;
    const subjectMap = new Map<string, { name: string; count: number }>();

    for (const date of dates) {
      const dayName = getDayName(date);
      const daySchedule = timetable[dayName] || [];

      for (const period of periods) {
        const slot = daySchedule[period - 1];
        if (slot && slot.subjectId) {
          const existing = subjectMap.get(slot.subjectId);
          if (existing) {
            existing.count++;
          } else {
            subjectMap.set(slot.subjectId, { name: slot.subjectName, count: 1 });
          }
        }
      }
    }

    return {
      subjects: Array.from(subjectMap.values()),
      total: Array.from(subjectMap.values()).reduce((sum, s) => sum + s.count, 0)
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your timetable...</p>
        </div>
      </div>
    );
  }

  const dates = getDatesInRange();
  const periods = periodMode === 'all' ? [1, 2, 3, 4, 5, 6, 7, 8] : selectedPeriods;
  const preview = getAbsencePreview();

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Bulk Absence Marker
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Select dates and periods - subjects will be marked based on your timetable
            </p>
          </div>
        </div>
        <Link 
          href="/dashboard/attendance" 
          className="group inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 transform"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            Back to Controls
          </span>
        </Link>
      </header>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-start gap-4">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg mb-2">How This Works</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Simply select the dates when you were absent and the periods you missed. The system will automatically mark absences for the subjects scheduled in those periods according to your timetable. No need to manually select subjects!
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Date Selection */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/20 p-6 border-b border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Step 1: Select Date(s)</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Choose when you were absent
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Mode Selector */}
          <div className="flex gap-3">
            <button
              onClick={() => setDateMode('single')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                dateMode === 'single'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Single Date
            </button>
            <button
              onClick={() => setDateMode('range')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                dateMode === 'range'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Date Range
            </button>
          </div>

          {/* Date Inputs */}
          {dateMode === 'single' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Selected Dates Preview */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">
                {dates.length === 1 ? '1 day' : `${dates.length} days`} selected
              </span>
              {dates.length > 1 && dates.length <= 7 && (
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  ({dates.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ')})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Period Selection */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-cyan-50/50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/20 p-6 border-b border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Step 2: Select Period(s)</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Choose which periods you were absent
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Period Mode Selector */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPeriodMode('all');
                setSelectedPeriods([1, 2, 3, 4, 5, 6]);
              }}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                periodMode === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Entire Day (All 6 Periods)
            </button>
            <button
              onClick={() => setPeriodMode('specific')}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                periodMode === 'specific'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Specific Periods
            </button>
          </div>

          {/* Period Selection */}
          {periodMode === 'specific' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select Periods
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPeriods([1, 2, 3, 4, 5, 6])}
                    className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-gray-400">•</span>
                  <button
                    onClick={() => setSelectedPeriods([])}
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((period) => (
                  <button
                    key={period}
                    onClick={() => togglePeriod(period)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      selectedPeriods.includes(period)
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Period Preview */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">
                {periods.length === 0 
                  ? 'No periods selected'
                  : periodMode === 'all' 
                    ? 'All 6 periods selected' 
                    : `${periods.length} ${periods.length === 1 ? 'period' : 'periods'} selected: ${periods.join(', ')}`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview: What will be marked */}
      {preview.total > 0 && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 via-pink-50/50 to-rose-50/50 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-rose-950/20 p-6 border-b border-purple-100 dark:border-purple-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preview: Based on Your Timetable</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  These subjects will be marked absent
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {preview.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{subject.name}</div>
                      <div className="text-xs opacity-90">{subject.count} {subject.count === 1 ? 'class' : 'classes'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Summary and Action */}
      <div className="bg-gradient-to-br from-orange-50 via-rose-50/50 to-pink-50/50 dark:from-orange-950/30 dark:via-rose-950/20 dark:to-pink-950/20 rounded-3xl border-2 border-orange-200 dark:border-orange-800 p-8 shadow-2xl">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Summary</h3>
            <p className="text-gray-600 dark:text-gray-400">You are about to mark:</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{dates.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{dates.length === 1 ? 'Day' : 'Days'}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{periods.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{periods.length === 1 ? 'Period' : 'Periods'}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{preview.subjects.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{preview.subjects.length === 1 ? 'Subject' : 'Subjects'}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
              {preview.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total absence marks to be recorded</div>
          </div>

          <button
            onClick={processBulkAbsence}
            disabled={preview.total === 0 || processing}
            className="group relative px-10 py-5 bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 hover:from-rose-700 hover:via-pink-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <div className="relative flex items-center gap-3">
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                  <span>Processing {preview.total} marks...</span>
                </>
              ) : (
                <>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark {preview.total} Absence{preview.total !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </button>

          {preview.total === 0 && periods.length > 0 && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              ℹ️ No classes scheduled in the selected periods. Try selecting different periods or dates.
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-cyan-50/50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/20 p-6 border-b border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Processing Complete</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Here are the results of your bulk operation</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800">
                <div className="text-6xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">{results.success}</div>
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Successfully Marked</div>
              </div>
              <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800">
                <div className="text-6xl font-bold text-red-600 dark:text-red-400 mb-3">{results.failed}</div>
                <div className="text-sm font-semibold text-red-700 dark:text-red-300">Failed</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Detailed Results</h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  {results.details.map((detail, index) => (
                    <div key={index} className={`flex items-start gap-2 text-xs p-2 rounded-lg ${
                      detail.startsWith('✅') 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-100'
                        : detail.startsWith('ℹ️')
                        ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100'
                        : 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100'
                    }`}>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => setShowResults(false)}
                className="px-8 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200 shadow-md"
              >
                Close Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
