import fs from 'node:fs'
import path from 'node:path'
const root=process.cwd()
const forbidden=['.env','.env.local','.env.production']
for(const f of forbidden){if(fs.existsSync(path.join(root,f))){console.error(`Security check failed: ${f} exists in the project tree`);process.exit(1)}}
const source=fs.readdirSync(path.join(root,'src'),{recursive:true}).filter(x=>String(x).endsWith('.ts')||String(x).endsWith('.tsx'))
let bad=false
for(const f of source){const s=fs.readFileSync(path.join(root,'src',f),'utf8');if(s.includes('dangerouslySetInnerHTML')){console.error(`Security check failed: dangerouslySetInnerHTML in ${f}`);bad=true}}
if(bad)process.exit(1)
console.log('Security source check PASS')
