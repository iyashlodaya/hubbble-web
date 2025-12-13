import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = process.env.NEXT_PUBLIC_LOGGED_IN === 'true';
  const { pathname } = request.nextUrl;

  // If logged in and trying to access auth pages, redirect to home
  if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // If not logged in and trying to access protected pages, redirect to login
  if (!isLoggedIn && pathname === '/home') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

