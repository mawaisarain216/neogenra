import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') {
    const target = request.nextUrl.clone()
    target.pathname = '/login'
    return NextResponse.rewrite(target)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/login'] }
