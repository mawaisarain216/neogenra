import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const required = [
  'package.json','prisma/schema.prisma','src/app/layout.tsx','src/app/page.tsx',
  'src/components/visual/CinematicHero.tsx','src/components/visual/ScrollEffects.tsx',
  'src/components/builder/VisualBuilder.tsx','src/lib/builder.ts','src/lib/blocks.tsx',
  '.env.example','.github/workflows/ci.yml'
]
const missing = required.filter((file) => !fs.existsSync(path.join(root,file)))
if (missing.length) { console.error('Preflight failed; missing:', missing.join(', ')); process.exit(1) }
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'))
for (const dep of ['next','react','react-dom','@prisma/client','@prisma/adapter-neon','@vercel/blob','bcryptjs','zod']) if (!pkg.dependencies?.[dep]) { console.error(`Preflight failed; dependency missing: ${dep}`); process.exit(1) }
const schema = fs.readFileSync(path.join(root,'prisma/schema.prisma'),'utf8')
for (const model of ['User','Session','Page','Project','Service','TeamMember','Testimonial','BuilderTemplate','NavigationItem','SiteSetting','MediaAsset','Lead','RateLimitEvent','Redirect','Revision','AuditLog','Article']) if (!schema.includes(`model ${model}`)) { console.error(`Preflight failed; Prisma model missing: ${model}`); process.exit(1) }
console.log(`Preflight PASS: ${required.length} required artifacts and ${17} core Prisma models detected.`)
