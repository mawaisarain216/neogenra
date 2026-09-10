'use client'

import { useEffect, useState } from 'react'
import { Check, Loader2, Save } from 'lucide-react'

type Setting = { id: string; key: string; value: unknown }
const fields = [
  ['brand.logoText', 'Brand logo text'],
  ['brand.tagline', 'Brand tagline'],
  ['site.title', 'Site title'],
  ['site.description', 'Site description'],
  ['contact.email', 'Contact email'],
  ['contact.phone', 'Contact phone'],
  ['social.instagram', 'Instagram URL'],
  ['social.linkedin', 'LinkedIn URL'],
  ['social.facebook', 'Facebook URL'],
]

export default function SiteSettingsForm() {
  const [ids, setIds] = useState<Record<string, string>>({})
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(([key]) => [key, ''])))
  const [csrf, setCsrf] = useState('')
  const [state, setState] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/content/setting?take=100', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/admin/csrf', { cache: 'no-store' }).then(r => r.json()),
    ]).then(([settings, token]) => {
      const nextIds: Record<string, string> = {}
      const nextValues: Record<string, string> = { ...values }
      for (const item of (settings.items || []) as Setting[]) {
        if (!(item.key in nextValues)) continue
        nextIds[item.key] = item.id
        nextValues[item.key] = typeof item.value === 'string' ? item.value : JSON.stringify(item.value)
      }
      setIds(nextIds)
      setValues(nextValues)
      setCsrf(token.token || '')
    }).catch(() => setError('Could not load settings.'))
  }, [])

  async function save() {
    if (!csrf) return
    setState('Saving…')
    setError('')
    try {
      for (const [key] of fields) {
        const payload = { key, value: values[key] }
        const res = await fetch('/api/admin/content/setting', {
          method: ids[key] ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
          body: JSON.stringify(ids[key] ? { id: ids[key], data: { value: values[key] } } : payload),
        })
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.error || `Failed to save ${key}`)
        if (!ids[key] && body.item?.id) setIds(current => ({ ...current, [key]: body.item.id }))
      }
      setState('Saved')
    } catch (e) { setError((e as Error).message); setState('') }
  }

  return <main className="admin-shell"><div className="mx-auto max-w-5xl"><div className="mb-8"><p className="eyebrow">OPERATIONS / GLOBAL</p><h1 className="mt-2 text-5xl font-bold tracking-[-.06em]">Site settings</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">Edit the brand and contact values used across the public experience. Changes are persisted in PostgreSQL and audited.</p></div>{error && <div className="mb-5 rounded-2xl border border-red-300/20 bg-red-300/5 px-4 py-3 text-sm text-red-100">{error}</div>}<div className="grid gap-4">{fields.map(([key,label]) => <label key={key} className="rounded-[1.4rem] border border-white/10 bg-white/[.025] p-5"><span className="mb-2 block text-xs font-semibold uppercase tracking-[.16em] text-white/40">{label}</span><input value={values[key]} onChange={e => setValues(current => ({ ...current, [key]: e.target.value }))} className="admin-input" placeholder={key}/></label>)}</div><div className="mt-6 flex justify-end"><button onClick={save} disabled={!csrf || state === 'Saving…'} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black disabled:opacity-40">{state === 'Saving…' ? <><Loader2 size={15} className="mr-2 inline animate-spin"/>Saving…</> : state === 'Saved' ? <><Check size={15} className="mr-2 inline"/>Saved</> : <><Save size={15} className="mr-2 inline"/>Save settings</>}</button></div></div></main>
}
