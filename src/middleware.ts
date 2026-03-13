import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!hasSupabase) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('tech-news-user');
  if (!cookie?.value) {
    const login = new URL('/login', request.url);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
