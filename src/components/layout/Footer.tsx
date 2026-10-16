import { theBeach as v } from "@/content/venues/the-beach";

export function Footer() {
  return (
    <footer className="bg-abyss pb-10 pt-16 text-foam">
      <div className="wrap grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-5xl">{v.name}</p>
          <p className="mt-1 text-foam/80">{v.byline}</p>
        </div>
        <address className="not-italic text-foam/90">
          <p className="font-semibold text-foam">Find us</p>
          <p className="mt-2 max-w-[28ch]">{v.address}</p>
          <p className="mt-3">
            <a href={v.phoneHref} className="underline underline-offset-4 hover:text-sun">
              {v.phone}
            </a>
          </p>
        </address>
        <div className="text-foam/90">
          <p className="font-semibold text-foam">Book</p>
          <p className="mt-2">
            <a
              href={v.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-sun"
            >
              Reserve on the venue&rsquo;s booking page
            </a>
          </p>
          <p className="mt-2">
            <a
              href="https://www.madrassquare.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-sun"
            >
              Madras Square
            </a>
          </p>
        </div>
      </div>
      <div className="wrap mt-12 border-t border-white/15 pt-6 text-sm text-foam/75">
        <p className="max-w-[70ch]">
          Independent design concept. This is not the official website of {v.name} {v.byline}.
          Artwork on this page is illustrative and will be replaced with the venue&rsquo;s own
          photography once approved.
        </p>
      </div>
    </footer>
  );
}
