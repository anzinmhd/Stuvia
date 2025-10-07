"use client";

import React, { useEffect, useState } from "react";
import { getInsights } from "@/lib/attendance/client";
import type { AttendanceInsights } from "@/lib/attendance/types";

interface Props {
  semesterId: string;
  minRequiredPercent?: number;
}

export default function InsightsDashboard({ semesterId, minRequiredPercent = 75 }: Props) {
  const [ins, setIns] = useState<AttendanceInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getInsights(semesterId, { min: minRequiredPercent });
        if (mounted) setIns(res.data);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load insights");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [semesterId, minRequiredPercent]);

  if (loading) return <div className="text-sm">Loading insights…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!ins) return null;

  const warn = ins.overallPercent < minRequiredPercent;

  return (
    <div className="space-y-4">
      <div className={`p-3 rounded ${warn ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
        <div className="text-lg font-semibold">Overall Attendance: {ins.overallPercent.toFixed(1)}%</div>
        <div className="text-sm text-gray-600">Present {ins.totalPresent} / Held {ins.totalHeld}</div>
        {warn && (
          <div className="text-sm text-red-700 mt-1">Warning: Overall attendance below {minRequiredPercent}%</div>
        )}
      </div>
      <div>
        <h3 className="font-semibold mb-2">Subject-wise</h3>
        <div className="space-y-2">
          {ins.bySubject.map((s) => (
            <div key={s.subjectId} className="flex items-center justify-between border rounded px-3 py-2">
              <div>
                <div className="font-medium">{s.subjectId}</div>
                <div className="text-xs text-gray-600">{s.present}/{s.held} ({s.percent.toFixed(1)}%)</div>
              </div>
              <div className="text-xs text-gray-700">Safe bunks left: <span className="font-semibold">{s.safeBunksLeft}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
