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

Lint, type check and production build pass. Not yet reviewed in a real browser or on devices,
and not Lighthouse-tested. See `docs/design-decisions.md` for known limits.
