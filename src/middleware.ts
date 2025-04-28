// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("error", "not-logged-in");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/artikel/:path*", "/profile", "/admin/:path*"], 
};
