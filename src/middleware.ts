import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If accessing root path, ensure it shows home page
  // This is already handled by Next.js routing, but we can add explicit redirects if needed
  const { pathname } = request.nextUrl

  // Redirect empty path or index to home
  if (pathname === '/' || pathname === '/index' || pathname === '/index.html') {
    // Already on home, no redirect needed
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

