import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserClassChange, setUserClassChange } from "@/lib/attendance/db";
import { ClassChange } from "@/lib/attendance/types";

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session.user.email.toLowerCase();
}

export async function GET(req: Request) {
  try {
    const uid = await requireUser();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    if (!date) return NextResponse.json({ ok: false, message: "date required" }, { status: 400 });
    const data = await getUserClassChange(uid, date);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: e?.message || "Failed to get user class change" }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const uid = await requireUser();
    const body = (await req.json()) as ClassChange;
    if (!body?.date) return NextResponse.json({ ok: false, message: "date required" }, { status: 400 });
    await setUserClassChange(uid, body);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, message: e?.message || "Failed to set user class change" }, { status });
  }
}
