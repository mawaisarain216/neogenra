import { prisma } from '@/lib/prisma'
import HeaderClient from '@/components/HeaderClient'
import { getSiteDesign } from '@/lib/site-design'

const fallback=[['Work','/work'],['Services','/services'],['Industries','/industries'],['About','/about'],['Team','/team'],['Lab','/lab'],['Insights','/insights']]
export default async function SiteHeader(){
 let links=fallback
 try { const rows=await prisma.navigationItem.findMany({where:{enabled:true,parentId:null},orderBy:{sortOrder:'asc'}}); if(rows.length) links=rows.map(x=>[x.label,x.href]) } catch {}
 const design=await getSiteDesign()
 return <HeaderClient links={links} design={design}/>
}
