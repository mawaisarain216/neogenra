import WebsiteDesignStudio from '@/components/admin/WebsiteDesignStudio'
import { getSiteDesign } from '@/lib/site-design'

export default async function DesignSystem() {
  const design = await getSiteDesign()
  return <WebsiteDesignStudio initial={design} />
}
