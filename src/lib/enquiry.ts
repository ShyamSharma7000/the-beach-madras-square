import { z } from "zod";

export const OCCASIONS = ["group", "celebration", "private", "other"] as const;
export type Occasion = (typeof OCCASIONS)[number];

export const OCCASION_LABELS: Record<Occasion, string> = {
  group: "Large group",
  celebration: "Birthday or anniversary",
  private: "Private event",
  other: "Something else",
};

/** Shortest time a person could plausibly take to fill the form, measured on their own device. */
export const MIN_FILL_MS = 3_000;
/** A form left open longer than this is treated as stale. */
export const MAX_FILL_MS = 6 * 60 * 60 * 1000;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "Keep your name under 80 characters."),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s\-()]{6,19}$/, "Enter a phone number we can call, for example +91 98765 43210."),
  email: z.union([z.literal(""), z.email("Enter a valid email address.")]).default(""),
  date: z
    .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")])
    .default(""),
  guests: z.coerce
    .number({ error: "Enter the number of guests." })
    .int("Enter a whole number of guests.")
    .min(1, "Enter at least 1 guest.")
    .max(500, "Call the venue for parties above 500."),
  occasion: z.enum(OCCASIONS, { error: "Choose what the enquiry is about." }),
  message: z.string().trim().max(1000, "Keep your message under 1,000 characters.").default(""),
  consent: z.literal(true, { error: "Tick the box to confirm you have read the privacy notice." }),
  /**
   * Honeypot. Hidden from people and assistive technology. The name is deliberately not one that
   * browsers or password managers autofill, so a real visitor never fills it.
   */
  reference_code: z.string().max(0).default(""),
  /**
   * Milliseconds the form had been on screen, measured on the visitor's own device. It is not
   * compared with the server clock, so a phone with the wrong time is not penalised.
   */
  elapsedMs: z.number().int().min(0, "Reload the page and try again."),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

export type ParseResult =
  | { ok: true; data: EnquiryInput; bot: boolean }
  | { ok: false; errors: FieldErrors };

export function parseEnquiry(raw: unknown): ParseResult {
  const result = enquirySchema.safeParse(raw);
  if (!result.success) {
    // A filled honeypot is a bot. Report it without saying which field tripped.
    const trap = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>).reference_code : undefined;
    if (typeof trap === "string" && trap.length > 0) {
      return { ok: true, data: {} as EnquiryInput, bot: true };
    }
    const errors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof EnquiryInput | undefined;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  const data = result.data;
  // A person who is told the enquiry went through must be right, so a too-quick or stale form is
  // an error they can fix, never a silent success.
  if (data.elapsedMs < MIN_FILL_MS) {
    return { ok: false, errors: { elapsedMs: "That was very quick. Wait a moment, then send again." } };
  }
  if (data.elapsedMs > MAX_FILL_MS) {
    return {
      ok: false,
      errors: { elapsedMs: "This page has been open for a long time. Reload it, then send again." },
    };
  }
  return { ok: true, data, bot: false };
}
