import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: false, message: "Attendance feature removed" }, { status: 410 });
}
