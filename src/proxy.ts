import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const headers = new Headers(request.headers)
    headers.set('x-neogenra-admin-route', '1')
    if (request.nextUrl.pathname === '/admin/login') headers.set('x-neogenra-admin-login', '1')
    return NextResponse.next({ request: { headers } })
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
