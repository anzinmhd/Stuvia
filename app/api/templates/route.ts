import { NextResponse } from "next/server";
import { getTemplateByClassKey, listTemplates } from "@/lib/attendance/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const branch = searchParams.get("branch");
  const division = searchParams.get("division");
  const semester = searchParams.get("semester");

  // Fetch by document id if provided
  if (id) {
    const items = await listTemplates();
    const tpl = items.find(t => t.id === id) || null;
    return NextResponse.json({ template: tpl });
  }

  if (branch && division && semester) {
    const tpl = await getTemplateByClassKey({ branch, division, semester });
    return NextResponse.json({ template: tpl });
  }

  const items = await listTemplates();
  return NextResponse.json({ items });
}
