import "server-only"
import { Resend } from "resend"

// Deliberately does NOT throw if RESEND_API_KEY is missing. Unlike payment
// gateway credentials, a missing/invalid email key must degrade to "no
// email sent" (logged in lib/resend/send.ts's try/catch), never break
// checkout or webhook processing - emails here are a side effect, not the
// critical path.
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// resend.dev's sandbox sender works with zero setup (no domain
// verification) - swap this for an address on your own verified domain
// before going to production.
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "MedGuard <onboarding@resend.dev>"
