"use client";

import React, { useEffect, useState } from "react";
import type { Subject } from "@/lib/attendance/types";
import { getSubjects, saveSubjects } from "@/lib/attendance/client";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  semesterId: string;
  onSaved?: (items: Subject[]) => void;
  initialCount?: number; // pre-seed empty rows up to this count
}

export default function SubjectManager({ semesterId, onSaved, initialCount }: Props) {
  const [items, setItems] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const res = await getSubjects(semesterId);
        const data = (res as any).data as Subject[];
        if (mounted) {
          const base = Array.isArray(data) ? data : [];
          // Pre-seed empty rows up to initialCount
          if (initialCount && base.length < initialCount) {
            const deficit = initialCount - base.length;
            const empties = Array.from({ length: deficit }, () => ({ id: "", name: "", color: "" } as Subject));
            setItems([...base, ...empties]);
          } else {
            setItems(base);
          }
        }
      } catch (e: any) {
        setMsg(e?.message || "Failed to load subjects");
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [semesterId, initialCount]);

  const addRow = () => setItems((s) => [...s, { id: "", name: "", color: "" }]);
  const removeRow = (idx: number) => setItems((s) => s.filter((_, i) => i !== idx));

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const cleaned = items
        .map(it => ({ id: it.id.trim(), name: it.name?.trim() || undefined, color: it.color?.trim() || undefined }))
        .filter(it => it.id.length > 0);
      await saveSubjects(semesterId, cleaned);
      setMsg("Subjects saved");
      onSaved?.(cleaned as Subject[]);
    } catch (e: any) {
      setMsg(e?.message || "Failed to save subjects");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Subjects for {semesterId}</h3>
          <p className="text-xs text-gray-600">Add all subjects for this semester. Use subject IDs like MATH101, PHY102.</p>
        </div>
        <button onClick={addRow} className="px-2 py-1 text-xs rounded border border-black/10 dark:border-white/20 hover-elevate">Add</button>
      </div>
      {loading ? (
        <div className="text-sm">Loading…</div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
          {items.map((it, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-12 gap-2"
            >
              <input
                value={it.id}
                onChange={(e) => setItems(s => s.map((x, i) => i === idx ? { ...x, id: e.target.value } : x))}
                placeholder="Subject ID (e.g., MATH101)"
                className="col-span-4 border rounded px-2 py-1 text-sm"
              />
              <input
                value={it.name || ""}
                onChange={(e) => setItems(s => s.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))}
                placeholder="Name (optional)"
                className="col-span-6 border rounded px-2 py-1 text-sm"
              />
              <div className="col-span-2 flex items-center gap-2">
                <input
                  value={it.color || ""}
                  onChange={(e) => setItems(s => s.map((x, i) => i === idx ? { ...x, color: e.target.value } : x))}
                  placeholder="#color"
                  className="border rounded px-2 py-1 text-sm w-full"
                />
                <button onClick={() => removeRow(idx)} className="px-2 py-1 text-xs rounded border border-black/10 hover-elevate">Del</button>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
          {items.length === 0 && (
            <div className="text-xs text-gray-600">No subjects yet. Click Add to create.</div>
          )}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button onClick={save} disabled={saving} className="btn-brand">{saving ? "Saving…" : "Save Subjects"}</button>
        {msg && <div className="text-xs text-gray-600">{msg}</div>}
      </div>
    </div>
  );
}
