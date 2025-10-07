import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteWeeklyTimetable, getWeeklyTimetable, upsertWeeklyTimetable } from "@/lib/attendance/db";
import { WeeklyTimetable } from "@/lib/attendance/types";

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session.user.email.toLowerCase();
}

export async function GET(_req: Request, { params }: { params: { semesterId: string } }) {
  try {
    const uid = await requireUser();
    const semesterId = params.semesterId;
    const data = await getWeeklyTimetable(uid, semesterId);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: e?.message || "Failed to fetch timetable" }, { status });
  }
}

export async function POST(req: Request, { params }: { params: { semesterId: string } }) {
  try {
    const uid = await requireUser();
    const semesterId = params.semesterId;
    const body = (await req.json()) as WeeklyTimetable;
    if (!body || body.semesterId !== semesterId) {
      return NextResponse.json({ ok: false, message: "semesterId mismatch" }, { status: 400 });
    }
    // If an existing timetable is locked, prevent modification
    const existing = await getWeeklyTimetable(uid, semesterId);
    if (existing && (existing as any).locked) {
      return NextResponse.json({ ok: false, message: "This semester's timetable is locked and cannot be modified" }, { status: 403 });
    }
    await upsertWeeklyTimetable(uid, body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: e?.message || "Failed to save timetable" }, { status });
  }
}

export async function DELETE(_req: Request, { params }: { params: { semesterId: string } }) {
  try {
    const uid = await requireUser();
    const semesterId = params.semesterId;
    await deleteWeeklyTimetable(uid, semesterId);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: e?.message || "Failed to delete timetable" }, { status });
  }
}
