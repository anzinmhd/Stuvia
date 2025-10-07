import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getWeeklyTimetable, listTemplates, saveSubjects, upsertWeeklyTimetable } from "@/lib/attendance/db";
import { getByEmail } from "@/lib/userStoreFirebase";
import { upsertProfile } from "@/lib/userStoreFirebase";
import ManualGridSetup from "./ManualGridSetup";

const BRANCHES = ["CSE","ECE","EEE","ME","CE","AD","CU"];
const DIVISIONS = ["NIL","Alpha","Beta","Gamma","Delta"];
const SEMS = ["1","2","3","4","5","6","7","8"];

export default async function AttendanceSetupPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");
  const uid = session.user?.email as string;
  const profile = uid ? await getByEmail(uid) : null;
  const defaultBranch = (profile?.branch as string | undefined) || "CSE";
  const defaultDivision = (profile?.division as string | undefined) || "NIL";
  const defaultSemester = (profile?.semester as string | undefined) || "1";

  // If already has a timetable+subjects for current semester, show link to attendance
  const existing = await getWeeklyTimetable(uid, defaultSemester).catch(()=>null);
  if (existing) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl grid gap-4">
          <h1 className="text-2xl font-semibold">Attendance Setup</h1>
          <p className="text-sm text-black/60 dark:text-white/60">It looks like you already configured a timetable. You can update it later from Settings.</p>
          <Link href="/dashboard/attendance" className="px-4 py-2 rounded-lg bg-brand-600 text-white w-fit">Go to Attendance</Link>
        </div>
      </main>
    );
  }

  // Fetch pre-added templates list (no-store to avoid caching)
  let templates: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/templates`, { cache: 'no-store' });
    const json = await res.json();
    templates = (json?.templates || json?.items || []) as any[];
  } catch {}

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl grid gap-6">
        <h1 className="text-2xl font-semibold">Attendance Setup</h1>
        <section className="card p-6">
          <h2 className="font-medium">Select a pre-added timetable (recommended)</h2>
          <TemplatePicker
            defaults={{ branch: defaultBranch, division: defaultDivision, semester: defaultSemester }}
            templates={templates}
          />
        </section>
        <section className="card p-6">
          <h2 className="font-medium">Or add manually</h2>
          <p className="text-sm text-black/60 dark:text-white/60">Enter subjects in columns and pick subjects per period/day using dropdowns.</p>
          <div className="mt-4">
            <ManualGridSetup defaultPeriodsPerDay={6} defaultSemesterOptions={SEMS} />
          </div>
        </section>
      </div>
    </main>
  );
}

function TemplatePicker({ defaults, templates }: { defaults: { branch: string; division: string; semester: string }, templates: any[] }) {
  // Prefer default class template in the dropdown
  const preferred = templates.find(t => t.branch === defaults.branch && t.division === defaults.division && String(t.semester) === String(defaults.semester));
  return (
    <form className="mt-3 grid gap-3" action={async (formData) => {
      'use server';
      const session = await getServerSession(authOptions);
      const uid = session?.user?.email as string | undefined;
      if (!uid) return;
      const tplId = String(formData.get('tpl') || '');
      if (!tplId) {
        // If not found, just stay on the page (could enhance with toast)
        return;
      }
      // Load the template by id from DB
      const all = await listTemplates();
      const tpl = all.find(t => t.id === tplId) || null;
      if (!tpl) return;

      // Save subjects
      await saveSubjects(uid, String(tpl.semester), tpl.subjects || []);

      // Update profile to match class
      await upsertProfile({ email: uid, semester: String(tpl.semester), branch: tpl.branch, division: tpl.division } as any);

      // Save weekly timetable (filter out undefined dates)
      const timetablePayload: any = {
        semesterId: String(tpl.semester),
        periodsPerDay: Number(tpl.periodsPerDay || tpl.timetable?.periodsPerDay || 6),
        mon: tpl.timetable.mon,
        tue: tpl.timetable.tue,
        wed: tpl.timetable.wed,
        thu: tpl.timetable.thu,
        fri: tpl.timetable.fri,
        sat: tpl.timetable.sat,
      };
      if ((tpl.timetable as any)?.startDate) timetablePayload.startDate = (tpl.timetable as any).startDate;
      if ((tpl.timetable as any)?.endDate) timetablePayload.endDate = (tpl.timetable as any).endDate;
      await upsertWeeklyTimetable(uid, timetablePayload);
      // After applying template, jump to attendance
      redirect('/dashboard/attendance');
    }}>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Pre-added timetables</label>
        <select name="tpl" required defaultValue={preferred?.id || ''} className="mt-1 w-full rounded-lg border border-orange-500/80 bg-neutral-900 text-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="" disabled>Select a template…</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{`${t.branch} • ${t.division} • Sem ${t.semester}${t.name ? ' — ' + t.name : ''}`}</option>
          ))}
        </select>
        {!templates?.length && (
          <div className="text-xs text-black/60 dark:text-white/60">No templates available. Ask an admin to add one for your class.</div>
        )}
      </div>
      <button className="px-4 py-2 rounded-lg bg-brand-600 text-white w-fit">Use Template</button>
    </form>
  );
}


function Input(props: any) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...rest} className="mt-1 w-full rounded border border-black/10 dark:border-white/20 bg-transparent p-2 text-sm" />
    </div>
  );
}

function Select({ label, name, options, defaultValue }: { label: string; name: string; options: string[]; defaultValue?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select name={name} defaultValue={defaultValue} className="mt-1 w-full rounded border border-black/10 dark:border-white/20 bg-transparent p-2 text-sm">
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
