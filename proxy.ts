import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let login page through
  if (pathname === "/dashboard/login") return NextResponse.next();

  // Protect everything under /dashboard
  if (pathname.startsWith("/dashboard")) {
    const session = getSessionCookie(request);
    if (!session) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
