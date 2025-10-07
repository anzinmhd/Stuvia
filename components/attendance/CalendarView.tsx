"use client";

import React, { useCallback, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { getTimetable, getEffectiveSubject, markAttendance, setUserClassChange } from "@/lib/attendance/client";
import type { WeeklyTimetable } from "@/lib/attendance/types";

interface CalendarViewProps {
  semesterId: string;
}

export default function CalendarView({ semesterId }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tt, setTt] = useState<WeeklyTimetable | null>(null);
  const [loading, setLoading] = useState(false);
  const [periods, setPeriods] = useState<Array<{ index: number; subjectId: string | null; cancelled: boolean }>>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [overrideSubject, setOverrideSubject] = useState<string>("");
  const [overrideCancelled, setOverrideCancelled] = useState<boolean>(false);

  const loadTimetable = useCallback(async () => {
    try {
      const res = await getTimetable(semesterId);
      setTt(res.data || null);
    } catch (e: any) {
      console.error(e);
    }
  }, [semesterId]);

  const handleDatesSet = useCallback(async () => {
    if (!tt) await loadTimetable();
  }, [tt, loadTimetable]);

  const onDateClick = useCallback(async (arg: any) => {
    const date = format(arg.date as Date, "yyyy-MM-dd");
    setSelectedDate(date);
    setLoading(true);
    setMessage(null);
    try {
      const pCount = tt?.periodsPerDay || 0;
      const arr: Array<{ index: number; subjectId: string | null; cancelled: boolean }> = [];
      for (let i = 0; i < pCount; i++) {
        const eff = await getEffectiveSubject(date, semesterId, i);
        arr.push({ index: i, subjectId: eff.data.subjectId, cancelled: eff.data.cancelled });
      }
      setPeriods(arr);
    } catch (e: any) {
      setMessage(e?.message || "Failed to load periods");
    } finally {
      setLoading(false);
    }
  }, [semesterId, tt]);

  const mark = useCallback(async (periodIndex: number, status: "present" | "absent", subjectId?: string | null) => {
    if (!selectedDate || tt == null) return;
    setMessage(null);
    try {
      await markAttendance({ date: selectedDate, periodIndex, status, subjectId: subjectId || undefined, semesterId });
      setMessage("Saved");
    } catch (e: any) {
      setMessage(e?.message || "Failed to save");
    }
  }, [selectedDate, semesterId, tt]);

  const openEdit = (pIndex: number, currentSubjectId: string | null) => {
    setEditingIndex(pIndex);
    setOverrideSubject(currentSubjectId || "");
    setOverrideCancelled(false);
  };

  const saveInterchange = async () => {
    if (selectedDate == null || editingIndex == null) return;
    setMessage(null);
    try {
      const overrides = overrideCancelled
        ? [{ periodIndex: editingIndex, cancelled: true }]
        : [{ periodIndex: editingIndex, subjectId: overrideSubject || undefined }];
      await setUserClassChange({ date: selectedDate, overrides });
      setMessage("Override saved for this date");
      setEditingIndex(null);
      // Refresh periods
      const pCount = tt?.periodsPerDay || 0;
      const arr: Array<{ index: number; subjectId: string | null; cancelled: boolean }> = [];
      for (let i = 0; i < pCount; i++) {
        const eff = await getEffectiveSubject(selectedDate, semesterId, i);
        arr.push({ index: i, subjectId: eff.data.subjectId, cancelled: eff.data.cancelled });
      }
      setPeriods(arr);
    } catch (e: any) {
      setMessage(e?.message || "Failed to save override");
    }
  };

  const clearInterchange = async () => {
    if (selectedDate == null) return;
    setMessage(null);
    try {
      // Overwrite with empty overrides to clear
      await setUserClassChange({ date: selectedDate, overrides: [] });
      setMessage("Overrides cleared for this date");
      setEditingIndex(null);
      // Refresh periods
      const pCount = tt?.periodsPerDay || 0;
      const arr: Array<{ index: number; subjectId: string | null; cancelled: boolean }> = [];
      for (let i = 0; i < pCount; i++) {
        const eff = await getEffectiveSubject(selectedDate, semesterId, i);
        arr.push({ index: i, subjectId: eff.data.subjectId, cancelled: eff.data.cancelled });
      }
      setPeriods(arr);
    } catch (e: any) {
      setMessage(e?.message || "Failed to clear overrides");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth" }}
          dateClick={onDateClick}
          datesSet={handleDatesSet}
          height="auto"
        />
      </div>
      <div className="lg:col-span-1 border rounded-md p-4">
        <h3 className="font-semibold mb-2">Attendance Marking</h3>
        {selectedDate ? (
          <div>
            <div className="text-sm text-gray-500 mb-2">{selectedDate}</div>
            {loading && <div className="text-sm">Loading periods…</div>}
            {!loading && periods.length === 0 && (
              <div className="text-sm text-gray-500">No periods found. Ensure timetable is set.</div>
            )}
            <ul className="space-y-2">
              {periods.map((p) => (
                <li key={p.index} className="flex items-center justify-between border rounded px-2 py-1">
                  <div className="text-sm">
                    <div className="font-medium">Period {p.index + 1}</div>
                    <div className="text-gray-600 text-xs">
                      {p.cancelled ? "Cancelled" : (p.subjectId || "-")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!p.cancelled && (
                      <>
                        <button
                          className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                          onClick={() => mark(p.index, "present", p.subjectId)}
                        >Present</button>
                        <button
                          className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                          onClick={() => mark(p.index, "absent", p.subjectId)}
                        >Absent</button>
                      </>
                    )}
                    <button
                      className="text-xs px-2 py-1 rounded border border-black/10 dark:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.06]"
                      onClick={() => openEdit(p.index, p.subjectId)}
                    >Adjust</button>
                  </div>
                </li>
              ))}
            </ul>
            {editingIndex !== null && (
              <div className="mt-3 border rounded p-2">
                <div className="text-xs font-medium mb-1">Interchange / Cancel for Period {editingIndex + 1} on {selectedDate}</div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={overrideCancelled} onChange={(e) => setOverrideCancelled(e.target.checked)} />
                    Cancel period
                  </label>
                  {!overrideCancelled && (
                    <input
                      value={overrideSubject}
                      onChange={(e) => setOverrideSubject(e.target.value)}
                      placeholder="Subject ID (e.g., PHY101)"
                      className="border rounded px-2 py-1 text-sm flex-1"
                    />
                  )}
                  <button onClick={saveInterchange} className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
                  <button onClick={clearInterchange} className="text-xs px-2 py-1 rounded border border-black/10 dark:border-white/20">Clear</button>
                  <button onClick={() => setEditingIndex(null)} className="text-xs px-2 py-1 rounded">Close</button>
                </div>
              </div>
            )}
            {message && <div className="mt-2 text-xs text-gray-600">{message}</div>}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Select a date on the calendar to mark attendance.</div>
        )}
      </div>
    </div>
  );
}
