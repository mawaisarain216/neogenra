import { NextResponse } from 'next/server'
import { ensureCsrfToken } from '@/lib/csrf'
export async function GET(){return NextResponse.json({token:await ensureCsrfToken()})}
