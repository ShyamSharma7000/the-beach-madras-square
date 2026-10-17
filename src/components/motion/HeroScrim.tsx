/**
 * Reading surface behind the hero text, shared by the drawn scene and the photo hero.
 *
 * It ends fully opaque so the wave edge of the next section joins without a seam, and it stays
 * strong up to the top of the headline because the palest skies (afternoon, or a bright photo) sit
 * right behind it. The strength is measured, not assumed: `npm run build && npm run test:contrast`
 * checks every text line against WCAG AA across the day. Re-run it whenever the hero artwork,
 * photograph or type size changes.
 */
export function HeroScrim() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[92%]"
      style={{
        background:
          "linear-gradient(to top, rgb(10,28,42) 0%, rgba(10,28,42,0.9) 12%, rgba(10,28,42,0.8) 36%, rgba(10,28,42,0.66) 56%, rgba(10,28,42,0.32) 76%, rgba(10,28,42,0) 100%)",
      }}
    />
  );
}
