import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("session")?.value;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isPublicRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - api
     * - static files
     * - next internals
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
