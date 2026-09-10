'use client'

import { useEffect, useState } from 'react'
import { LockKeyhole, Loader2, ShieldCheck } from 'lucide-react'
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

  return <main className={styles.loginPage}><div className={styles.loginFrame}><div className={styles.loginAside}><div className={styles.brandMark}>N</div><div><div className={styles.eyebrow}>NEOGENRA / CONTROL</div><h1>Second factor.<br/><em>Zero guesswork.</em></h1><p>Your password is accepted. Confirm the six-digit code from your authenticator app to continue.</p></div></div><section className={styles.loginCard}><div className={styles.cardHeader}><span className={styles.cardIcon}><ShieldCheck size={19}/></span><div><strong>Authenticator verification</strong><span>Protected administrator session</span></div></div><form onSubmit={verify} className={styles.form}><label><span>6-digit code</span><div className={styles.passwordWrap}><LockKeyhole size={16}/><input autoFocus inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000"/></div></label>{error && <div className={styles.error}>{error}</div>}<button className={styles.submit} disabled={busy || !csrf || code.length !== 6}>{busy ? <><Loader2 size={16} className="animate-spin"/> Verifying…</> : <>Verify & continue <ShieldCheck size={16}/></>}</button></form><p className={styles.footerNote}>If you lost access to the authenticator device, use your recovery procedure rather than disabling MFA through the public site.</p></section></div></main>
}
