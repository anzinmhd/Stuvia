// Thin client helpers for attendance APIs
import { AttendanceInsights, ClassChange, Holiday, WeeklyTimetable } from "./types";

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || json?.ok === false) throw new Error(json?.message || `GET ${url} failed`);
  return (json.data ?? json) as T;
}

export async function apiPost<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.ok === false) throw new Error(json?.message || `POST ${url} failed`);
  return (json.data ?? json) as T;
}

// Timetable
export function getTimetable(semesterId: string) {
  return apiGet<{ ok: true; data: WeeklyTimetable | null }>(`/api/timetable/${semesterId}`);
}
export function saveTimetable(tt: WeeklyTimetable) {
  return apiPost(`/api/timetable/${tt.semesterId}`, tt);
}

// Holidays & Class changes (admin)
export function listHolidays(start?: string, end?: string) {
  const qs = new URLSearchParams();
  if (start) qs.set("start", start);
  if (end) qs.set("end", end);
  return apiGet<{ ok: true; data: Holiday[] }>(`/api/holidays?${qs.toString()}`);
}
export function setHoliday(day: Holiday) {
  return apiPost(`/api/holidays`, day);
}

export function listClassChanges(start?: string, end?: string) {
  const qs = new URLSearchParams();
  if (start) qs.set("start", start);
  if (end) qs.set("end", end);
  return apiGet<{ ok: true; data: ClassChange[] }>(`/api/class-changes?${qs.toString()}`);
}
export function setClassChange(change: ClassChange) {
  return apiPost(`/api/class-changes`, change);
}

// User specific overrides
export function getUserClassChange(date: string) {
  return apiGet<{ ok: true; data: ClassChange | null }>(`/api/user-class-changes?date=${date}`);
}
export function setUserClassChange(change: ClassChange) {
  return apiPost(`/api/user-class-changes`, change);
}

// Attendance
export function getEffectiveSubject(date: string, semesterId: string, periodIndex: number) {
  const qs = new URLSearchParams({ date, semesterId, periodIndex: String(periodIndex) });
  return apiGet<{ ok: true; data: { subjectId: string | null; cancelled: boolean } }>(`/api/attendance/effective-subject?${qs.toString()}`);
}
export function markAttendance(payload: { date: string; periodIndex: number; status: "present" | "absent"; subjectId?: string; semesterId: string }) {
  return apiPost(`/api/attendance/mark`, payload);
}
export function getInsights(semesterId: string, opts?: { start?: string; end?: string; min?: number }) {
  const qs = new URLSearchParams({ semesterId });
  if (opts?.start) qs.set("start", opts.start);
  if (opts?.end) qs.set("end", opts.end);
  if (opts?.min) qs.set("min", String(opts.min));
  return apiGet<{ ok: true; data: AttendanceInsights }>(`/api/attendance/insights?${qs.toString()}`);
}

// Subjects
export function getSubjects(semesterId: string) {
  return apiGet<{ ok: true; data: any[] }>(`/api/subjects/${semesterId}`);
}
export function saveSubjects(semesterId: string, items: Array<{ id: string; name?: string; color?: string }>) {
  return apiPost(`/api/subjects/${semesterId}`, items);
}
