import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { theBeach as v } from "@/content/venues/the-beach";
import { launched } from "@/lib/site";
import { COLOR } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${v.name} ${v.byline} handles details sent through this website.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <header className="wrap py-6">
        <Link href="/" className="display text-3xl">
          {v.name}
        </Link>
      </header>
      <main id="main" className="wrap max-w-3xl pb-24 pt-8 text-lg leading-8">
        <h1 className="display text-[clamp(2.8rem,7vw,5rem)]">Privacy notice</h1>
        {!launched && (
          <p className="mt-6 rounded-2xl border border-ember p-4 text-base">
            Draft. The venue must review and approve this notice before launch.
          </p>
        )}

        <h2 className="display mt-12 text-4xl">What this website collects</h2>
        <p className="mt-3 text-ivory/90">
          Only what you type into the enquiry form: your name, phone number, number of guests, what
          the enquiry is about, and optionally your email, a date and a message. We use it to reply
          to your enquiry and for nothing else.
        </p>

        <h2 className="display mt-10 text-4xl">Where it goes</h2>
        <p className="mt-3 text-ivory/90">
          Your enquiry is sent as an email to the {v.name} team through an email delivery service
          (Resend). This website does not keep a database of enquiries. Resend keeps its own record
          of emails it delivers, under its own privacy policy. The email stays in the team&rsquo;s
          inbox until they delete it.
        </p>

        <h2 className="display mt-10 text-4xl">Cookies and tracking</h2>
        <p className="mt-3 text-ivory/90">
          This website sets no cookies and runs no analytics or advertising trackers. Fonts are
          served from the site itself.
        </p>

        <h2 className="display mt-10 text-4xl">Other sites</h2>
        <p className="mt-3 text-ivory/90">
          Booking opens on the Madras Square booking page and directions open in Google Maps. Those
          sites have their own privacy policies.
        </p>

        <h2 className="display mt-10 text-4xl">Ask us to delete or correct your details</h2>
        <p className="mt-3 text-ivory/90">
          Call{" "}
          <a href={v.phoneHref} className="underline underline-offset-4 hover:text-sun">
            {v.phone}
          </a>{" "}
          or email{" "}
          <a href="mailto:info@madrassquare.com" className="underline underline-offset-4 hover:text-sun">
            info@madrassquare.com
          </a>{" "}
          and name the enquiry you sent.
        </p>
      </main>
      <Footer joinColor={COLOR.abyss} />
    </>
  );
}
