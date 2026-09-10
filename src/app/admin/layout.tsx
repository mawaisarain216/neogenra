import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentUser, isMfaVerified } from '@/lib/auth'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers()
  const isLoginPage = requestHeaders.get('x-neogenra-admin-login') === '1'
  const isMfaPage = requestHeaders.get('x-neogenra-admin-mfa') === '1'
  if (isLoginPage || isMfaPage) return children

  const user = await getCurrentUser()
  if (!user) redirect('/admin/login')
  if (user.mfaEnabled && !(await isMfaVerified())) redirect('/admin/mfa')

  return <AdminShell user={{ email: user.email, role: user.role }}><>{children}</></AdminShell>
}
