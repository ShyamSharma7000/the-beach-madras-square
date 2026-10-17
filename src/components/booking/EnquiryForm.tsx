"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OCCASIONS, OCCASION_LABELS, type FieldErrors } from "@/lib/enquiry";

type Status = "idle" | "sending" | "sent" | "failed";

const field =
  "mt-2 block min-h-12 w-full rounded-xl border border-white/30 bg-tide px-4 py-3 text-base text-ivory placeholder:text-ivory/50 aria-[invalid=true]:border-ember";

export function EnquiryForm({ phone, phoneHref }: { phone: string; phoneHref: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failure, setFailure] = useState("");
  const mountedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountedAt.current = performance.now();
    if (dateRef.current) dateRef.current.min = new Date().toISOString().slice(0, 10);
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) summaryRef.current?.focus();
  }, [errors]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      date: String(fd.get("date") ?? ""),
      guests: String(fd.get("guests") ?? ""),
      occasion: String(fd.get("occasion") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      reference_code: String(fd.get("reference_code") ?? ""),
      elapsedMs: Math.max(0, Math.round(performance.now() - mountedAt.current)),
    };

    setStatus("sending");
    setErrors({});
    setFailure("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("sent");
        formRef.current?.reset();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: FieldErrors };
      if (res.status === 422 && body.fields) {
        setErrors(body.fields);
        setStatus("idle");
        return;
      }
      setFailure(
        res.status === 429
          ? "You have sent a few enquiries already. Please wait a few minutes, or call us."
          : "We couldn't send your enquiry.",
      );
      setStatus("failed");
    } catch {
      setFailure("We couldn't reach the server. Check your connection.");
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-3xl border border-sea-glass/60 p-8">
        <p className="display text-4xl">Enquiry sent</p>
        <p className="mt-3 max-w-[40ch] text-lg text-ivory/90">
          Your enquiry has been emailed to the team. This is a request, not a confirmed
          booking. For anything urgent, call{" "}
          <a href={phoneHref} className="underline underline-offset-4 hover:text-sun">
            {phone}
          </a>
          .
        </p>
        <button type="button" className="btn btn-ghost mt-6" onClick={() => setStatus("idle")}>
          Send another enquiry
        </button>
      </div>
    );
  }

  const errList = Object.entries(errors);
  const err = (k: keyof FieldErrors) => errors[k];
  const describe = (k: keyof FieldErrors) => (err(k) ? `${k}-error` : undefined);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {errList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-2xl border border-ember p-4 sm:col-span-2"
        >
          <p className="font-semibold">Fix {errList.length === 1 ? "this" : "these"} before sending:</p>
          <ul className="mt-2 list-disc pl-5">
            {errList.map(([k, m]) => (
              <li key={k}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="enq-name" className="font-medium">
          Your name
        </label>
        <input id="enq-name" name="name" required autoComplete="name" maxLength={80}
          className={field} aria-invalid={!!err("name")} aria-describedby={describe("name")} />
        {err("name") && <p id="name-error" className="mt-1 text-sm text-ember">{err("name")}</p>}
      </div>

      <div>
        <label htmlFor="enq-phone" className="font-medium">
          Phone number
        </label>
        <input id="enq-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel"
          className={field} aria-invalid={!!err("phone")} aria-describedby={describe("phone")} />
        {err("phone") && <p id="phone-error" className="mt-1 text-sm text-ember">{err("phone")}</p>}
      </div>

      <div>
        <label htmlFor="enq-email" className="font-medium">
          Email <span className="font-normal text-ivory/75">(optional)</span>
        </label>
        <input id="enq-email" name="email" type="email" autoComplete="email"
          className={field} aria-invalid={!!err("email")} aria-describedby={describe("email")} />
        {err("email") && <p id="email-error" className="mt-1 text-sm text-ember">{err("email")}</p>}
      </div>

      <div>
        <label htmlFor="enq-occasion" className="font-medium">
          What is it about?
        </label>
        <select id="enq-occasion" name="occasion" required defaultValue=""
          className={field} aria-invalid={!!err("occasion")} aria-describedby={describe("occasion")}>
          <option value="" disabled>
            Choose one
          </option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {OCCASION_LABELS[o]}
            </option>
          ))}
        </select>
        {err("occasion") && <p id="occasion-error" className="mt-1 text-sm text-ember">{err("occasion")}</p>}
      </div>

      <div>
        <label htmlFor="enq-guests" className="font-medium">
          Number of guests
        </label>
        <input id="enq-guests" name="guests" type="number" inputMode="numeric" min={1} max={500} required
          className={field} aria-invalid={!!err("guests")} aria-describedby={describe("guests")} />
        {err("guests") && <p id="guests-error" className="mt-1 text-sm text-ember">{err("guests")}</p>}
      </div>

      <div>
        <label htmlFor="enq-date" className="font-medium">
          Date you have in mind <span className="font-normal text-ivory/75">(optional)</span>
        </label>
        <input ref={dateRef} id="enq-date" name="date" type="date"
          className={field} aria-invalid={!!err("date")} aria-describedby={describe("date")} />
        {err("date") && <p id="date-error" className="mt-1 text-sm text-ember">{err("date")}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="enq-message" className="font-medium">
          Anything the team should know <span className="font-normal text-ivory/75">(optional)</span>
        </label>
        <textarea id="enq-message" name="message" rows={4} maxLength={1000}
          className={field} aria-invalid={!!err("message")} aria-describedby={describe("message")} />
        {err("message") && <p id="message-error" className="mt-1 text-sm text-ember">{err("message")}</p>}
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input name="reference_code" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" required
            className="mt-1 size-5 accent-[#FFC46B]" aria-invalid={!!err("consent")} aria-describedby={describe("consent")} />
          <span>
            I have read the{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-sun">
              privacy notice
            </Link>{" "}
            and agree to the venue using these details to reply to me.
          </span>
        </label>
        {err("consent") && <p id="consent-error" className="mt-1 text-sm text-ember">{err("consent")}</p>}
      </div>

      <div className="sm:col-span-2">
        {status === "failed" && (
          <p role="alert" className="mb-4 rounded-2xl border border-ember p-4">
            {failure} You can also call{" "}
            <a href={phoneHref} className="font-semibold underline underline-offset-4">
              {phone}
            </a>
            .
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
