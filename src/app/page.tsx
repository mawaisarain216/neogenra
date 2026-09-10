import { getCmsPage } from '@/lib/cms-page'
import { RenderBlocks } from '@/lib/blocks'
import CinematicHero from '@/components/visual/CinematicHero'
import { getSiteDesign } from '@/lib/site-design'

export default async function Home() {
  const [cms, design] = await Promise.all([getCmsPage('home'), getSiteDesign()])
  return <main><CinematicHero design={design}/>{cms ? <div className="site-container px-6" style={{maxWidth:design.layout.container,margin:'0 auto',paddingBottom:design.layout.sectionSpace,paddingTop:design.layout.sectionSpace}}><RenderBlocks blocks={cms.content}/></div> : <section className="site-container px-6 py-32" style={{maxWidth:design.layout.container,margin:'0 auto'}}><p className="eyebrow">{design.brand.tagline}</p><h2 className="section-title">Publish the homepage from the Visual Builder.</h2><p className="mt-6 max-w-2xl muted">Create and publish the home page in the admin builder. The public experience is intentionally CMS-first so content and structure do not require code changes.</p></section>}</main>
}
