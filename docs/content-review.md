# Content review checklist

Every item below came from public listings or the spec, not from the venue. Confirm each one
before the site is shown as anything other than a concept.

| Item | Where it appears | Source | Status |
| --- | --- | --- | --- |
| Name: The Beach by Madras Square | Header, hero, footer | Official Madras Square site | Confirm preferred spelling and logo |
| Address: 1st Main Road, Uthandi, Chennai 600119 | Location, footer | Public listing | Confirm |
| Phone: +91 73056 69696 | Reserve, location, footer, occasion cards | Public listing | Confirm it is the right booking line |
| Booking URL | Header, reserve, occasion cards | thebeach.madrassquare.com/the-beach-booking | Confirm it is current and approved for linking |
| Cuisines: continental, modern Indian, Asian, seafood | Hero line, food section | Public listings | Confirm against the real menu |
| Indoor and outdoor seating | Story copy | Public listings | Confirm |
| Sea views / beachfront | Story, hero, occasions | Public listings | Confirm which tables face the water |
| Occasions: sea-view dinners, sunset visits, group tables, celebrations | Occasions section | Spec examples | Confirm each is actually offered |
| Opening hours | Location | Not published on this site | Get from the venue, then add `hours` in `src/content/venues/the-beach.ts` |
| Menu dishes and prices | Food section | None. Slots are marked "Sample layout" | Get the real menu, set `verified: true` per item |
| Social links | Not shown | None confirmed | Add only official URLs |
| Structured data (Restaurant JSON-LD) | Not added | n/a | Add after address, hours and phone are confirmed |
| Ratings, reviews, awards | Not shown | n/a | Do not add unless the venue supplies them |

## Deliberately not on the site

Invented dishes, prices, testimonials, awards, founder story, or any "booking confirmed" state.
