import styles from './login.module.css'

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.noise} /><div className={`${styles.orbit} ${styles.orbitA}`} /><div className={`${styles.orbit} ${styles.orbitB}`} />
      <section className={styles.card}>
        <div className={styles.top}><span className={styles.mark}>N</span><span>NEOGENRA / ADMIN</span></div>
        <div className={styles.heading}><p>PRIVATE WORKSPACE</p><h1>Shape the<br /><em>experience.</em></h1><span>Secure access to your content, design system, publishing and growth operations.</span></div>
        <form method="post" action="/api/auth/login" className={styles.form}>
          <label><span>Email address</span><input name="email" type="email" autoComplete="username" placeholder="you@company.com" required /></label>
          <label><span>Password</span><input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required /></label>
          <label><span>Authenticator code <small>optional unless MFA is enabled</small></span><input name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" placeholder="6-digit code" /></label>
          <button type="submit">Enter control center <b>↗</b></button>
        </form>
        <footer><span>Protected workspace</span><span>NEOGENRA</span></footer>
      </section>
    </main>
  )
}
