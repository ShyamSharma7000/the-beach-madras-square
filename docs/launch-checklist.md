# Launch checklist

Do not set `NEXT_PUBLIC_LAUNCHED=true` until every box is ticked. While it is unset the site is a
private preview: noindex, a concept line in the footer, and illustrated stand-ins.

## 1. Permission (blocks everything else)
- [ ] Written permission from the venue to build and publish this as its website.
- [ ] Who at the venue approves content, and who receives enquiries.

## 2. Facts to confirm with the venue
Checked against the venue's official pages on 17 Oct 2026; pages can change, so re-check.
- [ ] Address, phone, booking link and the two menu links are still current.
- [ ] The listed "kitchen hours" are also the opening hours. If yes, set `hoursAreOpeningHours: true`
      in `src/content/venues/the-beach.ts` so they appear in search results.
- [ ] Any dishes or prices they want shown (set `verified: true` per item). Optional.
- [ ] Official social accounts for The Beach itself (the one linked today is the Madras Square group).

## 3. Media the venue supplies
- [ ] Photographs they own or have cleared in writing, about 1600 px on the long edge.
- [ ] Optional short muted hero video (MP4 or WebM) with a poster image.
- [ ] Put files in `public/images/the-beach/`, wire them in `the-beach.ts`, set `placeholder: false`.
- [ ] Log each file in `docs/asset-register.md`.
- [ ] Re-run `npm run build && npm run test:contrast`. A photograph can break text contrast.

## 4. Enquiry form
- [ ] Resend account with a verified sending domain. Set `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`,
      `ENQUIRY_FROM_EMAIL` in the host's dashboard (never in the repo).
- [ ] Send a real test enquiry and confirm it arrives. Without the first two settings the form is
      replaced by a call card, so nothing pretends to send.
- [ ] Venue has read and approved `/privacy`.

## 5. Domain and deploy
- [ ] Preview deployed and reviewed on real phones (Android Chrome, iPhone Safari) with the venue.
- [ ] Domain owned and pointed at the host, HTTPS working.
- [ ] `NEXT_PUBLIC_SITE_URL` set to the live address, `NEXT_PUBLIC_LAUNCHED=true`.

## 6. Before and after going live
- [ ] `npm run test:all` passes.
- [ ] Lighthouse on the live URL; fix serious findings.
- [ ] Check `/robots.txt`, `/sitemap.xml`, the share image and the structured data on the live URL.
- [ ] Every button works from a phone: Reserve, Call, Directions, both menus.
- [ ] Save the previous deployment as the rollback.
