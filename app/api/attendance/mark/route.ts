import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { semester, subjectId, status, period, date, notes } = await request.json();

    if (!semester || !subjectId || !status || !period || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userEmail = session.user.email;

    // Check if attendance record already exists for this date/subject/period
    const attendanceRef = db.collection("attendance");
    const existingQuery = attendanceRef
      .where("userEmail", "==", userEmail)
      .where("semester", "==", semester)
      .where("subjectId", "==", subjectId)
      .where("date", "==", date)
      .where("period", "==", period);

    const existingDocs = await existingQuery.get();

    if (!existingDocs.empty) {
      // Update existing record
      const existingDoc = existingDocs.docs[0];
      await existingDoc.ref.update({
        status,
        notes: notes || "",
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Create new record
      await attendanceRef.add({
        userEmail,
        semester,
        subjectId,
        status,
        period,
        date,
        notes: notes || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
