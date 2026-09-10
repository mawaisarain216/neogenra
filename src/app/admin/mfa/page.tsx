'use client'

import { useEffect, useState } from 'react'
import { Loader2, ShieldCheck } from 'lucide-react'
import styles from '../login/login.module.css'

export default function MfaPage() {
  const [csrf, setCsrf] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/admin/csrf', { cache: 'no-store' }).then(r => r.json()).then(x => setCsrf(x.token || '')).catch(() => setError('Security token unavailable. Refresh the page.'))
  }, [])

  async function verify(event: React.FormEvent) {
    event.preventDefault()
    if (!csrf || code.length !== 6) return
    setBusy(true)
    setError('')
    const res = await fetch('/api/auth/mfa', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf }, body: JSON.stringify({ code }) })
    const body = await res.json().catch(() => ({}))
    if (res.ok) window.location.assign(body.redirect || '/admin')
    else { setError(body.error || 'Verification failed'); setBusy(false) }
  }

  return <main className={styles.page}><div className={styles.ambient}/><div className={styles.grid}/><div className={styles.shell}><div className={styles.intro}><div className={styles.brand}><span className={styles.mark}>N</span>NEOGENRA <b>CONTROL</b></div><div className={styles.introCopy}><p className={styles.eyebrow}>SECOND FACTOR</p><h1>Prove it.<br/><em>Then enter.</em></h1><p>Your password is accepted. Confirm the six-digit code from your authenticator app to continue.</p></div><div className={styles.meta}><span>IDENTITY</span><span>MFA / TOTP</span><span>8H SESSION</span></div></div><section className={styles.panel}><div className={styles.panelHead}><div><p className={styles.kicker}>Authenticator verification</p><h2>Unlock the workspace.</h2></div><div className={styles.live}><i/>SECURE</div></div><form onSubmit={verify} className={styles.form}><label><span>6-digit code</span><input autoFocus inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000"/></label>{error && <div className={styles.error}>{error}</div>}<button type="submit" disabled={busy || !csrf || code.length !== 6}>{busy ? <><Loader2 size={16} className="mr-2 inline animate-spin"/>Verifying…</> : <>Verify & continue <ShieldCheck size={16} className="ml-2 inline"/></>}</button></form><div className={styles.note}><span className={styles.shield}><ShieldCheck size={12}/></span><p>Use the current code from your authenticator app. If the device is lost, follow your recovery procedure instead of attempting to bypass MFA.</p></div></section></div></main>
}
