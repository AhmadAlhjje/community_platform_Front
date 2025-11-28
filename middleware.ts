import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const pathname = request.nextUrl.pathname

  const isAuthPage = pathname.startsWith('/auth')
  const isPublicPage = ['/', '/about', '/contact'].includes(pathname)
  const isProtectedPage = !isPublicPage && !isAuthPage

  // If user is logged in and tries to access auth pages, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not logged in and tries to access protected pages, redirect to home
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
