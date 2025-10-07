// Firestore data models and shared types for Attendance feature

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface PeriodDef {
  // 0-based index across the day
  index: number;
  // Subject identifier (string code) shown in UI
  subjectId: string;
  // Optional human-friendly label
  label?: string;
}

// Class key and admin-defined template for a class
export interface ClassKey {
  branch: string;      // e.g., CSE, ECE
  division: string;    // e.g., Alpha, A, B
  semester: string;    // e.g., "1".."8"
}

export interface TimetableTemplate extends ClassKey {
  id: string;                 // `${branch}_${division}_${semester}` lowercased
  name?: string;              // optional friendly name
  periodsPerDay: number;      // e.g., 6
  subjects: Subject[];        // subject catalog for this class
  timetable: WeeklyTimetable; // weekly structure
  verifiedBy?: string;        // admin email who verified
  updatedAt: number;          // epoch ms
}

export interface DayTimetable {
  enabled: boolean; // If false, day is holiday by default (e.g., Sunday). For Saturday, user can enable.
  periods: PeriodDef[]; // Periods in order
}

export interface WeeklyTimetable {
  // Semester number or id, used to scope the timetable
  semesterId: string;
  // Number of periods per day (used by insights calc)
  periodsPerDay: number;
  // If true, timetable is fixed for the semester and not editable by student UI
  locked?: boolean;
  // Optional effective start and end dates for the semester
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  // Week mapping
  mon: DayTimetable;
  tue: DayTimetable;
  wed: DayTimetable;
  thu: DayTimetable;
  fri: DayTimetable;
  sat?: DayTimetable; // Optional Saturday timetable
  // Sundays are holidays by default (not stored unless you want custom exception)
}

export interface Holiday {
  date: string; // YYYY-MM-DD
  reason?: string;
  // If set, all periods strictly after this index are cancelled (e.g., early closure after 3rd period → 2 means keep 0,1,2)
  earlyCloseAfterPeriod?: number; // inclusive index to keep
  // If true, full holiday – overrides earlyCloseAfterPeriod
  isHoliday?: boolean;
}

export interface ClassChange {
  date: string; // YYYY-MM-DD
  // Overrides for specific periods on the date
  overrides?: Array<{
    periodIndex: number;
    subjectId?: string; // Interchanged subject for that period
    cancelled?: boolean; // Cancel this period only
  }>;
}

export type AttendanceStatus = "present" | "absent";

export interface AttendanceLog {
  uid: string;
  date: string; // YYYY-MM-DD
  periodIndex: number;
  subjectId: string; // effective subject for the period
  status: AttendanceStatus; // default present; students can mark absent
  markedAt: number; // epoch ms
}

export interface SubjectStat {
  subjectId: string;
  held: number; // total classes held
  present: number; // marked present
  percent: number; // present/held * 100
  safeBunksLeft: number; // based on min required attendance
}

export interface AttendanceInsights {
  bySubject: SubjectStat[];
  overallPercent: number;
  totalHeld: number;
  totalPresent: number;
}

// Subjects catalog for a semester (per user)
export interface Subject {
  id: string; // subject code/id, unique per user+semester (e.g., MATH101)
  name?: string; // optional display name
  color?: string; // optional hex color for calendar
}
