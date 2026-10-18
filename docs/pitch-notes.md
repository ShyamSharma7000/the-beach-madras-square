# Pitch notes: The Beach by Madras Square

Private to this project. Edit freely. Last checked against the venue's public pages on 17 Oct 2026.

## Where you really stand

- Madras Square is a **group**: restaurants (East Coast, The Beach, Sterling), banquet halls,
  events and travel. The Beach is one card on the group homepage, plus one booking-style page
  with kitchen hours, a photo gallery and links to two separate menu pages.
- So The Beach has **no site of its own**. It does have a working booking page and menus, which
  this site links to and does not replace.
- From the page text: the copyright line says 2024, there are typos ("Madras Sqare"), leftover
  shop text, and no map on The Beach's page. Judge the design yourself. Do not tell them their
  site is bad. You do not know who built it or whether they are happy with it.
- Who decides is probably the group (owner or marketing), not the venue manager. Someone has
  built their menu pages, so ask early whether they already have a developer.
- Nobody has asked for this. It may not sell. Set a limit, for example three attempts at
  reaching the right person, then move on.

## The honest pitch

"The Beach doesn't have its own page that shows the place. I made an independent design concept
for one. It sends guests to your existing booking page and menus, so nothing you run today has
to change."

Say it is **not official** and was made without their involvement. Offer to take it down. The
footer already says this.

## First message (short)

> Hi, I'm [name], a web developer in Chennai. I made a design concept for The Beach on ECR. It
> is not official and I have not used any of your photos or logo. It is a one-page site that
> links to your existing booking page and menus. Could you tell me who looks after your website,
> and whether you would want a page just for The Beach? I can send screenshots or a private
> link. Happy to remove it if you would rather I did.

## The 60-second demo

1. Open on the hero. Let the text rise, then say nothing for a second.
2. Hand them the phone. Tell them to drag "Follow the day". Guests feel the place before they
   arrive.
3. Scroll to Food and drink. The two cards open **their own** food and drinks menus.
4. Gallery: "These are drawings. Your photography goes here and carries the page."
5. Tap Reserve a table. It opens their real booking page. "I didn't build a booking system. Yours
   stays."
6. Find us: kitchen hours, directions, call. Enquiry form only shows if email is connected.

## What is true, and what is not

True and measured (lab test, 17 Oct 2026, launched build):
- Lighthouse mobile performance 89 to 91, desktop 99. Accessibility, best practices and SEO 100.
- Hero and header text meets WCAG AA contrast at 12 times of day and five screen widths.
- Works with animation turned off, with a keyboard, and with JavaScript off.

Not true, do not say:
- That it gets more bookings or revenue. You have no data.
- That it is faster or better than their current page. You have not measured theirs.
- That it takes reservations. It links to their booking page.

Not tested yet: real phones, Safari, a screen reader, a real enquiry email.

## What you need from them to go live

- Written permission to present it as their website, and who approves.
- Photos or a short video they own or clear in writing, and their logo if they want it used.
- Confirmation that the listed hours are opening hours, not only kitchen hours.
- The email address that should receive enquiries.
- A domain, or permission to use a subdomain. Details are in `docs/launch-checklist.md`.

## Questions to ask them

- Who looks after the website and the menu pages today?
- Would the group want a page just for The Beach, or one design for all three restaurants?
- What do guests ask on the phone most (hours, parking, menu, big groups)?

## Pricing and terms (fill in)

Do not quote until scope is agreed.

- Build fee: ____
- Photography or video, if you include it: ____
- Hosting and domain: ____
- Monthly upkeep (menu, price and hours changes): ____
- Out of scope: custom booking engine, CMS, ads, and anything that replaces their booking page.

## Likely objections

- "We already have a website." Agree. Then ask who looks after it and whether The Beach needs a
  page of its own. Don't compare designs.
- "We have a developer." Ask who. Offer the concept as a reference, not a replacement.
- "Is it expensive?" Quote a fixed scope.
- "Can you add X?" Only add things the venue really offers.

## If this goes nowhere

The code is built to be reused with a new venue file and new art direction. Check other East
Coast Road cafés and restaurants for ones with no real site, and pitch the one that fits.
