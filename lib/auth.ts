import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getByEmail, upsertProfile } from "@/lib/userStoreFirebase";
import { adminAuth } from "@/lib/firebase/admin";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV !== "production",
  logger: {
    error(code, metadata) {
      console.error("[NextAuth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth][warn]", code);
    },
    debug(code, metadata) {
      console.debug("[NextAuth][debug]", code, metadata);
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // Restrict by domain for credentials as well
        const allowedDomain = "@rajagiri.edu.in";
        if (!credentials.email.toLowerCase().endsWith(allowedDomain)) {
          // Return null so NextAuth returns a JSON CredentialsSignin error
          return null;
        }
        // Authenticate against Firebase Auth REST API
        try {
          const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
          if (!apiKey) {
            console.error("Missing NEXT_PUBLIC_FIREBASE_API_KEY for Firebase Auth");
            return null;
          }
          const resp = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                returnSecureToken: true,
              }),
            }
          );
          if (!resp.ok) {
            // Parse firebase error for logs and return null
            try {
              const errJson = await resp.json();
              console.warn("Firebase Auth error:", errJson);
            } catch {}
            return null;
          }
          const data = await resp.json();
          // data contains idToken, localId, email, displayName, etc.
          return {
            id: data.localId,
            name: data.displayName || undefined,
            email: data.email,
          } as any;
        } catch (e) {
          console.error("Firebase sign-in error", e);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Enforce college domain for all providers
      const allowedDomain = "@rajagiri.edu.in";
      const email = (user?.email || "").toLowerCase();
      if (!email.endsWith(allowedDomain)) {
        return false; // AccessDenied
      }
      return true;
    },
    async jwt({ token, user }) {
      // On first sign-in, ensure a user profile exists and read completion flag
      if (user?.email) {
        try {
          const existing = await getByEmail(user.email);
          if (!existing) {
            await upsertProfile({ email: user.email, name: user.name || undefined });
          }
          const refreshed = await getByEmail(user.email);
          (token as any).profileCompleted = refreshed?.profileCompleted ?? false;
          // Sync role from profile if present
          const profileRole = (refreshed as any)?.role as string | undefined;
          if (profileRole) {
            (token as any).role = profileRole;
          }
        } catch (e) {
          console.warn("[auth.jwt] profile read/upsert failed", e);
          (token as any).profileCompleted = false;
        }
        // ADMIN_EMAILS support: comma-separated list
        try {
          const adminList = (process.env.ADMIN_EMAILS || "").toLowerCase().split(/[ ,]+/).filter(Boolean);
          const isAdminByEmail = adminList.includes(user.email.toLowerCase());
          if (isAdminByEmail) {
            (token as any).role = "admin";
          }
        } catch {}
        // Fallback if role still unset
        (token as any).role = (token as any).role || (user as any)?.role || "user";
        // Also annotate whether the Firebase user has password provider linked
        try {
          const record = await adminAuth.getUserByEmail(user.email);
          const hasPassword = record.providerData?.some(p => p.providerId === 'password') || false;
          (token as any).hasPasswordProvider = hasPassword;
        } catch (e) {
          console.warn("[auth.jwt] adminAuth.getUserByEmail failed", e);
          (token as any).hasPasswordProvider = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.role = (token as any).role || "user";
      (session as any).user.profileCompleted = (token as any).profileCompleted ?? false;
      (session as any).user.hasPasswordProvider = (token as any).hasPasswordProvider ?? false;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

