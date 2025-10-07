"use client";

import React, { useEffect, useState } from "react";
import type { WeeklyTimetable, DayTimetable, PeriodDef } from "@/lib/attendance/types";
import { getTimetable, saveTimetable } from "@/lib/attendance/client";

interface Props {
  semesterId: string;
}

const emptyDay = (enabled = true): DayTimetable => ({ enabled, periods: [] });

const sample: WeeklyTimetable = {
  semesterId: "sem1",
  periodsPerDay: 6,
  mon: emptyDay(true),
  tue: emptyDay(true),
  wed: emptyDay(true),
  thu: emptyDay(true),
  fri: emptyDay(true),
  sat: emptyDay(false),
};

export default function TimetableEditor({ semesterId }: Props) {
  const [tt, setTt] = useState<WeeklyTimetable | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getTimetable(semesterId);
        const data = (res as any).data as WeeklyTimetable | null;
        const base = data ?? { ...sample, semesterId };
        setTt(base);
        setJsonText(JSON.stringify(base, null, 2));
      } catch (e) {}
    })();
  }, [semesterId]);

  const onSave = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const parsed = JSON.parse(jsonText) as WeeklyTimetable;
      if (parsed.semesterId !== semesterId) {
        parsed.semesterId = semesterId;
      }
      await saveTimetable(parsed);
      setMessage("Saved timetable");
    } catch (e: any) {
      setMessage(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">
        Edit your weekly timetable JSON. Sundays are holidays by default. Set `sat.enabled` to true to enable Saturday.
      </div>
      <textarea
        className="w-full h-72 border rounded p-2 font-mono text-sm"
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
          onClick={onSave}
          disabled={saving}
        >{saving ? "Saving…" : "Save Timetable"}</button>
        {message && <div className="text-xs text-gray-600">{message}</div>}
      </div>
    </div>
  );
}
