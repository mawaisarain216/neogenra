import styles from './login.module.css'

const DEFAULT_EMAIL = (process.env.ADMIN_EMAIL || 'superadmin@neogenra.com').trim().toLowerCase()

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {}
  const error = params.error
  const message = error === 'rate'
    ? 'Too many attempts. Please wait a few minutes and try again.'
    : error === 'invalid'
      ? 'The credentials were not accepted. The configured Super Admin account is bootstrapped automatically on its first successful login.'
      : null

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />
      <section className={styles.shell}>
        <aside className={styles.intro}>
          <div className={styles.brand}><span className={styles.mark}>N</span><span>NEOGENRA <b>CONTROL</b></span></div>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}>PRIVATE WORKSPACE / SUPER ADMIN</p>
            <h1>Run the<br /><em>experience.</em></h1>
            <p>Manage content, design, publishing, media, leads and the complete Neogenra digital system from one control center.</p>
          </div>
          <div className={styles.meta}><span>SECURE SESSION</span><span>8 HOURS</span></div>
        </aside>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div><span className={styles.kicker}>AUTHENTICATION</span><h2>Welcome back.</h2></div>
            <span className={styles.live}><i /> LIVE</span>
          </div>

          {message && <div className={styles.error} role="alert">{message}</div>}

          <div className={styles.credentials}>
            <div><span>SUPER ADMIN EMAIL</span><strong>{DEFAULT_EMAIL}</strong></div>
            <div><span>SUPER ADMIN PASSWORD</span><strong>Use the configured ADMIN_PASSWORD from your deployment environment.</strong></div>
          </div>

          <form method="post" action="/api/auth/login" className={styles.form}>
            <label><span>Email</span><input name="email" type="email" autoComplete="username" defaultValue={DEFAULT_EMAIL} required /></label>
            <label><span>Password</span><input name="password" type="password" autoComplete="current-password" placeholder="Enter the configured Super Admin password" required /></label>
            <button type="submit">Enter Control Center <b>↗</b></button>
          </form>

          <div className={styles.note}><span className={styles.shield}>✓</span><p>No authenticator field is shown. The Super Admin bootstrap uses only the configured email and password; MFA can be added later as a deliberate security setting.</p></div>
          <footer><span>NEOGENRA / ADMIN</span><span>AUTHORIZED ACCESS ONLY</span></footer>
        </div>
      </section>
    </main>
  )
}
