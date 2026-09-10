'use client'

import { useEffect, useState } from 'react'
import { Check, Eye, Loader2, Palette, Sparkles } from 'lucide-react'

const themes = [
  { id:'obsidian', name:'Obsidian Atelier', tag:'Cinematic / dark', description:'Spatial, premium and cinematic. The flagship Neogenra system.', swatches:['#070708','#f5f5f2','#7470ff'] },
  { id:'editorial', name:'Editorial House', tag:'Print / art direction', description:'Warm paper, serif typography and magazine-like composition.', swatches:['#eeeae2','#151515','#a85b3a'] },
  { id:'signal', name:'Signal Lab', tag:'Tech / kinetic', description:'Dark technical surfaces with luminous signal accents and sharper rhythm.', swatches:['#050a0d','#effff7','#9dffd5'] },
  { id:'swiss', name:'Swiss Structure', tag:'Minimal / grid', description:'Bright, disciplined and architectural with strong typographic hierarchy.', swatches:['#f5f5f3','#111111','#d22f2f'] },
  { id:'aurora', name:'Aurora Spatial', tag:'Immersive / gradient', description:'Deep space, atmospheric light and a more expressive digital mood.', swatches:['#08070f','#f7f5ff','#d9cbff'] },
] as const

export default function ThemeSelector({ initialTheme }: { initialTheme: string }) {
  const [selected,setSelected]=useState(initialTheme)
  const [saving,setSaving]=useState(false)
  const [message,setMessage]=useState('')
  useEffect(()=>{document.documentElement.dataset.siteTheme=selected},[selected])
  async function apply(id:string){
    setSelected(id); setSaving(true); setMessage('')
    try {
      const csrf=await fetch('/api/admin/csrf',{cache:'no-store'}).then(r=>r.json()).then(x=>x.token)
      const res=await fetch('/api/admin/content/setting',{method:'POST',headers:{'Content-Type':'application/json','x-csrf-token':csrf},body:JSON.stringify({key:'design.theme',value:id})})
      if(!res.ok){setMessage('Could not save this theme.');return}
      document.documentElement.dataset.siteTheme=id; setMessage('Theme applied ✓')
    } catch { setMessage('Could not save this theme.') } finally { setSaving(false) }
  }
  return <div className="theme-library">
    <div className="theme-library-head"><div><div className="theme-eyebrow"><Palette size={13}/> PUBLIC DESIGN LIBRARY</div><h1>Choose the system.<br/><em>Keep the content.</em></h1><p>Five complete art directions share the same CMS, pages and builder. Switching the theme changes the visual language without touching your content.</p></div><div className="theme-status"><span/><strong>{message || 'Live preview enabled'}</strong></div></div>
    <div className="theme-grid">{themes.map(theme=><article key={theme.id} className={`theme-card ${selected===theme.id?'selected':''}`} onClick={()=>apply(theme.id)}>
      <div className={`theme-preview theme-preview-${theme.id}`}><div className="theme-preview-nav"><b>N</b><span>NEOGENRA</span><i/></div><div className="theme-preview-copy"><small>{theme.tag}</small><strong>{theme.id==='editorial'?'Ideas with a point of view.':theme.id==='swiss'?'Make it clear. Make it matter.':theme.id==='signal'?'Build what moves the signal.':theme.id==='aurora'?'Shape what comes next.':'Ideas that become impossible to ignore.'}</strong><u>Explore work →</u></div><div className="theme-preview-orb"/></div>
      <div className="theme-card-body"><div><div className="theme-card-title">{theme.name}</div><div className="theme-card-tag">{theme.tag}</div></div>{selected===theme.id?<span className="theme-check"><Check size={14}/></span>:<button className="theme-use"><Eye size={13}/> Preview</button>}</div>
      <p>{theme.description}</p><div className="theme-swatches">{theme.swatches.map(s=><span key={s} style={{background:s}}/>)}</div>
    </article>)}</div>
    <div className="theme-note"><Sparkles size={15}/><span><strong>Safe by design.</strong> The theme selector writes only the <code>design.theme</code> site setting. Existing page content, media, users and builder data remain untouched.</span>{saving&&<Loader2 size={15} className="spin"/>}</div>
  </div>
}
