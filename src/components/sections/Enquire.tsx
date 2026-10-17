import { EnquiryForm } from "@/components/booking/EnquiryForm";
import { WaveEdge } from "@/components/ui/WaveEdge";
import { theBeach as v } from "@/content/venues/the-beach";
import { enquiryEnabled } from "@/lib/site";
import { COLOR } from "@/lib/tokens";

export function Enquire() {
  return (
    <section id="enquire" className="relative bg-abyss py-24 sm:py-32">
      <WaveEdge color={COLOR.seaGlass} />
      <div className="wrap grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">Planning something bigger?</h2>
          <p className="mt-5 max-w-[34ch] text-lg text-ivory/85">
            The online booking form covers tables of 2 to {v.maxOnlineGuests}. For a larger party, send the team
            your date and numbers.
          </p>
        </div>
        <div className="md:col-span-7">
          {enquiryEnabled ? (
            <EnquiryForm phone={v.phone} phoneHref={v.phoneHref} />
          ) : (
            <div className="rounded-3xl border border-white/25 p-8">
              <p className="display text-4xl">Call the team</p>
              <p className="mt-3 max-w-[38ch] text-lg text-ivory/90">
                The quickest way to plan a larger table is a phone call.
              </p>
              <a href={v.phoneHref} className="btn btn-primary mt-6">
                Call {v.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
