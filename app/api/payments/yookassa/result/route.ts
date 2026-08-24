import { reconcilePayment } from "@/lib/yookassa/reconcile"

// YooKassa calls this endpoint server-to-server when a payment's status
// changes. Its notifications carry no signature at all, so the body is
// never trusted directly - reconcilePayment re-fetches the payment from
// YooKassa's own API (authenticated with our own credentials) and only
// acts on what that authoritative response says. The browser-facing
// success/fail pages remain UX only; Mongo (flipped by reconcilePayment)
// is the real source of truth.
export async function POST(request: Request): Promise<Response> {
  const body = await request.json()

  if (body?.event === "payment.succeeded" && body?.object?.id) {
    await reconcilePayment(body.object.id)
  }

  return new Response("OK", { status: 200 })
}
