import { db } from "@/lib/firebase/admin";

export type UserProfile = {
  email: string;
  name?: string;
  branch?: string;
  division?: string;
  semester?: string;
  profileCompleted?: boolean;
};

const USERS_COLL = "users";

export async function getByEmail(email: string): Promise<UserProfile | null> {
  const doc = await db.collection(USERS_COLL).doc(email.toLowerCase()).get();
  if (!doc.exists) return null;
  return doc.data() as UserProfile;
}

export async function upsertProfile(profile: UserProfile): Promise<UserProfile> {
  const emailKey = profile.email.toLowerCase();
  // Determine profileCompleted based on provided fields
  const profileCompleted = Boolean(
    profile.name && profile.branch && profile.division && profile.semester
  );
  const existing = await getByEmail(profile.email);
  const merged: UserProfile = {
    ...(existing || { email: profile.email }),
    ...profile,
    profileCompleted,
  };
  await db.collection(USERS_COLL).doc(emailKey).set(merged, { merge: true });
  return merged;
}
