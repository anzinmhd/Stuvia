"use client";
import { useEffect, useMemo, useState } from "react";

const BRANCHES = ["CSE","ECE","EEE","ME","CE","AD","CU"] as const;
const DIVISIONS = ["NIL","Alpha","Beta","Gamma","Delta"] as const;
const SEMS = ["1","2","3","4","5","6","7","8"] as const;

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
  initialTemplate?: {
    branch: string;
    division: string;
    semester: string;
    name?: string;
    periodsPerDay: number;
    subjects: { id: string; name?: string }[];
    timetable: any;
  } | null;
};

export default function AdminGridTemplate({ defaultPeriodsPerDay = 6, initialTemplate = null }: Props) {
  const [branch, setBranch] = useState<string>(BRANCHES[0]);
  const [division, setDivision] = useState<string>(DIVISIONS[0]);
  const [semester, setSemester] = useState<string>(SEMS[0]);
  const [name, setName] = useState<string>("");
  const [ppd, setPpd] = useState<number>(defaultPeriodsPerDay);
  const [useSaturday, setUseSaturday] = useState<boolean>(false);
  const [subjectCount, setSubjectCount] = useState<number>(6);
  const [subjectNames, setSubjectNames] = useState<string[]>(Array.from({ length: 6 }, () => ""));

  const [grid, setGrid] = useState<Record<string, (number | null)[]>>(() => {
    const initial: Record<string, (number | null)[]> = {};
    for (const d of DAYS) {
      initial[d.key] = Array.from({ length: defaultPeriodsPerDay }, () => null);
    }
    return initial;
  });

  const subjectOptions = useMemo(() => subjectNames.map((name, idx) => ({ value: idx, label: name })), [subjectNames]);

  function handleSubjectNameChange(i: number, value: string) {
    setSubjectNames(prev => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  useEffect(() => {
    if (!initialTemplate) return;
    setBranch(initialTemplate.branch);
    setDivision(initialTemplate.division);
    setSemester(initialTemplate.semester);
    setName(initialTemplate.name || "");
    // periods per day first (resizes grid rows)
    handlePpdChange(initialTemplate.periodsPerDay);

    // Prepare subjects
    const subjects = Array.isArray(initialTemplate.subjects) ? initialTemplate.subjects : [];
    const names = subjects.map(s => s?.name || s.id);
    const idToIndex = new Map<string, number>();
    subjects.forEach((s, i) => idToIndex.set(s.id, i));

    const count = Math.max(1, names.length || 6);
    setSubjectCount(count);
    setSubjectNames(Array.from({ length: count }, (_, i) => names[i] || ""));

    // Timetable hydration
    const t = initialTemplate.timetable || {};
    setUseSaturday(Boolean(t?.sat?.enabled));
    setGrid(() => {
      const next: Record<string, (number | null)[]> = {};
      for (const d of DAYS) {
        const day = (t as any)?.[d.key];
        const row: (number | null)[] = Array.from({ length: initialTemplate.periodsPerDay }, () => null);
        if (day?.periods) {
          for (const p of day.periods) {
            const idx = Number(p.index);
            const sid = String(p.subjectId || "");
            const subjIdx = idToIndex.has(sid) ? (idToIndex.get(sid) as number) : null;
            if (!Number.isNaN(idx) && idx >= 0 && idx < row.length) {
              row[idx] = subjIdx;
            }
          }
        }
        next[d.key] = row;
      }
      return next;
    });
  }, [initialTemplate]);

  function handleSubjectCountChange(n: number) {
    if (Number.isNaN(n) || n < 1) n = 1;
    if (n > 20) n = 20;
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
      const next = { ...prev } as any;
      const row = [...(next[dayKey] || [])];
      next[dayKey] = row;
      row[periodIndex] = value === "" ? null : Number(value);
      return next;
    });
  }

  async function onSave() {
    // Build subjects array
    const subjects = subjectNames.map((name, idx) => ({
      id: name.toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 12) || `SUBJ${idx+1}`,
      name,
    }));

    // Build timetable from grid state
    const timetable: any = { semesterId: semester, periodsPerDay: ppd };
    for (const d of DAYS) {
      if (d.key === "sat" && !useSaturday) {
        timetable[d.key] = { enabled: false, periods: [] };
        continue;
      }
      const row = grid[d.key] || [];
      timetable[d.key] = {
        enabled: d.key === "sat" ? useSaturday : true,
        periods: row.map((sel, idx) => sel == null ? null : ({ index: idx, subjectId: subjects[sel!]?.id })).filter(Boolean),
      };
    }

    const res = await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        branch,
        division,
        semester,
        name,
        periodsPerDay: ppd,
        subjects,
        timetable,
      }),
    });

    if (!res.ok) {
      alert("Failed to save template");
      return;
    }
    // Refresh list
    window.location.reload();
  }

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Branch
            </label>
            <select 
              value={branch} 
              onChange={e => setBranch(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Division
            </label>
            <select 
              value={division} 
              onChange={e => setDivision(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Semester
            </label>
            <select 
              value={semester} 
              onChange={e => setSemester(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {SEMS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Friendly Name
            </label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g., CSE-A Sem 3" 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500" 
            />
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuration</h3>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Periods per day
            </label>
            <input 
              type="number" 
              min={1} 
              max={10} 
              value={ppd} 
              onChange={e => handlePpdChange(Number(e.target.value))} 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Use Saturday
            </label>
            <div className="flex items-center gap-3 mt-3">
              <input 
                type="checkbox" 
                id="saturday-toggle"
                checked={useSaturday} 
                onChange={e => setUseSaturday(e.target.checked)} 
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
              />
              <label htmlFor="saturday-toggle" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Enable Saturday classes</label>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Number of subjects
            </label>
            <input 
              type="number" 
              min={1} 
              max={20} 
              value={subjectCount} 
              onChange={e => handleSubjectCountChange(Number(e.target.value))} 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
        </div>
      </div>

      {/* Subject Names */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject Names</h3>
        </div>
        
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(subjectCount, 4)}, minmax(200px, 1fr))` }}>
          {Array.from({ length: subjectCount }).map((_, i) => (
            <div key={i} className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Subject {i + 1}</label>
              <input 
                value={subjectNames[i] || ""} 
                onChange={e => handleSubjectNameChange(i, e.target.value)} 
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500" 
                placeholder={`Enter subject ${i+1} name`} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Timetable</h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">Day / Period</th>
                  {Array.from({ length: ppd }).map((_, i) => (
                    <th key={i} className="p-4 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 text-center min-w-[120px]">
                      Period {i+1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((d, dayIndex) => (
                  <tr key={d.key} className={`${d.key === "sat" && !useSaturday ? "opacity-50 bg-gray-50 dark:bg-gray-800/50" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"} transition-colors`}>
                    <td className="p-4 font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${d.key === "sat" && !useSaturday ? "bg-gray-400" : ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-400", "bg-blue-400", "bg-purple-400"][dayIndex % 6]}`}></div>
                        {d.label}
                      </div>
                    </td>
                    {Array.from({ length: ppd }).map((_, i) => (
                      <td key={i} className="p-3 border-b border-gray-100 dark:border-gray-700">
                        <select
                          disabled={d.key === "sat" && !useSaturday}
                          value={(grid[d.key]?.[i] ?? "") as any}
                          onChange={e => setCell(d.key, i, e.target.value)}
                          className={`w-full px-2 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${d.key === "sat" && !useSaturday ? "cursor-not-allowed" : ""}`}
                        >
                          <option value="">— Free —</option>
                          {subjectOptions.map(opt => (
                            <option key={opt.value} value={String(opt.value)}>{opt.label || `Subject ${opt.value + 1}`}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button 
          type="button" 
          onClick={onSave} 
          className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Template
          </div>
        </button>
      </div>
    </div>
  );
}
