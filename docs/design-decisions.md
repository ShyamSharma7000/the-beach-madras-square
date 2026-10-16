# Design decisions

**Idea.** The Beach is about one thing a photo can't show: how the place changes through a day.
The hero is a drawn scene of the sea with a slider that moves the sun from morning to after dark.
The sky, sea, stars and reflection all follow it. Everything else on the page stays quiet.

**Palette.** Abyss `#0A1C2A`, Tide `#12394A`, Foam `#EDF0EA` (a cool grey-green, not cream),
Sea-glass `#7CC4B4`, Ember `#F0643C` (reserved for primary buttons), Sun `#FFC46B`
(focus rings, active states). Ember Deep `#B4401A` is the accessible version for text on Foam.

**Type.** Instrument Serif for display, set large with tight leading. Hanken Grotesk for body.
The hero headline sets its whole second line in italic rather than picking out one word.

**Motion.** One orchestrated moment: the hero text rise plus the movable sun. Smaller motion
answers the user's action: menu tab crossfade, gallery viewer, button press. One scroll effect:
the wave line in the story section draws as you scroll. No parallax, no pinning, no scroll
hijacking. The entrance animation is CSS, so content is visible if JavaScript fails.
`prefers-reduced-motion` turns off drifting waves, glints, the entrance, the scroll-drawn line
and tab/viewer motion.

**Library split.** CSS owns the hero entrance, wave drift and glints. Motion for React owns the
tab panel, gallery viewer and scroll-drawn line. GSAP was not needed and was removed.

**Shapes.** Arches (rounded tops) on the occasion and location images echo coastal windows.
Section joins use a soft wave edge. Gallery tiles stay rectangular so the arches read as a motif.

**Structure.** Server components by default. Client components only where interaction needs them:
`Header`, `HeroScene`, `WaveLine`, `MenuTabs`, `Gallery`.

**Concept safeguards.** `noindex` metadata, `robots.txt` disallow, empty sitemap, and a footer
line that says this is not the official site.

**Known limits.**
- Not yet checked visually in a browser. No headless browser was available when this was built,
  so layouts at 360, 390, 768, 1024 and 1440 px, contrast over the scene, and the lightbox focus
  behaviour all need a manual pass.
- No JSON-LD (nothing verified yet). No privacy page because there are no forms, cookies or analytics.
- The hero scene crops its sides on narrow portrait screens, so the sun's travel looks shorter on phones.
