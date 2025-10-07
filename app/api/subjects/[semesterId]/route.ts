import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebase/admin";

export async function GET(
  request: Request,
  { params }: { params: { semesterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { semesterId } = params;
    const userEmail = session.user.email;

    // Fetch subjects for the user and semester
    const subjectsRef = db.collection("subjects");
    const query = subjectsRef
      .where("userEmail", "==", userEmail)
      .where("semester", "==", semesterId);

    const snapshot = await query.get();
    const subjects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { semesterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { semesterId } = params;
    const userEmail = session.user.email;
    const { subjects } = await request.json();

    if (!subjects || !Array.isArray(subjects)) {
      return NextResponse.json({ error: "Invalid subjects data" }, { status: 400 });
    }

    // Delete existing subjects for this semester
    const existingQuery = db.collection("subjects")
      .where("userEmail", "==", userEmail)
      .where("semester", "==", semesterId);
    
    const existingSnapshot = await existingQuery.get();
    const batch = db.batch();
    
    existingSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Add new subjects
    subjects.forEach(subject => {
      const subjectRef = db.collection("subjects").doc();
      batch.set(subjectRef, {
        userEmail,
        semester: semesterId,
        name: subject.name,
        id: subject.id || subjectRef.id,
        createdAt: new Date().toISOString(),
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving subjects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
