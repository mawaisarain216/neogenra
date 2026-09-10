'use client'

import { useEffect, useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'

type Redirect = { id: string; fromPath: string; toPath: string; statusCode: number; enabled: boolean }

export default function RedirectManager() {
  const [items, setItems] = useState<Redirect[]>([])
  const [fromPath, setFromPath] = useState('')
  const [toPath, setToPath] = useState('')
  const [statusCode, setStatusCode] = useState('301')
  const [csrf, setCsrf] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    const [list, token] = await Promise.all([fetch('/api/admin/content/redirect?take=100', { cache: 'no-store' }).then(r => r.json()), fetch('/api/admin/csrf', { cache: 'no-store' }).then(r => r.json())])
    setItems(list.items || [])
    setCsrf(token.token || '')
  }
  useEffect(() => { load().catch(() => setError('Could not load redirects.')) }, [])

  async function create() {
    if (!fromPath.startsWith('/') || !toPath) return setError('Use a source path beginning with / and a destination.')
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/admin/content/redirect', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf }, body: JSON.stringify({ fromPath, toPath, statusCode: Number(statusCode), enabled: true }) })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Could not create redirect')
      setItems(current => [body.item, ...current]); setFromPath(''); setToPath('')
    } catch (e) { setError((e as Error).message) }
    setBusy(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this redirect?')) return
    const res = await fetch(`/api/admin/content/redirect?id=${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'x-csrf-token': csrf } })
    if (res.ok) setItems(current => current.filter(x => x.id !== id))
  }

  return <main className="admin-shell"><div className="mx-auto max-w-6xl"><div className="mb-8"><p className="eyebrow">OPERATIONS / ROUTING</p><h1 className="mt-2 text-5xl font-bold tracking-[-.06em]">Redirects</h1><p className="mt-2 text-sm text-white/40">Protect SEO equity when published URLs change.</p></div>{error&&<div className="mb-5 rounded-2xl border border-red-300/20 bg-red-300/5 px-4 py-3 text-sm text-red-100">{error}</div>}<section className="rounded-[1.5rem] border border-white/10 bg-white/[.025] p-5"><div className="grid gap-3 md:grid-cols-[1fr_1fr_110px_auto]"><input value={fromPath} onChange={e=>setFromPath(e.target.value)} placeholder="/old-url" className="admin-input"/><input value={toPath} onChange={e=>setToPath(e.target.value)} placeholder="/new-url" className="admin-input"/><select value={statusCode} onChange={e=>setStatusCode(e.target.value)} className="admin-input"><option>301</option><option>302</option><option>307</option><option>308</option></select><button onClick={create} disabled={busy||!csrf} className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black disabled:opacity-40">{busy?<Loader2 size={15} className="animate-spin"/>:<><Plus size={15} className="mr-1 inline"/>Add</>}</button></div></section><div className="mt-5 grid gap-2">{items.map(x=><div key={x.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[.02] px-4 py-3 text-sm"><div><strong>{x.fromPath}</strong><span className="mx-2 text-white/25">→</span><span className="text-white/55">{x.toPath}</span></div><div className="flex items-center gap-4 text-xs text-white/35"><span>{x.statusCode}</span><span>{x.enabled?'ENABLED':'DISABLED'}</span><button onClick={()=>remove(x.id)} className="text-white/40 hover:text-red-200" aria-label={`Delete ${x.fromPath}`}><Trash2 size={15}/></button></div></div>)}{!items.length&&<div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/35">No redirects configured.</div>}</div></div></main>
}
