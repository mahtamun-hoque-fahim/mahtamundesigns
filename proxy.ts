// TEMPORARILY DISABLED — redirect loop on /dashboard/login
// Once auth is working, re-enable this to protect /dashboard routes
// 
// import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";
// 
// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   if (pathname === "/dashboard/login") return NextResponse.next();
//   if (pathname.startsWith("/dashboard")) {
//     const session = getSessionCookie(request);
//     if (!session) {
//       return NextResponse.redirect(new URL("/dashboard/login", request.url));
//     }
//   }
//   return NextResponse.next();
// }
// 
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

import { NextResponse } from "next/server";
export function proxy() {
  return NextResponse.next();
}
