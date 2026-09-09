# Neogenra — Phase 7 to Phase 9

## Phase 7 — Production CMS & infrastructure

- PostgreSQL/Prisma production architecture prepared for Neon on Vercel.
- Full publishing collection for Insights/Articles.
- Article detail routes with SEO metadata and no-index support.
- Media library backed by Vercel Blob uploads.
- Admin user management and role controls.
- Draft preview route for authenticated admins.
- Revisions UI plus page/project/article rollback support.
- Redirect manager foundation.
- Global design-system settings foundation.
- Production seed content includes Neogenra services, team, testimonials, projects and starter insights.

## Phase 8 — Premium interactive experience

- Cinematic hero remains the dedicated experience layer.
- CMS home content is rendered below the cinematic hero.
- 3D scene and marquee blocks are seeded into the home composition.
- Existing CSS/canvas visual system remains dependency-light and reduced-motion aware.
- Case-study/project content remains editable through the builder and project CMS.

## Phase 9 — Security, performance and launch hardening

- Prisma 7-compatible generated client with Neon adapter.
- Runtime uses Neon's pooled connection; Prisma CLI uses DIRECT_URL.
- CSP and production security headers added.
- Secure session cookie, CSRF/origin checks, login lockout and rate limiting retained.
- Optional TOTP MFA for administrator accounts; secrets encrypted with APP_ENCRYPTION_KEY.
- Vercel Cron cleanup endpoint for rate-limit events.
- Vercel Blob upload validation: MIME allowlist and 25MB size limit.
- Audit events for user management, login, rollback and media uploads.
- CI uses Node 22 and npm ci.
- Production build command is `vercel-build`: migration deploy + Prisma generate + Next build.
- No secrets are stored in the repository.

## Important verification status

The source package has been statically inspected and `.mjs` syntax/preflight checks can be run without dependencies. A full dependency-backed typecheck, lint, Prisma generate/migration and Next production build must be run after `npm install` on the user's Windows machine because the build environment used to assemble this archive could not complete npm downloads.
