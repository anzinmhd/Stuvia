import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const semester = searchParams.get("semester");

    if (!semester) {
      return NextResponse.json({ error: "Semester is required" }, { status: 400 });
    }

    const userEmail = session.user.email;

    // Fetch attendance records for the user and semester
    const attendanceRef = db.collection("attendance");
    const query = attendanceRef
      .where("userEmail", "==", userEmail)
      .where("semester", "==", semester)
      .orderBy("date", "desc")
      .orderBy("period", "asc");

    const snapshot = await query.get();
    const records = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
