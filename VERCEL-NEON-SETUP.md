# Vercel + Neon production setup

This project is prepared for a Neon PostgreSQL database connected to Vercel.

## 1. Push the repository

Push this project to the `main` branch of the GitHub repository.

## 2. Create/link the Vercel project

In Vercel, import the GitHub repository. Use Node 22.x.

## 3. Add Neon PostgreSQL

Use Vercel's Neon/Postgres integration or connect an existing Neon project. The application expects two PostgreSQL URLs:

- `DATABASE_URL`: pooled Neon connection for application runtime.
- `DIRECT_URL`: direct Neon connection for Prisma CLI/migrations.

Prisma's current Neon guidance recommends the pooled URL for runtime and the direct URL for Prisma CLI commands.

## 4. Vercel environment variables

Add these to **Production** and, where useful, Preview:

```text
DATABASE_URL=your-neon-pooled-connection
DIRECT_URL=your-neon-direct-connection
NEXT_PUBLIC_SITE_URL=https://neogenra.com
IP_HASH_SALT=<random-long-secret>
APP_ENCRYPTION_KEY=<64-hex-characters>
CRON_SECRET=<random-long-secret>
BLOB_READ_WRITE_TOKEN=<provided-by-vercel-blob-if-token-based-upload-is-used>
```

Do not put actual values in GitHub.

## 5. Generate secrets on Windows PowerShell

```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
($bytes | ForEach-Object { $_.ToString('x2') }) -join ''
```

Use a different random value for `IP_HASH_SALT`, `APP_ENCRYPTION_KEY`, and `CRON_SECRET`.

## 6. Local environment

Create `.env` from `.env.example` and paste the same Neon URLs/secrets. Never commit `.env`.

## 7. Install and generate

```powershell
npm install
npx prisma generate
```

## 8. Apply production migration

For the already-prepared schema:

```powershell
npx prisma migrate deploy
```

Then seed:

```powershell
npm run db:seed
```

## 9. Create the first admin

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` only in your local `.env`, then:

```powershell
npm run db:create-admin
```

Remove those bootstrap values afterward if you do not need them again.

## 10. Local production verification

```powershell
npm run typecheck
npm run lint
npm run build
```

## 11. Vercel deployment

The project contains a `vercel-build` script:

```text
prisma migrate deploy → prisma generate → next build
```

So Vercel can apply pending migrations before building the application.

## 12. Post-deploy verification

Check:

- `/api/health`
- `/`
- `/work`
- `/services`
- `/insights`
- `/contact`
- `/admin/login`
- admin CMS save/publish
- media upload
- article publishing
- database persistence after a new deployment

## 13. Media

Vercel Blob is used for persistent production media. Do not store uploads in the Next.js filesystem because Vercel functions do not provide a durable local upload directory.

## 14. Backups and monitoring

Before launch, configure database backups/retention in the selected Neon plan and enable Vercel project monitoring/logs. Keep production and preview databases separated when possible.
