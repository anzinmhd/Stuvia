"use client";
import { useMemo, useState } from "react";

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat (optional)" },
] as const;

type Props = {
  defaultPeriodsPerDay?: number;
  defaultSemesterOptions: string[];
};

export default function ManualGridSetup({ defaultPeriodsPerDay = 6, defaultSemesterOptions }: Props) {
  const [semester, setSemester] = useState<string>(defaultSemesterOptions[0] ?? "1");
  const [ppd, setPpd] = useState<number>(defaultPeriodsPerDay);
  const [useSaturday, setUseSaturday] = useState<boolean>(false);
  const [subjectCount, setSubjectCount] = useState<number>(6);
  const [subjectNames, setSubjectNames] = useState<string[]>(Array.from({ length: 6 }, () => ""));

  // timetable state: day -> periodIndex -> subjectId (by index of subjectNames)
  const [grid, setGrid] = useState<Record<string, (number | null)[]>>(() => {
    const initial: Record<string, (number | null)[]> = {};
    for (const d of DAYS) {
      initial[d.key] = Array.from({ length: defaultPeriodsPerDay }, () => null);
    }
    return initial;
  });

  // Options for selects
  const subjectOptions = useMemo(() => subjectNames.map((name, idx) => ({ value: idx, label: name })), [subjectNames]);

  function handleSubjectNameChange(i: number, value: string) {
    setSubjectNames(prev => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  function handleSubjectCountChange(n: number) {
    if (Number.isNaN(n) || n < 1) n = 1;
    if (n > 12) n = 12;
    setSubjectCount(n);
    setSubjectNames(prev => {
      const next = [...prev];
      if (n > next.length) {
        while (next.length < n) next.push("");
      } else if (n < next.length) {
        next.length = n;
      }
      return next;
    });
  }

  function handlePpdChange(n: number) {
    if (Number.isNaN(n) || n < 1) n = 1;
    if (n > 10) n = 10;
    setPpd(n);
    setGrid(prev => {
      const next: Record<string, (number | null)[]> = {};
      for (const d of DAYS) {
        const old = prev[d.key] || [];
        const row = Array.from({ length: n }, (_, i) => (i < old.length ? old[i] : null));
        next[d.key] = row;
      }
      return next;
    });
  }

  function setCell(dayKey: string, periodIndex: number, value: string) {
    setGrid(prev => {
      const next = { ...prev };
      const row = [...(next[dayKey] || [])];
      next[dayKey] = row;
      row[periodIndex] = value === "" ? null : Number(value);
      return next;
    });
  }

  async function onSave() {
    // Build subjects [{ id, name }]
    const subjects = subjectNames.map((name, idx) => ({
      id: name.toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 12) || `SUBJ${idx+1}`,
      name,
    }));

    // Build timetable object
    const tt: any = { semesterId: semester, periodsPerDay: ppd };
    for (const d of DAYS) {
      if (d.key === "sat" && !useSaturday) {
        tt[d.key] = { enabled: false, periods: [] };
        continue;
      }
      const row = grid[d.key] || [];
      tt[d.key] = {
        enabled: d.key === "sat" ? useSaturday : true,
        periods: row.map((sel, idx) => sel == null ? null : ({ index: idx, subjectId: subjects[sel]?.id })).filter(Boolean),
      };
    }

    const res = await fetch("/api/attendance/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        semester,
        periodsPerDay: ppd,
        subjects,
        timetable: tt,
      }),
    });

    if (res.ok) {
      window.location.href = "/dashboard/attendance";
    } else {
      alert("Failed to save timetable");
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium">Semester</label>
          <select value={semester} onChange={e => setSemester(e.target.value)} className="mt-1 w-full rounded-lg border border-orange-500/80 bg-neutral-900 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            {defaultSemesterOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Periods per day</label>
          <input type="number" min={1} max={10} value={ppd} onChange={e => handlePpdChange(Number(e.target.value))} className="mt-1 w-full rounded border border-black/10 dark:border-white/20 bg-transparent p-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Use Saturday</label>
          <div className="mt-2"><input type="checkbox" checked={useSaturday} onChange={e => setUseSaturday(e.target.checked)} /> <span className="text-sm">Enable Saturday</span></div>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Subjects</label>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(subjectCount, 7)}, minmax(120px, 1fr))`, gap: 8 }}>
          {Array.from({ length: subjectCount }).map((_, i) => (
            <input key={i} value={subjectNames[i] || ""} onChange={e => handleSubjectNameChange(i, e.target.value)} className="rounded border border-black/10 dark:border-white/20 bg-transparent p-2 text-sm" placeholder={`Subject ${i+1}`} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <label className="text-sm">Number of subjects</label>
          <input type="number" min={1} max={12} value={subjectCount} onChange={e => handleSubjectCountChange(Number(e.target.value))} className="w-24 rounded border border-black/10 dark:border-white/20 bg-transparent p-2 text-sm" />
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b border-black/10 dark:border-white/10">Day \ Period</th>
              {Array.from({ length: ppd }).map((_, i) => (
                <th key={i} className="p-2 border-b border-black/10 dark:border-white/10">P{i+1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((d) => (
              <tr key={d.key} className={d.key === "sat" && !useSaturday ? "opacity-50" : ""}>
                <td className="p-2 border-b border-black/10 dark:border-white/10 whitespace-nowrap">{d.label}</td>
                {Array.from({ length: ppd }).map((_, i) => (
                  <td key={i} className="p-2 border-b border-black/10 dark:border-white/10">
                    <select
                      disabled={d.key === "sat" && !useSaturday}
                      value={(grid[d.key]?.[i] ?? "") as any}
                      onChange={e => setCell(d.key, i, e.target.value)}
                      className="w-full rounded-lg border border-orange-500/80 bg-neutral-900 text-white p-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">—</option>
                      {subjectOptions.map(opt => (
                        <option key={opt.value} value={String(opt.value)}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <button type="button" onClick={onSave} className="px-4 py-2 rounded-lg bg-brand-600 text-white">Save Manual Timetable</button>
      </div>
    </div>
  );
}
