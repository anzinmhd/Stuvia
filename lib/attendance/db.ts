import { db } from "@/lib/firebase/admin";
import { AttendanceLog, AttendanceStatus, ClassChange, Holiday, WeeklyTimetable, Subject, TimetableTemplate, ClassKey } from "./types";
import { differenceInCalendarDays, eachDayOfInterval, isAfter, isBefore, parseISO } from "date-fns";

// Collections
const COLL = {
  timetables: "timetables", // doc id: `${uid}_${semesterId}`
  holidays: "holidays", // doc id: `${date}` (YYYY-MM-DD) or auto-id with date field
  classChanges: "classChanges", // doc id: `${date}` or auto-id with date field
  attendance: "attendance", // doc id: auto; fields: uid,date,periodIndex,subjectId,status
  userClassChanges: "userClassChanges", // doc id: `${uid}_${date}` containing overrides for a single student
  subjects: "subjects", // doc id: `${uid}_${semesterId}` => { uid, semesterId, items: Subject[] }
  templates: "ttTemplates", // doc id: `${branch}_${division}_${semester}` lowercased
};

function timetableId(uid: string, semesterId: string) {
  return `${uid}_${semesterId}`;
}

function subjectId(uid: string, semesterId: string) {
  return `${uid}_${semesterId}`;
}

export async function upsertWeeklyTimetable(uid: string, data: WeeklyTimetable) {
  if (!uid || !data?.semesterId) throw new Error("uid and semesterId required");
  const id = timetableId(uid, data.semesterId);
  await db.collection(COLL.timetables).doc(id).set({ uid, ...data }, { merge: true });
  return { id };
}

export async function getWeeklyTimetable(uid: string, semesterId: string) {
  const id = timetableId(uid, semesterId);
  const snap = await db.collection(COLL.timetables).doc(id).get();
  return snap.exists ? (snap.data() as WeeklyTimetable & { uid: string }) : null;
}

export async function deleteWeeklyTimetable(uid: string, semesterId: string) {
  const id = timetableId(uid, semesterId);
  await db.collection(COLL.timetables).doc(id).delete();
}

// Subjects per user+semester
export async function saveSubjects(uid: string, semesterId: string, items: Subject[]) {
  if (!uid || !semesterId) throw new Error("uid and semesterId required");
  const id = subjectId(uid, semesterId);
  await db.collection(COLL.subjects).doc(id).set({ uid, semesterId, items }, { merge: true });
}

export async function getSubjects(uid: string, semesterId: string): Promise<Subject[]> {
  const id = subjectId(uid, semesterId);
  const snap = await db.collection(COLL.subjects).doc(id).get();
  const data = snap.exists ? (snap.data() as any) : null;
  return data?.items || [];
}

// ===== Templates (admin-defined per class) =====
export function templateDocId(key: ClassKey) {
  const toKey = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");
  return `${toKey(key.branch)}_${toKey(key.division)}_${toKey(key.semester)}`;
}

export async function upsertTemplate(template: Omit<TimetableTemplate, "id" | "updatedAt">) {
  const id = templateDocId(template as ClassKey);
  const payload: TimetableTemplate = {
    ...(template as any),
    id,
    updatedAt: Date.now(),
  };
  await db.collection(COLL.templates).doc(id).set(payload, { merge: true });
  return payload;
}

export async function getTemplateByClassKey(key: ClassKey) {
  const id = templateDocId(key);
  const snap = await db.collection(COLL.templates).doc(id).get();
  return snap.exists ? (snap.data() as TimetableTemplate) : null;
}

export async function listTemplates(): Promise<TimetableTemplate[]> {
  const snap = await db.collection(COLL.templates).get();
  return snap.docs.map(d => d.data() as TimetableTemplate).sort((a,b)=>a.id.localeCompare(b.id));
}

export async function deleteTemplate(keyOrId: ClassKey | string) {
  const id = typeof keyOrId === "string" ? keyOrId : templateDocId(keyOrId);
  await db.collection(COLL.templates).doc(id).delete();
}

export async function setHoliday(day: Holiday) {
  if (!day?.date) throw new Error("date is required");
  await db.collection(COLL.holidays).doc(day.date).set(day, { merge: true });
}

export async function getHoliday(date: string) {
  const snap = await db.collection(COLL.holidays).doc(date).get();
  return snap.exists ? (snap.data() as Holiday) : null;
}

export async function listHolidays(start?: string, end?: string) {
  let ref = db.collection(COLL.holidays) as FirebaseFirestore.Query;
  if (start && end) {
    ref = ref.where("date", ">=", start).where("date", "<=", end);
  }
  const snap = await ref.get();
  return snap.docs.map(d => d.data() as Holiday);
}

export async function setClassChange(change: ClassChange) {
  if (!change?.date) throw new Error("date is required");
  await db.collection(COLL.classChanges).doc(change.date).set(change, { merge: true });
}

export async function getClassChange(date: string) {
  const snap = await db.collection(COLL.classChanges).doc(date).get();
  return snap.exists ? (snap.data() as ClassChange) : null;
}

export async function listClassChanges(start?: string, end?: string) {
  let ref = db.collection(COLL.classChanges) as FirebaseFirestore.Query;
  if (start && end) {
    ref = ref.where("date", ">=", start).where("date", "<=", end);
  }
  const snap = await ref.get();
  return snap.docs.map(d => d.data() as ClassChange);
}

// Per-user period interchange overrides
export async function setUserClassChange(uid: string, change: ClassChange) {
  if (!uid || !change?.date) throw new Error("uid and date required");
  const id = `${uid}_${change.date}`;
  await db.collection(COLL.userClassChanges).doc(id).set({ uid, ...change }, { merge: true });
}

