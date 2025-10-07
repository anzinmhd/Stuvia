import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveSubjects, upsertWeeklyTimetable } from "@/lib/attendance/db";
import { upsertProfile } from "@/lib/userStoreFirebase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const uid = session.user.email as string;

    const semester = String(body.semester || "");
    if (!semester) return NextResponse.json({ message: "semester required" }, { status: 400 });

    const subjects = Array.isArray(body.subjects) ? body.subjects : [];
    const timetable = body.timetable || null;
    if (!timetable?.mon || !timetable?.tue || !timetable?.wed || !timetable?.thu || !timetable?.fri) {
      return NextResponse.json({ message: "invalid timetable" }, { status: 400 });
    }

    await saveSubjects(uid, semester, subjects);

    // Optionally update profile with class meta so dashboard/attendance reads the same semester
    try {
      const patch: any = { email: uid };
      if (body.semester) patch.semester = String(body.semester);
      if (body.branch) patch.branch = String(body.branch);
      if (body.division) patch.division = String(body.division);
      await upsertProfile(patch);
    } catch (e) {
      console.warn("[attendance.setup] upsertProfile failed", e);
    }

    await upsertWeeklyTimetable(uid, {
      semesterId: semester,
      periodsPerDay: Number(body.periodsPerDay || timetable.periodsPerDay || 6),
      mon: timetable.mon,
      tue: timetable.tue,
      wed: timetable.wed,
      thu: timetable.thu,
      fri: timetable.fri,
      sat: timetable.sat,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[attendance.setup] POST failed", e);
    return NextResponse.json({ message: e?.message || "Invalid payload" }, { status: 400 });
  }
}
