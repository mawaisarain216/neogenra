'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronLeft, Loader2, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'

const longFields = new Set(['description', 'excerpt', 'shortDescription', 'bio', 'quote', 'body', 'content', 'gallery', 'socials', 'tags', 'value'])
const jsonFields = new Set(['content', 'gallery', 'socials', 'tags', 'value'])
const booleanFields = new Set(['noIndex', 'featured', 'published', 'enabled', 'openInNewTab'])
const numberFields = new Set(['sortOrder'])
const statusFields = new Set(['status'])
const statusValues = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']

type Props = {
  entity: string
  title: string
  fields: Record<string, string>
  id?: string
  backHref?: string
}

function prettyLabel(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, x => x.toUpperCase())
}

function parseValue(key: string, value: string) {
  if (booleanFields.has(key)) return value === 'true'
  if (numberFields.has(key)) return Number(value || 0)
  if (jsonFields.has(key)) return JSON.parse(value || 'null')
  return value
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120)
}

export default function AdminEditor({ entity, title, fields, id, backHref = `/admin/${entity}s` }: Props) {
  const [data, setData] = useState(fields)
  const [csrf, setCsrf] = useState('')
  const [state, setState] = useState('')
  const [error, setError] = useState('')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    fetch('/api/admin/csrf', { cache: 'no-store' })
      .then(r => r.json())
      .then(x => setCsrf(x.token || ''))
      .catch(() => setError('Could not initialize the security token. Refresh and try again.'))
  }, [])

  const keys = Object.keys(data)

  function change(key: string, value: string) {
    setData(current => {
      const next = { ...current, [key]: value }
      if (key === 'title' && current.slug === 'new-project') next.slug = slugify(value)
      return next
    })
    setDirty(true)
    setState('')
    setError('')
  }

  async function save() {
    if (!csrf) return
    setState('Saving…')
    setError('')
    try {
      const parsed: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) parsed[key] = parseValue(key, value)
      const payload = id ? { id, data: parsed } : parsed
      const res = await fetch(`/api/admin/content/${entity}`, {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Save failed')
      setDirty(false)
      setState(id ? 'Saved' : 'Created')
      if (!id && body.item?.id) window.location.assign(`/admin/${entity === 'page' ? 'pages' : entity === 'article' ? 'articles' : `${entity}s`}/${body.item.id}`)
    } catch (e) {
      setError((e as Error).message)
      setState('')
    }
  }

  return (
    <main className="admin-shell">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">CMS / {entity}</div>
            <h1 className="mt-2 text-4xl font-bold tracking-[-.05em]">{title}</h1>
            <p className="mt-2 text-sm text-white/40">Structured content, publishing state and SEO metadata are stored in PostgreSQL.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={backHref} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/65 hover:text-white"><ChevronLeft size={15} className="mr-1 inline" />Back</Link>
            <button onClick={save} disabled={!csrf || state === 'Saving…' || !dirty} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40">
              {state === 'Saving…' ? <Loader2 size={15} className="mr-2 inline animate-spin" /> : state ? <Check size={15} className="mr-2 inline" /> : <Save size={15} className="mr-2 inline" />}
              {state || (dirty ? 'Save changes' : 'Saved')}
            </button>
          </div>
        </div>

        {error && <div className="mb-5 rounded-2xl border border-red-300/20 bg-red-300/5 px-4 py-3 text-sm text-red-100">{error}</div>}

        <div className="grid gap-5">
          {keys.map(key => {
            const value = data[key]
            const isBoolean = booleanFields.has(key)
            const isNumber = numberFields.has(key)
            const isStatus = statusFields.has(key)
            const isLong = longFields.has(key)
            const isJson = jsonFields.has(key)
            return (
              <section key={key} className="rounded-[1.5rem] border border-white/10 bg-white/[.025] p-5 md:p-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="text-xs font-semibold uppercase tracking-[.16em] text-white/45">{prettyLabel(key)}</label>
                  {isJson && <span className="text-[10px] uppercase tracking-[.14em] text-white/25">JSON</span>}
                </div>
                {isBoolean ? (
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-white/75">
                    <input type="checkbox" checked={value === 'true'} onChange={e => change(key, String(e.target.checked))} className="h-4 w-4" />
                    Enable {prettyLabel(key).toLowerCase()}
                  </label>
                ) : isStatus ? (
                  <select value={value} onChange={e => change(key, e.target.value)} className="admin-input">
                    {statusValues.map(x => <option key={x} value={x}>{x}</option>)}
                  </select>
                ) : isJson || isLong ? (
                  <textarea value={value} onChange={e => change(key, e.target.value)} spellCheck={!isJson} className="admin-input min-h-32 resize-y font-mono text-sm" />
                ) : (
                  <input value={value} onChange={e => change(key, e.target.value)} type={isNumber ? 'number' : key.toLowerCase().includes('url') || key.toLowerCase().includes('image') ? 'url' : 'text'} className="admin-input" />
                )}
                {key === 'slug' && <p className="mt-2 text-xs text-white/30">Lowercase URL-safe identifier. Changing a published slug should be paired with a redirect.</p>}
                {key === 'content' && <p className="mt-2 flex items-center gap-2 text-xs text-white/30"><Sparkles size={12}/> For visual page layouts, use the Visual Builder instead of editing raw JSON.</p>}
              </section>
            )
          })}
        </div>
      </div>
    </main>
  )
}
