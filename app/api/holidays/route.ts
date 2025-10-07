import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listHolidays, setHoliday } from "@/lib/attendance/db";
import { Holiday } from "@/lib/attendance/types";

function isAdmin(session: any) {
  const role = (session as any)?.user?.role;
  const email = (session as any)?.user?.email?.toLowerCase?.();
  if (role === "admin") return true;
  const allow = (process.env.ADMIN_EMAILS || "").split(/[,\s]+/).filter(Boolean).map(s => s.toLowerCase());
  if (email && allow.includes(email)) return true;
  return false;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start") || undefined;
    const end = searchParams.get("end") || undefined;
    const data = await listHolidays(start, end);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Failed to list holidays" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as Holiday;
    if (!body?.date) return NextResponse.json({ ok: false, message: "date required" }, { status: 400 });
    await setHoliday(body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: e?.message || "Failed to set holiday" }, { status });
  }
}
