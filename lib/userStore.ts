import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "users.json");

export type UserProfile = {
  email: string;
  name?: string;
  branch?: string;
  division?: string;
  semester?: string;
  profileCompleted?: boolean;
};

async function ensureFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify({ users: [] }, null, 2), "utf-8");
  }
}

export async function getAll(): Promise<{ users: UserProfile[] }> {
  await ensureFile();
  const raw = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(raw || "{\"users\":[]}");
}

export async function getByEmail(email: string): Promise<UserProfile | null> {
  const db = await getAll();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function upsertProfile(profile: UserProfile): Promise<UserProfile> {
  const db = await getAll();
  const idx = db.users.findIndex(u => u.email.toLowerCase() === profile.email.toLowerCase());
  const profileCompleted = Boolean(profile.name && profile.branch && profile.division && profile.semester);
  const merged = { ...(idx >= 0 ? db.users[idx] : { email: profile.email }), ...profile, profileCompleted } as UserProfile;
  if (idx >= 0) db.users[idx] = merged; else db.users.push(merged);
  await fs.writeFile(dataFile, JSON.stringify(db, null, 2), "utf-8");
  return merged;
}
