# Neogenra Digital Experience

Premium Next.js digital agency website + PostgreSQL CMS + Visual Builder for Neogenra.

## Stack

- Next.js App Router + React + TypeScript
- Prisma ORM 7
- Neon PostgreSQL (pooled runtime + direct migration URL)
- Vercel deployment
- Vercel Blob media storage
- Zod validation
- Secure custom session authentication
- TOTP MFA for administrators

## Local development

```powershell
npm install
npm run db:generate
npm run dev
```

Create `.env` from `.env.example` first. The Prisma CLI uses `DIRECT_URL`; application runtime uses the pooled `DATABASE_URL`.

## Verification

```powershell
npm run preflight
npm run typecheck
npm run lint
npm run build
npm run security:headers
```

## Database

Development migration:

```powershell
npm run db:dev
```

Production deployment:

```powershell
npm run db:migrate
npm run db:seed
```

Create the first administrator:

```powershell
npm run db:create-admin
```

## Vercel

The project has a `vercel-build` script:

```text
prisma migrate deploy && prisma generate && next build
```

Configure `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SITE_URL`, `IP_HASH_SALT`, `APP_ENCRYPTION_KEY`, `CRON_SECRET`, and the Vercel Blob environment required for local uploads. Never commit secrets.

See `VERCEL-NEON-SETUP.md` for the exact production setup sequence.

## CMS capabilities

- Visual page builder with nested layouts
- Draft/review/publish states
- Reusable templates
- Pages, projects/case studies, services, team, testimonials
- Insights/articles with authors, categories and SEO
- Media library with Vercel Blob uploads
- Navigation manager
- Global settings and design-system settings
- Redirect manager
- Leads
- Revisions and rollback
- Draft preview
- User/role management
- Audit log
- Optional TOTP MFA

## Security baseline

- HttpOnly `__Host-` session cookie
- CSRF double-submit token + origin validation
- Password hashing with bcrypt
- Login lockout
- Rate limiting with scheduled cleanup
- RBAC on admin APIs
- MIME/size validation for uploads
- Encrypted MFA secrets
- CSP, HSTS and security headers in production
- No secrets in source control

## Verification note

The archive is source-complete for Phases 7–9. The assembly environment could not complete npm dependency downloads, so dependency-backed `prisma generate`, TypeScript, ESLint and Next production-build results are intentionally not claimed as passed. Run `npm install` on Windows, then run the verification commands above before pushing the final lockfile to GitHub.
