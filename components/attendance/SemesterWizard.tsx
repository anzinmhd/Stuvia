"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { WeeklyTimetable, DayTimetable, PeriodDef, Subject } from "@/lib/attendance/types";
import { saveTimetable, getTimetable, getSubjects } from "@/lib/attendance/client";
import SubjectManager from "@/components/attendance/SubjectManager";
import { ModalShell } from "@/components/ui/FX";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  semesterId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: (tt: WeeklyTimetable) => void;
  initialSubjectCount?: number;
}

const dayKeys: Array<{ key: keyof WeeklyTimetable; label: string; optional?: boolean }> = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday", optional: true },
];

function makeDay(enabled: boolean, periodsPerDay: number): DayTimetable {
  const periods: PeriodDef[] = Array.from({ length: periodsPerDay }, (_, i) => ({ index: i, subjectId: "" }));
  return { enabled, periods };
}

export default function SemesterWizard({ semesterId, open, onClose, onSaved, initialSubjectCount }: Props) {
  const [periodsPerDay, setPeriodsPerDay] = useState(6);
  const [enableSat, setEnableSat] = useState(false);
  const [days, setDays] = useState<Record<string, DayTimetable>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Initialize fields when opened
  useEffect(() => {
    if (!open) return;
    const init: Record<string, DayTimetable> = {};
    for (const d of dayKeys) {
      if (d.optional) continue; // handle Sat by toggle
      init[d.key as string] = makeDay(true, periodsPerDay);
    }
    if (enableSat) init["sat"] = makeDay(true, periodsPerDay);
    setDays(init);
    // load subjects for this semester
    (async () => {
      try {
        const res = await getSubjects(semesterId);
        const list = (res as any).data as Subject[];
        setSubjects(Array.isArray(list) ? list : []);
      } catch {
        setSubjects([]);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // When periodsPerDay or enableSat changes, re-shape the periods arrays but keep any typed values
  useEffect(() => {
    if (!open) return;
    setDays((prev) => {
      const next: Record<string, DayTimetable> = {};
      for (const d of dayKeys) {
        if (d.optional && !enableSat) {
          continue;
        }
        const key = d.key as string;
        const existing = prev[key];
        const enabled = existing?.enabled ?? true;
        const periods: PeriodDef[] = Array.from({ length: periodsPerDay }, (_, i) => ({
          index: i,
          subjectId: existing?.periods?.[i]?.subjectId ?? "",
        }));
        next[key] = { enabled, periods };
      }
      return next;
    });
  }, [periodsPerDay, enableSat, open]);

  const canSave = useMemo(() => {
    if (!semesterId) return false;
    if (!periodsPerDay || periodsPerDay < 1) return false;
    if (!subjects || subjects.length === 0) return false;
    // Ensure at least one subject set overall
    return Object.values(days).some((d) => d.enabled && d.periods.some((p) => p.subjectId.trim().length > 0));
  }, [semesterId, periodsPerDay, days, subjects]);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: any = {
        semesterId,
        periodsPerDay,
        locked: true,
        startDate: new Date().toISOString().slice(0,10),
        mon: days.mon,
        tue: days.tue,
        wed: days.wed,
        thu: days.thu,
        fri: days.fri,
      } as WeeklyTimetable;
      if (enableSat) payload.sat = days.sat;
      await saveTimetable(payload);
      onSaved?.(payload);
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to save timetable");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <ModalShell open={open}>
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-5 card">
        <h2 className="text-lg font-semibold">Start New Semester</h2>
        <p className="text-sm text-gray-600 mt-1">First add subjects for this semester, then define a weekly timetable. The timetable will be fixed for the semester. You can still record holidays and one-off class changes later.</p>

        {/* Stepper */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <div className={`px-2 py-1 rounded ${step === 1 ? 'bg-brand-600 text-white' : 'bg-black/5 dark:bg-white/10'}`}>1. Subjects</div>
          <div className="text-black/50 dark:text-white/50">→</div>
          <div className={`px-2 py-1 rounded ${step === 2 ? 'bg-brand-600 text-white' : 'bg-black/5 dark:bg-white/10'}`}>2. Weekly Timetable</div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4"
            >
              <SubjectManager semesterId={semesterId} onSaved={(items) => setSubjects(items)} initialCount={initialSubjectCount}
              />
              <div className="mt-4 flex items-center justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={subjects.length === 0}
                  className="btn-brand"
                >Next</button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Semester ID</label>
                <input value={semesterId} readOnly className="w-full border rounded px-2 py-1 text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Periods per day</label>
                <input
                  type="number"
                  min={1}
                  value={periodsPerDay}
                  onChange={(e) => setPeriodsPerDay(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
              <div className="flex items-end gap-2">
                <input id="en-sat" type="checkbox" checked={enableSat} onChange={(e) => setEnableSat(e.target.checked)} />
                <label htmlFor="en-sat" className="text-sm">Enable Saturday</label>
              </div>
            </div>

            {/* Day grids */}
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {dayKeys.map((d) => {
                if (d.optional && !enableSat) return null;
                const key = d.key as string;
                const day = days[key];
                if (!day) return null;
                return (
                  <div key={key} className="border rounded p-3 card-ambient">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{d.label}</div>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={day.enabled} onChange={(e) => setDays(s => ({ ...s, [key]: { ...s[key], enabled: e.target.checked } }))} />
                        Enabled
                      </label>
                    </div>
                    <div className="grid md:grid-cols-3 gap-2 mt-2">
                      {day.periods.map((p) => (
                        <div key={p.index} className="flex items-center gap-2">
                          <div className="text-xs w-16">Period {p.index + 1}</div>
                          <input
                            list="subject-options"
                            value={p.subjectId}
                            onChange={(e) => setDays(s => ({
                              ...s,
                              [key]: {
                                ...s[key],
                                periods: s[key].periods.map(pp => pp.index === p.index ? { ...pp, subjectId: e.target.value } : pp)
                              }
                            }))}
                            placeholder="Subject ID (e.g., MATH101)"
                            className="flex-1 border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Datalist options from subjects */}
              <datalist id="subject-options">
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name || s.id}</option>
                ))}
              </datalist>
            </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            {step === 2 && (
              <button onClick={() => setStep(1)} className="px-3 py-1.5 rounded border border-black/10 dark:border-white/20 text-sm hover-elevate">Back</button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded border border-black/10 dark:border-white/20 text-sm hover-elevate">Cancel</button>
            {step === 2 && (
              <button
                disabled={!canSave || saving}
                onClick={onSave}
                className="btn-brand"
              >{saving ? "Saving…" : "Save Timetable"}</button>
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
