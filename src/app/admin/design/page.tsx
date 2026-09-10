import { prisma } from '@/lib/prisma'
import ThemeSelector from '@/components/admin/ThemeSelector'

export default async function DesignSystem() {
  let theme = 'obsidian'
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'design.theme' }, select: { value: true } })
    if (typeof setting?.value === 'string') theme = setting.value
  } catch {}
  return <ThemeSelector initialTheme={['obsidian','editorial','signal','swiss','aurora'].includes(theme) ? theme : 'obsidian'} />
}
