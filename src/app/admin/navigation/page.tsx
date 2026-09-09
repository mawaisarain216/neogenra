import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { notFound } from 'next/navigation'
import NavigationManager from '@/components/admin/NavigationManager'
export default async function NavigationPage(){const user=await requireRole(['SUPER_ADMIN','ADMIN']);if(!user)notFound();const items=await prisma.navigationItem.findMany({orderBy:{sortOrder:'asc'}});return <main className="admin-shell"><NavigationManager initial={items}/></main>}
