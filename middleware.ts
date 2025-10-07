import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;
  const isAdmin = (token as any)?.role === "admin";
  const profileCompleted = (token as any)?.profileCompleted as boolean | undefined;
  const hasPasswordProvider = (token as any)?.hasPasswordProvider as boolean | undefined;
  const onboardedCookie = req.cookies.get("onboarded")?.value === "1";

  const path = nextUrl.pathname;
  const isAuthRoutes = path.startsWith("/api/auth");
  const isOnboarding = path === "/onboarding" || path.startsWith("/onboarding");
  const isLogin = path === "/login" || path.startsWith("/login");
  const isSignup = path === "/signup" || path.startsWith("/signup");
  const isSetPasswordApi = path.startsWith("/api/set-password");
  const isProfileApi = path.startsWith("/api/profile");
  const isStatic = path.startsWith("/_next") || /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/.test(path);
  const isAdminRoute = path === "/admin" || path.startsWith("/admin") || path.startsWith("/dashboard/admin");

  // If authenticated and missing either password provider or profile, force onboarding
  const needsOnboarding = isAuth && (!hasPasswordProvider || !profileCompleted) && !onboardedCookie;
  if (needsOnboarding && !isOnboarding && !isAuthRoutes && !isProfileApi && !isSetPasswordApi && !isStatic) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl));
  }

  // If already complete and user hits /onboarding, send home
  if (isAuth && (hasPasswordProvider && profileCompleted || onboardedCookie) && isOnboarding) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // If authenticated and not needing onboarding, keep them out of /login and /signup
  const noOnboardingNeeded = isAuth && (hasPasswordProvider && profileCompleted || onboardedCookie);
  if (noOnboardingNeeded && (isLogin || isSignup)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Admin route guard with better security
  if (isAdminRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login?error=unauthorized", nextUrl));
    }
    if (!isAdmin) {
      // Log unauthorized admin access attempt
      console.warn(`[SECURITY] Unauthorized admin access attempt by ${token?.email} to ${path}`);
      return NextResponse.redirect(new URL("/dashboard?error=access_denied", nextUrl));
    }
  }

  return NextResponse.next();
}

// Exclude next internals and static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
