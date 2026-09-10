'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2, Save } from 'lucide-react'

const fields = [
  ['site.title', 'Default site title'],
  ['site.description', 'Default meta description'],
  ['site.url', 'Canonical site URL'],
  ['site.ogImage', 'Default Open Graph image URL'],
]

export default function SeoSettingsForm() {
  const [ids, setIds] = useState<Record<string, string>>({})
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(([key]) => [key, ''])))
  const [csrf, setCsrf] = useState('')
  const [state, setState] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetch('/api/admin/content/setting?take=100', { cache: 'no-store' }).then(r => r.json()), fetch('/api/admin/csrf', { cache: 'no-store' }).then(r => r.json())]).then(([settings, token]) => {
      const nextIds: Record<string, string> = {}; const nextValues = { ...values }
      for (const item of settings.items || []) if (item.key in nextValues) { nextIds[item.key] = item.id; nextValues[item.key] = typeof item.value === 'string' ? item.value : JSON.stringify(item.value) }
      setIds(nextIds); setValues(nextValues); setCsrf(token.token || '')
    }).catch(() => setError('Could not load SEO settings.'))
  }, [])

  async function save() {
    setState('Saving…'); setError('')
    try {
      for (const [key] of fields) {
        const res = await fetch('/api/admin/content/setting', { method: ids[key] ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf }, body: JSON.stringify(ids[key] ? { id: ids[key], data: { value: values[key] } } : { key, value: values[key] }) })
        const body = await res.json().catch(() => ({})); if (!res.ok) throw new Error(body.error || `Failed to save ${key}`)
        if (!ids[key] && body.item?.id) setIds(current => ({ ...current, [key]: body.item.id }))
      }
      setState('Saved')
    } catch (e) { setError((e as Error).message); setState('') }
  }

  return <main className="admin-shell"><div className="mx-auto max-w-5xl"><div className="mb-8"><p className="eyebrow">OPERATIONS / SEARCH</p><h1 className="mt-2 text-5xl font-bold tracking-[-.06em]">SEO control</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">Global metadata is now editable instead of being hard-coded into the application shell. Page and project records still support their own SEO overrides.</p></div>{error&&<div className="mb-5 rounded-2xl border border-red-300/20 bg-red-300/5 px-4 py-3 text-sm text-red-100">{error}</div>}<div className="grid gap-4">{fields.map(([key,label])=><label key={key} className="rounded-[1.4rem] border border-white/10 bg-white/[.025] p-5"><span className="mb-2 block text-xs font-semibold uppercase tracking-[.16em] text-white/40">{label}</span><input value={values[key]} onChange={e=>setValues(current=>({...current,[key]:e.target.value}))} className="admin-input"/></label>)}</div><div className="mt-6 flex justify-end"><button onClick={save} disabled={!csrf||state==='Saving…'} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-40">{state==='Saving…'?<><Loader2 size={15} className="mr-2 inline animate-spin"/>Saving…</>:state==='Saved'?<><Check size={15} className="mr-2 inline"/>Saved</>:<><Save size={15} className="mr-2 inline"/>Save SEO</>}</button></div></div></main>
}
