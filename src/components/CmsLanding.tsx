import { getCmsPage } from '@/lib/cms-page'
import { RenderBlocks } from '@/lib/blocks'
import { getSiteDesign } from '@/lib/site-design'

export default async function CmsLanding({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const [page,design]=await Promise.all([getCmsPage(slug),getSiteDesign()])
  if (!page) return <main className="site-container px-6 py-40" style={{maxWidth:design.layout.container,margin:'0 auto'}}><p className="eyebrow">NEOGENRA</p><h1 className="section-title">{fallbackTitle}</h1><p className="cms-lede">Create and publish this page from the admin Visual Builder.</p></main>
  return <main><div className="site-container px-6" style={{maxWidth:design.layout.container,margin:'0 auto',paddingBottom:design.layout.sectionSpace}}><RenderBlocks blocks={page.content}/></div></main>
}
