import { prisma } from '@/lib/prisma'
import HeaderClient from '@/components/HeaderClient'

const fallback=[['Work','/work'],['Services','/services'],['Industries','/industries'],['About','/about'],['Team','/team'],['Lab','/lab'],['Insights','/insights']]
export default async function SiteHeader(){
 let links=fallback
 try { const rows=await prisma.navigationItem.findMany({where:{enabled:true,parentId:null},orderBy:{sortOrder:'asc'}}); if(rows.length) links=rows.map(x=>[x.label,x.href]) } catch {}
 let logo='NEOGENRA®'
 try { const setting=await prisma.siteSetting.findUnique({where:{key:'brand.logoText'}}); if(typeof setting?.value==='string'&&setting.value) logo=setting.value } catch {}
 return <HeaderClient links={links} logo={logo}/>
}
