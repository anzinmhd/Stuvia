import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { listTemplates, upsertTemplate, deleteTemplate } from "@/lib/attendance/db";
import { TimetableTemplate } from "@/lib/attendance/types";
function requireAdmin(session: any) {
  const role = session?.user?.role;
  if (role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const deny = requireAdmin(session);
  if (deny) return deny;
  const items = await listTemplates();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const deny = requireAdmin(session);
  if (deny) return deny;
  try {
    const body = await req.json();
    // Expect: { branch, division, semester, name?, periodsPerDay, subjects, timetable }
    const payload = await upsertTemplate({
      branch: body.branch,
      division: body.division,
      semester: body.semester,
      name: body.name,
      periodsPerDay: body.periodsPerDay,
      subjects: body.subjects,
      timetable: {
        ...body.timetable,
        semesterId: String(body.semester),
      },
      verifiedBy: session?.user?.email as string,
    } as any);
    return NextResponse.json(payload);
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const deny = requireAdmin(session);
  if (deny) return deny;
  try {
    const url = new URL(req.url);
    const idFromQuery = url.searchParams.get("id");
    if (idFromQuery) {
      await deleteTemplate(idFromQuery);
      return NextResponse.json({ ok: true });
    }
    const body = await req.json().catch(() => ({}));
    if (body?.id) {
      await deleteTemplate(body.id);
      return NextResponse.json({ ok: true });
    }
    if (body?.branch && body?.division && body?.semester) {
      await deleteTemplate({ branch: body.branch, division: body.division, semester: body.semester });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ message: "id or class key required" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Failed to delete" }, { status: 400 });
  }
}
