import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always let the login page through — no session required
  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  // Protect every other /dashboard route
  if (pathname.startsWith("/dashboard")) {
    try {
      const session = await getAuth().api.getSession({
        headers: request.headers,
      });

      if (!session) {
        return NextResponse.redirect(
          new URL("/dashboard/login", request.url)
        );
      }
    } catch {
      // DB unreachable or session check threw — redirect to login rather than
      // exposing an unprotected page or a 500
      return NextResponse.redirect(
        new URL("/dashboard/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