export async function getUserClassChange(uid: string, date: string) {
  const id = `${uid}_${date}`;
  const snap = await db.collection(COLL.userClassChanges).doc(id).get();
  return snap.exists ? (snap.data() as ClassChange & { uid: string }) : null;
}

export async function markAttendance(entry: Omit<AttendanceLog, "markedAt">) {
  const markedAt = Date.now();
  const payload: AttendanceLog = { ...entry, markedAt };
  await db.collection(COLL.attendance).add(payload);
  return payload;
}

export async function listAttendance(uid: string, start?: string, end?: string) {
  let ref = db.collection(COLL.attendance).where("uid", "==", uid) as FirebaseFirestore.Query;
  if (start) ref = ref.where("date", ">=", start);
  if (end) ref = ref.where("date", "<=", end);
  const snap = await ref.get();
  return snap.docs.map(d => d.data() as AttendanceLog);
}

// Helper to compute the effective subject for a given date and period, considering holidays and class changes
export async function getEffectiveSubjectForDate(
  uid: string,
  semesterId: string,
  date: string,
  periodIndex: number
): Promise<{ subjectId: string | null; cancelled: boolean }>
{
  // Holidays
  const holiday = await getHoliday(date);
  if (holiday?.isHoliday) return { subjectId: null, cancelled: true };
  if (
    typeof holiday?.earlyCloseAfterPeriod === "number" &&
    periodIndex > holiday.earlyCloseAfterPeriod
  ) {
    return { subjectId: null, cancelled: true };
  }

  // Daily overrides (user-specific first, then global)
  const userChange = await getUserClassChange(uid, date);
  let override = userChange?.overrides?.find(o => o.periodIndex === periodIndex);
  if (!override) {
    const change = await getClassChange(date);
    override = change?.overrides?.find(o => o.periodIndex === periodIndex);
  }
  if (override) {
    if (override.cancelled) return { subjectId: null, cancelled: true };
    if (override.subjectId) return { subjectId: override.subjectId, cancelled: false };
  }

  // Weekly timetable fallback
  const tt = await getWeeklyTimetable(uid, semesterId);
  if (!tt) return { subjectId: null, cancelled: true };
  const weekday = new Date(date + "T00:00:00").getDay(); // 0=Sun..6=Sat
  const map: Record<number, keyof WeeklyTimetable> = {
    1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 0: "mon" as any,
  };
  if (weekday === 0) return { subjectId: null, cancelled: true };
  const key = map[weekday];
  const day = (tt as any)[key] as any;
  if (!day?.enabled) return { subjectId: null, cancelled: true };
  const period = day.periods?.find((p: any) => p.index === periodIndex);
  return { subjectId: period?.subjectId || null, cancelled: !period };
}

export async function computeInsights(
  uid: string,
  semesterId: string,
  minRequiredPercent = 75,
  start?: string,
  end?: string
) {
  // Determine date range: default to timetable's start/end if provided
  const tt = await getWeeklyTimetable(uid, semesterId);
  if (!tt) return {
    bySubject: [], overallPercent: 0, totalHeld: 0, totalPresent: 0,
  };
  const from = parseISO(start || tt.startDate || new Date().toISOString().slice(0,10));
  const to = parseISO(end || tt.endDate || new Date().toISOString().slice(0,10));
  if (isAfter(from, to)) throw new Error("Invalid date range");

  const days = eachDayOfInterval({ start: from, end: to });

  // Aggregate held periods by subject based on effective subjects considering holidays and changes
  const heldBySubject = new Map<string, number>();

  for (const d of days) {
    const iso = d.toISOString().slice(0,10);
    const weekday = d.getDay();
    if (weekday === 0) continue; // Sunday holiday

    // Check day enabled via timetable
    const map: Record<number, keyof WeeklyTimetable> = { 1: "mon", 2: "tue", 3: "wed", 4: "thu", 5: "fri", 6: "sat", 0: "mon" as any };
    const key = map[weekday];
    const day = (tt as any)[key] as any;
    if (!day?.enabled) continue;

    for (let p = 0; p < (tt.periodsPerDay || day.periods?.length || 0); p++) {
      const eff = await getEffectiveSubjectForDate(uid, semesterId, iso, p);
      if (!eff.cancelled && eff.subjectId) {
        heldBySubject.set(eff.subjectId, (heldBySubject.get(eff.subjectId) || 0) + 1);
      }
    }
  }

  // Attendance logs
  const logs = await listAttendance(uid, days[0].toISOString().slice(0,10), days[days.length-1].toISOString().slice(0,10));
  const presentBySubject = new Map<string, number>();
  for (const log of logs) {
    if (log.status === "present") {
      presentBySubject.set(log.subjectId, (presentBySubject.get(log.subjectId) || 0) + 1);
    }
  }

  // Build stats
  let totalHeld = 0;
  let totalPresent = 0;
  const bySubject = Array.from(heldBySubject.entries()).map(([subjectId, held]) => {
    const present = presentBySubject.get(subjectId) || 0;
    totalHeld += held;
    totalPresent += present;
    const percent = held === 0 ? 0 : (present / held) * 100;
    // Safe bunks left calculation: max x such that (present)/(held+x) >= minRequiredPercent/100
    const req = minRequiredPercent / 100;
    let safeBunksLeft = 0;
    if (req > 0) {
      // Solve for x: present / (held + x) >= req => held + x <= present/req => x <= present/req - held
      const val = Math.floor((present / req) - held);
      safeBunksLeft = Math.max(0, val);
    }
    return { subjectId, held, present, percent, safeBunksLeft };
  });

  const overallPercent = totalHeld === 0 ? 0 : (totalPresent / totalHeld) * 100;
  return { bySubject, overallPercent, totalHeld, totalPresent };
}
