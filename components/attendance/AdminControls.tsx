"use client";

import React, { useState } from "react";
import { setHoliday, setClassChange } from "@/lib/attendance/client";

export default function AdminControls() {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [isHoliday, setIsHoliday] = useState(false);
  const [earlyCloseAfterPeriod, setEarlyCloseAfterPeriod] = useState<string>("");

  const [overridePeriod, setOverridePeriod] = useState<string>("");
  const [overrideSubjectId, setOverrideSubjectId] = useState("");
  const [overrideCancelled, setOverrideCancelled] = useState(false);

  const [msg, setMsg] = useState<string | null>(null);

  const submitHoliday = async () => {
    setMsg(null);
    try {
      const payload: any = { date };
      if (reason) payload.reason = reason;
      if (isHoliday) payload.isHoliday = true;
      if (!isHoliday && earlyCloseAfterPeriod !== "") {
        payload.earlyCloseAfterPeriod = Number(earlyCloseAfterPeriod);
      }
      await setHoliday(payload);
      setMsg("Saved holiday/closure");
    } catch (e: any) {
      setMsg(e?.message || "Failed to save");
    }
  };

  const submitClassChange = async () => {
    setMsg(null);
    try {
      if (!date) throw new Error("Select a date");
      const overrides = [] as any[];
      if (overridePeriod !== "") {
        overrides.push({
          periodIndex: Number(overridePeriod),
          subjectId: overrideCancelled ? undefined : (overrideSubjectId || undefined),
          cancelled: overrideCancelled || false,
        });
      }
      await setClassChange({ date, overrides });
      setMsg("Saved class change");
    } catch (e: any) {
      setMsg(e?.message || "Failed to save");
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">Holiday / Early Closure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date (YYYY-MM-DD)</label>
            <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="2025-09-25" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Reason (optional)</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input id="isholiday" type="checkbox" checked={isHoliday} onChange={(e) => setIsHoliday(e.target.checked)} />
            <label htmlFor="isholiday" className="text-sm">Full holiday</label>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Early close after period index (optional)</label>
            <input value={earlyCloseAfterPeriod} onChange={(e) => setEarlyCloseAfterPeriod(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="e.g., 2" />
          </div>
        </div>
        <div className="mt-3">
          <button onClick={submitHoliday} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">Save</button>
        </div>
      </div>

      <div className="border rounded p-3">
        <h3 className="font-semibold mb-2">Class Change (Global)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Date (YYYY-MM-DD)</label>
            <input value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Period index</label>
            <input value={overridePeriod} onChange={(e) => setOverridePeriod(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="0-based" />
          </div>
          <div className="flex items-center gap-2">
            <input id="cancelled" type="checkbox" checked={overrideCancelled} onChange={(e) => setOverrideCancelled(e.target.checked)} />
            <label htmlFor="cancelled" className="text-sm">Cancel period</label>
          </div>
          {!overrideCancelled && (
            <div className="md:col-span-3">
              <label className="block text-xs text-gray-600 mb-1">Subject ID</label>
              <input value={overrideSubjectId} onChange={(e) => setOverrideSubjectId(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" placeholder="e.g., MATH101" />
            </div>
          )}
        </div>
        <div className="mt-3">
          <button onClick={submitClassChange} className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">Save</button>
        </div>
      </div>

      {msg && <div className="text-xs text-gray-700">{msg}</div>}
    </div>
  );
}
