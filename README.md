# PockIT Engineers — Marketing Website

Public marketing site for **PockIT Engineers** (on-demand IT services), built with:
- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**

---

## Tech Stack and Runtime

- **Node.js:** `>=24` (see `package.json` + `.nvmrc`)
- **Package manager:** npm
- **Linting:** ESLint 9 (`eslint.config.mjs`)
- **Build tooling:** Next.js + PostCSS + Tailwind

---

## Project Structure

### Root

- `package.json` — scripts, dependencies, engine constraints.
- `package-lock.json` — locked dependency tree.
- `.nvmrc` — local Node version hint.
- `next.config.mjs` — Next runtime config (image formats/cache headers, strict mode behavior).
- `tailwind.config.ts` — Tailwind theme extension/config.
- `postcss.config.mjs` — PostCSS pipeline.
- `tsconfig.json` — TypeScript compiler config.
- `eslint.config.mjs` — ESLint flat config.
- `.gitignore` — ignored files.
- `README.md` — this file.

### App Router (`src/app`)

- `src/app/layout.tsx` — root HTML shell, global metadata/icons, theme bootstrap script.
- `src/app/page.tsx` — home page entry, mounts landing shell.
- `src/app/loading.tsx` — route loading boundary (currently returns `null`).
- `src/app/globals.css` — global styles and theme CSS variable tokens.

#### Route groups/pages
- `src/app/about/layout.tsx` — metadata for About Us.
- `src/app/about/page.tsx` — About Us (company story + “Join as a Technician” section).
- `src/app/become-a-technician/layout.tsx` — metadata for technician onboarding page.
- `src/app/become-a-technician/page.tsx` — **Join as a Technician** at `/become-a-technician` (legacy `/expert` redirects here).
- `src/app/privacy-policy/page.tsx` — privacy policy page.
- `src/app/terms/page.tsx` — terms and conditions page.

### Components

#### Landing components (`src/components/landing`)
- `AppShell.tsx` — main landing composition and page fade-in container.
- `Header.tsx` — top nav, theme toggle, responsive menu, theme-aware logo.
- `Hero.tsx` — hero section, CTAs, city pills, motion effects.
- `ServiceGrid.tsx` — service cards section.
- `HowItWorks.tsx` — process walkthrough.
- `PockITPromise.tsx` — trust/safety proposition section.
- `KPIStats.tsx` — KPI counter/stat section.
- `TestimonialsSection.tsx` — testimonial bento grid and stat cards.
- `FAQ.tsx` — FAQ accordion/content.
- `DownloadBand.tsx` — app download CTA band.
- `FloatingDownload.tsx` — floating app store CTA.
- `StickyBookCTA.tsx` — sticky booking CTA.
- `Footer.tsx` — footer links, social links, theme-aware logo.
- `ScrollProgress.tsx` — reading/scroll progress indicator.
- `SectionPill.tsx` — reusable section label chip.
- `ThemeSync.tsx` — applies persisted `data-theme` on routes that use it.
- `BrandLoader.tsx` — branded loader component (available in codebase; not currently mounted in `AppShell`).

#### Expert components (`src/components/expert`)
- `ExpertHero.tsx` — full technician page: hero (Hinglish + value strip), stats, section nav, service categories, how it works/join, CTA band, animated FAQ accordion.

### Shared constants and hooks

- `src/constants/copy.ts` — primary content source: landing copy, footer/nav, `EXPERT_PAGE_UC` (technician page sections), `EXPERT_HERO` / `EXPERT_BELOW`, FAQ items, etc.
- `src/hooks/useScrollTop.ts` — scroll observer hook.
- `src/hooks/useIsMobile.ts` — mobile viewport detection hook.

### Static assets (`public`)

- `public/logo.png` — site icon/favicon asset.
- `public/qr-linktree.png` — QR asset used in download sections.
- `public/images/` — logos, illustrations, hero/service artwork.
  - Brand/logo assets: `OG Logo.svg`, `blue_brand_logo.svg`, `logo-footer.svg`, etc.
  - Landing illustrations/photos: `tanya.jpg`, `hero_phone.png`, service images, KPI/response illustrations.
- `public/avatars/` — cartoon-style rating avatars on the technician page (`cartoon-1.svg`, etc.).

### Docs

- `docs/CSS.md` — theme/token reference and styling conventions.

---

## How Content Is Managed

Most landing copy and stats are centralized in:
- `src/constants/copy.ts`

If you need to update text like KPI numbers, city names, labels, button text, FAQ items, or technician-page copy, start there first. Technician WhatsApp number lives in `EXPERT_HERO.ctaHref`; the default prefilled message is set in `ExpertHero.tsx` (`handleJoinClick`).

---

## Theming

The site uses CSS variables with `data-theme` on `<html>`.
- Theme tokens: `src/app/globals.css`
- Runtime theme syncing: `Header.tsx`, `Footer.tsx`, `ThemeSync.tsx`
- Persisted preference key: `localStorage["pockit-theme"]`

---

## Local Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

- `npm run dev` — start dev server.
- `npm run build` — production build.
- `npm run start` — run production server.
- `npm run lint` — lint codebase.

---

## Deployment Notes

This is a standard Next.js app; deploy built output (not dev server).

### Vercel (recommended)
1. Import the repo in Vercel.
2. Framework preset: Next.js (auto-detected).
3. Use default build/start (`npm run build`, `npm run start`).
4. Ensure Node version is compatible with `>=24`.

### Self-hosted Node
1. `npm ci`
2. `npm run build`
3. `npm run start`
4. Put behind Nginx/Caddy with TLS and process manager (PM2/systemd).

---

## Security

- No runtime secrets are required for current static marketing flow.
- If secrets are introduced later, use `.env.local` and never commit real credentials.

---

## License

Proprietary. Confirm usage/redistribution rights with PockIT Engineers.
