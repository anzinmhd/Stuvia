import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listClassChanges, setClassChange } from "@/lib/attendance/db";
import { ClassChange } from "@/lib/attendance/types";

function isAdmin(session: any) {
  return (session as any)?.user?.role === "admin";
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start") || undefined;
    const end = searchParams.get("end") || undefined;
    const data = await listClassChanges(start, end);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Failed to list class changes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as ClassChange;
    if (!body?.date) return NextResponse.json({ ok: false, message: "date required" }, { status: 400 });
    await setClassChange(body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: e?.message || "Failed to set class change" }, { status });
  }
}
