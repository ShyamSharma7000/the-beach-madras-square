# The Beach by Madras Square: design concept

An independent, interactive website concept for The Beach by Madras Square, Uthandi, Chennai.
It is **not** the official website. Do not present it as one without the venue's permission.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Motion for React.
Node 20.9 or newer is required (built and checked on Node 22).

## Run it

```bash
npm ci
npm run dev       # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

## Where things live

- `src/content/venues/the-beach.ts`: all venue facts, menu, gallery, occasions. One file to edit.
- `src/types/venue.ts`: the typed venue shape, reusable for other venues.
- `src/components/sections/`: page sections. `src/components/motion/`: hero scene, wave line.
- `src/lib/sky.ts`: the time-of-day colour model behind the hero slider.
- `src/fonts/`: self-hosted open-licence fonts (OFL).
- `docs/`: `content-review.md`, `asset-register.md`, `design-decisions.md`, `deployment.md`,
  `pitch-notes.md`.

## Content rules

Menu items only show as real when `verified: true`. Hours stay hidden until `hours` is set.
Nothing on the page is invented: no ratings, reviews, awards or booking confirmations.

## Environment variables

None required. See `.env.example`.

## Status

Checked on 17 Oct 2026 in headless Chromium: lint, type check, 35 unit tests, 56 end-to-end
tests (preview, unconfigured and launched modes) and a text-contrast check at 360, 390, 768,
1024 and 1440 px all pass. Lighthouse lab run on the launched build: mobile performance 89 to 91,
desktop 99, and 100 for accessibility, best practices and SEO. `npm audit --omit=dev` reports 0
vulnerabilities.

Not yet checked: real phones, mobile Safari, Android Chrome, a screen reader, and a real email
send (tests use a local stub). See `docs/launch-checklist.md` before going live.
