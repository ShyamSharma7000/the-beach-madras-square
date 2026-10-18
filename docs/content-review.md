# Content review checklist

Facts were checked against the venue's public pages on 17 Oct 2026, not provided by the venue.
Confirm each with the venue before the site is shown as anything other than a concept. Source of
truth in code: `src/content/venues/the-beach.ts`.

| Item | Where it appears | Source | Status |
| --- | --- | --- | --- |
| Name: The Beach by Madras Square | Header, hero, footer | Official Madras Square site | Confirm spelling and logo use |
| Address: ECR, 1st Main Road, Uthandi, Chennai, Tamil Nadu 600119 | Location, footer, JSON-LD | Venue's booking page | Confirm |
| Phone: +91 73056 69696 | Reserve, location, footer, privacy | Venue's booking page | Confirm it is the right booking line |
| Booking page | Header, reserve, occasions | thebeach.madrassquare.com/the-beach-booking | Confirm approved for linking. Its online form is shared across branches (2 to 15 guests) |
| Kitchen hours: Mon to Fri 11:00 to 22:30; Sat and Sun 11:00 to 15:45 and 18:30 to 22:30 | Location | Venue's booking page | Labelled "kitchen hours". Confirm whether they are opening hours. Until then they stay out of JSON-LD |
| Food menu and drinks menu links | Food section | Venue's own menu pages | Confirm links are current |
| Instagram (group account) | Footer | Madras Square site | Confirm |
| Story copy (3 paragraphs) | Story | Written from the confirmed facts above | Venue should read and approve every sentence |
| Occasions (4) | Occasions | Derived from hours and booking page | Confirm each is really offered |
| Privacy notice | /privacy | Drafted here | Venue must review and approve before launch |

## Not on the site, on purpose

- Dish names and prices (the menus are linked, not copied; `menuCategories` is empty).
- Ratings, reviews, awards. This includes the "Best restaurants in ECR by Conde Naste" line on
  the group site: unverified.
- Facebook and Tripadvisor links: they point to the East Coast branch, not The Beach.
- Claims about cocktails, live music, family-friendliness, or sea-facing tables.
- Any "booking confirmed" state. The site does not take reservations.
