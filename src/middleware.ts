import { NextRequest, NextResponse } from "next/server"
import { UserData } from "./types";
import { decryptData } from "./lib/encrypt";

export default async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('auth');

  if (!cookie) {
    console.log('No cookie found');
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    const { role } = decryptData(cookie?.value as string) as UserData;

    // Handle invalid role values
    if (!['super_admin', 'admin', 'user'].includes(role)) {
      console.error('Invalid role detected');
      request.cookies.delete('auth');
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // super admin route
    if (request.nextUrl.pathname.startsWith("/")) {
      if (role === "super_admin") {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // restaurant admin route
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (role === "admin") {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // user route
    if (request.nextUrl.pathname.startsWith("/user")) {
      if (role === "user") {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // default route
    return NextResponse.next()

  } catch (error) {
    // Handle decryption failures or invalid cookie data
    console.error('Cookie decryption failed:', error);

    // Create response with deleted cookie
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete('auth');

    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */

    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth).*)',

  ],
}