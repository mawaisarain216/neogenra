# Neogenra security baseline

- PostgreSQL only in production; never store production content in local SQLite.
- Passwords are bcrypt hashes; never store plaintext credentials.
- Admin sessions use opaque random tokens stored only as SHA-256 hashes in PostgreSQL and an HttpOnly Secure `__Host-` cookie.
- Enforce role-based authorization on every mutation/API route; UI hiding is not authorization.
- Add rate limiting/WAF at deployment, strict CSP/security headers, input validation with Zod, upload MIME/size validation, and CSRF protection for state-changing browser requests.
- Keep secrets in Vercel environment variables, never Git.
- Audit every login, content mutation, publish, delete and settings change.
- Use least-privilege database credentials and automated backups.
- Run dependency audit, TypeScript check, lint, production build, and authenticated smoke tests before every release.
