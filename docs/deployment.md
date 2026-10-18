# Deployment

## Run it locally

```bash
npm ci
npm run dev        # http://localhost:3000
npm run test:all   # lint, typecheck, unit tests, e2e, contrast (needs a production build for contrast)
npm run build
npm run start      # test the production build
```

## Private preview on Vercel (personal use)

The free Hobby plan is for non-commercial, personal use only
(https://vercel.com/docs/plans/hobby). It is fine for a personal project. If this ever becomes a
paid job for a venue, or runs the venue's real site, move it to a paid plan or to an account the
client owns, and check Vercel's current terms first.

1. Create an empty **private** repository on GitHub. Push this project from VS Code (Source
   Control, then Publish Branch) or with `git remote add origin <url>` and `git push -u origin main`.
2. In Vercel: Add New, Project, import that repository. Next.js is detected automatically and
   the repository root is the app root. Leave the build settings alone.
3. Do **not** set `NEXT_PUBLIC_LAUNCHED`. While it is unset the site is `noindex`, `robots.txt`
   blocks crawlers, there is no sitemap, and the footer says it is a concept.
4. Deploy. Open the URL on your phone and run through the page.
5. Optional: set `NEXT_PUBLIC_SITE_URL` to the preview address so shared links show the right
   preview card.

Environment variables used by this site (see `.env.example`):

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_LAUNCHED` | `true` makes the site indexable and removes the concept footer. Leave unset for previews. |
| `NEXT_PUBLIC_SITE_URL` | Canonical and social-card base address. |
| `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` | Both needed for the enquiry form to appear. `ENQUIRY_FROM_EMAIL` is optional. |

`NEXT_PUBLIC_*` values and the enquiry form check are read when the site is built. After you
change any variable in Vercel, redeploy (Deployments, the latest one, Redeploy).

## Going live

Do not use the steps above to launch. Follow `docs/launch-checklist.md`: permission, real photos,
confirmed hours, the privacy notice approved by the venue, then the launch switch.

## Rolling back

Vercel keeps every previous deployment. Open Deployments, pick the last good one, and choose
Promote to Production (or Instant Rollback on a paid plan).
