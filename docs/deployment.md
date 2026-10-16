# Deployment

## Local

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build
npm run start      # test the production build
```

## Share a private preview (recommended for the pitch)

1. Push the repo to a private GitHub repository.
2. Import it in Vercel. No environment variables are required.
3. Share the preview URL. The site is `noindex` and `robots.txt` blocks crawlers.

## Before a real launch

- Written permission from the venue to represent them.
- Confirm everything in `content-review.md`; replace tiles with cleared photography.
- Remove the concept footer line only once approved; set a canonical URL and `NEXT_PUBLIC_SITE_URL`.
- Switch `robots` in `src/app/layout.tsx` to indexable, update `robots.ts` and `sitemap.ts`.
- Add Restaurant JSON-LD using verified details only.
- Run Lighthouse on a real mid-range Android phone and on mobile Safari.
- Save a release checklist and rollback note (Vercel keeps previous deployments).
