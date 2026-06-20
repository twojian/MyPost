import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? 'dev-secret-change-me-in-production'
)
const COOKIE_NAME = 'admin-session'

const PROTECTED_PATHS = ['/admin']
const PROTECTED_API = ['/api/posts', '/api/groups', '/api/layout']
const WRITE_METHODS = ['POST', 'PUT', 'DELETE']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const needsAuth =
    PROTECTED_PATHS.some((p) => pathname.startsWith(p)) ||
    (PROTECTED_API.some((p) => pathname.startsWith(p)) &&
      WRITE_METHODS.includes(request.method))

  if (pathname === '/admin/login') return NextResponse.next()

  if (!needsAuth) return NextResponse.next()

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*', '/api/groups/:path*', '/api/layout/:path*'],
}
