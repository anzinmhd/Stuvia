'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  subjectId: string;
  status: 'present' | 'absent' | 'late';
  period: number;
  notes?: string;
}

interface Props {
  userEmail: string;
  semester: string;
  timetable: any;
  profile: any;
}

export default function AttendanceTracker({ userEmail, semester, timetable, profile }: Props) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showBulkAbsence, setShowBulkAbsence] = useState(false);
  const [bulkAbsenceData, setBulkAbsenceData] = useState('');
  const [bulkAbsenceDate, setBulkAbsenceDate] = useState(new Date().toISOString().split('T')[0]);

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

  const markAttendance = async (subjectId: string, status: 'present' | 'absent' | 'late', period: number, date: string = selectedDate) => {
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

      if (response.ok) {
        await loadData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error);
    }
  };

  const processBulkAbsence = async () => {
    if (!bulkAbsenceData.trim()) return;

    try {
      const lines = bulkAbsenceData.trim().split('\n');
      const absenceRecords = [];

      for (const line of lines) {
        // Parse different formats that might be copied from college management system
        // Format 1: "Subject Name - Period X"
        // Format 2: "Period X: Subject Name"
        // Format 3: "X. Subject Name"
        
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        let subjectName = '';
        let period = 1;

        // Try to extract subject and period information
        if (trimmedLine.includes(' - Period ')) {
          const parts = trimmedLine.split(' - Period ');
          subjectName = parts[0].trim();
          period = parseInt(parts[1]) || 1;
        } else if (trimmedLine.includes('Period ') && trimmedLine.includes(':')) {
          const parts = trimmedLine.split(':');
          const periodPart = parts[0].trim();
          subjectName = parts[1].trim();
          period = parseInt(periodPart.replace('Period', '').trim()) || 1;
        } else if (/^\d+\./.test(trimmedLine)) {
          const match = trimmedLine.match(/^(\d+)\.\s*(.+)$/);
          if (match) {
            period = parseInt(match[1]) || 1;
            subjectName = match[2].trim();
          }
        } else {
          // Just subject name, assume period 1
          subjectName = trimmedLine;
          period = 1;
        }

        // Find matching subject
        const subject = subjects.find(s => 
          s.name.toLowerCase().includes(subjectName.toLowerCase()) ||
          subjectName.toLowerCase().includes(s.name.toLowerCase())
        );

        if (subject) {
          absenceRecords.push({
            subjectId: subject.id,
            period,
            date: bulkAbsenceDate,
            status: 'absent' as const,
          });
        }
      }

      // Mark all absences
      for (const record of absenceRecords) {
        await markAttendance(record.subjectId, record.status, record.period, record.date);
      }

      // Clear form and close modal
      setBulkAbsenceData('');
      setShowBulkAbsence(false);
      
    } catch (error) {
      console.error('Failed to process bulk absence:', error);
    }
  };

  const getTodayAttendance = () => {
    return attendance.filter(record => record.date === selectedDate);
  };

  const getSubjectStats = (subjectId: string) => {
    const subjectRecords = attendance.filter(record => record.subjectId === subjectId);
    const present = subjectRecords.filter(record => record.status === 'present').length;
    const total = subjectRecords.length;
    const percentage = total > 0 ? (present / total) * 100 : 0;
    return { present, total, percentage };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Attendance Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Semester {semester} • {profile?.branch} {profile?.division}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkAbsence(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Bulk Mark Absence
            </div>
          </button>
          <Link 
            href="/dashboard/attendance/setup" 
            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </div>
          </Link>
        </div>
      </header>

      {/* Date Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Date:</label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Subject Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject.id);
          const todayRecord = getTodayAttendance().find(r => r.subjectId === subject.id);
          
          return (
            <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.present}/{stats.total} classes attended
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stats.percentage >= 75 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  stats.percentage >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {stats.percentage.toFixed(1)}%
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stats.percentage >= 75 ? 'bg-green-500' :
                      stats.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => markAttendance(subject.id, 'present', 1)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      todayRecord?.status === 'present'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => markAttendance(subject.id, 'absent', 1)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      todayRecord?.status === 'absent'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                    }`}
                  >
                    Absent
                  </button>
                  <button
                    onClick={() => markAttendance(subject.id, 'late', 1)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      todayRecord?.status === 'late'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                    }`}
                  >
                    Late
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Absence Modal */}
      {showBulkAbsence && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bulk Mark Absence</h2>
                </div>
                <button
                  onClick={() => setShowBulkAbsence(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">How to use:</h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Copy and paste absence data from your college management system. Supported formats:
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                      <li>• "Mathematics - Period 2"</li>
                      <li>• "Period 3: Physics"</li>
                      <li>• "1. Computer Science"</li>
                      <li>• "Chemistry" (assumes Period 1)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Absence Date
                  </label>
                  <input
                    type="date"
                    value={bulkAbsenceDate}
                    onChange={(e) => setBulkAbsenceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Paste Absence Data
                  </label>
                  <textarea
                    value={bulkAbsenceData}
                    onChange={(e) => setBulkAbsenceData(e.target.value)}
                    placeholder="Paste your absence data here...&#10;Example:&#10;Mathematics - Period 2&#10;Period 3: Physics&#10;1. Computer Science"
                    rows={8}
                    className="w-full px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500 resize-none font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={processBulkAbsence}
                  disabled={!bulkAbsenceData.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark All Absences
                  </div>
                </button>
                <button
                  onClick={() => setShowBulkAbsence(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
