# Launch checklist

The site runs in two modes, controlled by `NEXT_PUBLIC_LAUNCHED`.

- **Preview (default).** Hidden from search engines, concept wording in the footer, illustrated
  stand-ins visible, draft banner on the privacy page.
- **Launched (`NEXT_PUBLIC_LAUNCHED=true`).** Indexable, structured data on, concept wording gone,
  illustrated gallery hidden unless real photographs are set.

Do not switch to launched until every box below is ticked.

## 1. Permission (you)

- [ ] Written permission from the venue to present this as their website. Without it, keep the
      site in preview mode and describe it as a design concept.
- [ ] The person who approves is named and has authority over the venue's brand.
- [ ] You know who at the venue receives enquiries.

## 2. Content from the venue

Checked against the venue's official pages on 17 Oct 2026. Re-check before launch, because pages
change. Details are in `content-review.md`.

- [ ] Confirm the listed hours are the venue's **opening** hours, not only kitchen hours. If yes,
      set `hoursAreOpeningHours: true` in `src/content/venues/the-beach.ts` and change
      `hoursLabel` to "Opening hours".
- [ ] Confirm the phone number and the booking page link are the ones to publish.
- [ ] Confirm the Food menu and Drinks menu links are permanent. They are the venue's own pages.
- [ ] Logo files, if the venue wants its logo used.
- [ ] Photographs and any short video, with written permission for each (record them in
      `asset-register.md`). Export photos at about 1600 px on the long edge. A short muted hero
      video (MP4 or WebM) with a poster image is optional. Put files in
      `public/images/the-beach/` and follow the README there. Set `src` and `placeholder: false`
      on gallery items, and `media.heroImage` for the hero.
- [ ] Optional: dishes and prices the venue approves. Set `verified: true` per item. Nothing
      unverified is ever shown at launch.
- [ ] Official social links for this venue. The only link on the site now is the Madras Square
      group Instagram. The Facebook and Tripadvisor links on the venue's page point to a
      different venue (East Coast), so they are not used.

## 3. Accounts and settings

- [ ] Resend account and a sending domain verified in it.
- [ ] Set `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` (the venue's inbox) and `ENQUIRY_FROM_EMAIL`.
      Without the first two, the enquiry form is replaced by a "call the team" card. Nothing
      pretends to send.
- [ ] Vercel project (or another Node host) with the same variables set in its dashboard.
- [ ] Domain bought or confirmed, DNS pointed, HTTPS working.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final address with no trailing slash.

## 4. Privacy notice

- [ ] The venue reads and approves `/privacy`. Add two lines before launch: the site briefly counts
      requests per network address, in memory only, to slow abuse; and the hosting provider keeps
      standard server logs.
- [ ] Confirm `info@madrassquare.com` is the right address for deletion requests.

## 5. Checks before switching mode

Run on the preview deployment:

```bash
npm ci
npm run test:all     # lint, types, unit, end-to-end in three modes, contrast
```

If you use a browser that is already installed, set `PW_CHROMIUM_PATH` to its path first.

- [ ] A real enquiry sent through the form arrives in the venue's inbox. The automated tests use a
      local stand-in for Resend, so this has not been tried against the real service.
- [ ] Opened on a real iPhone (Safari) and a mid-range Android phone (Chrome): scrolling, the menu
      button, the sun slider, the gallery viewer, the booking and call links.
- [ ] Tabbed through with a keyboard, and read through once with a screen reader (VoiceOver or
      TalkBack).
- [ ] Lighthouse on the live preview URL. In the 17 Oct lab run: mobile performance 89 to 91,
      desktop 99, 100 for accessibility, best practices and SEO. Real-device figures will differ.
- [ ] If a real hero photograph was added, run `npm run build && npm run test:contrast` again.
      A bright photo can put text below the contrast minimum.

## 6. Switch on

- [ ] Set `NEXT_PUBLIC_LAUNCHED=true` and redeploy.
- [ ] `/robots.txt` allows the site and lists the sitemap. `/sitemap.xml` lists the home and
      privacy pages.
- [ ] Share preview (WhatsApp, LinkedIn) shows the right title and image.
- [ ] Structured data passes Google's Rich Results Test and contains no opening hours until step 2
      is confirmed, and no ratings or reviews.
- [ ] Submit the sitemap in Google Search Console.
- [ ] Reserve, Call, Directions and both menu links work from a phone.

## Roll back

- Fastest: promote the previous deployment in Vercel.
- Or set `NEXT_PUBLIC_LAUNCHED=false` and redeploy to return to a hidden preview.

## Keep it true

- Re-check hours, menu links and the booking link every month.
- If the venue moves its menus, update `menus` in `src/content/venues/the-beach.ts`.
- Run `npm audit --omit=dev` and update dependencies regularly.
- Keep licences and written approvals with the project records.
