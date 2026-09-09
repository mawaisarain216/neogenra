# Neogenra Phase 6 — Spatial Experience + Production Readiness

Phase 6 preserves Phases 1–5 and adds the cinematic visual layer plus CI/preflight tooling.

## Visual system
- Cinematic hero with procedural canvas particles
- CSS 3D transparent prism with six faces and orbital rings
- Pointer-reactive hero lighting/positioning
- Scroll reveal system using IntersectionObserver
- Reduced-motion support
- Kinetic marquee builder block
- 3D scene builder block with live preview
- Responsive visual treatment for mobile/tablet/desktop
- No external WebGL dependency required for the core visual scene

## Production readiness
- GitHub Actions CI: install, Prisma generate, typecheck, lint, build
- `npm run preflight` verifies required architecture and core Prisma models
- `npm run verify` runs preflight + typecheck + lint + production build
- HSTS is production-only so localhost development is not polluted by HSTS
- Additional security headers retained

## Verification status
- Source files present: PASS
- Required Prisma models present: PASS
- Package dependency manifest: PASS
- npm install: BLOCKED in this execution environment by network/install timeout
- Full TypeScript/lint/build: BLOCKED until dependencies install
- Browser E2E: BLOCKED until dependencies install and a browser runtime is available

Never treat the blocked checks above as successful.
