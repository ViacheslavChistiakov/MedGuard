import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import mongoose from "mongoose"
import { connectDB } from "../src/config/db.js"
import { Order } from "../src/models/order.model.js"
import { User } from "../src/models/user.model.js"

// Local dev workaround: YooKassa's real servers can never reach a
// localhost webhook, so payments completed while testing locally stay
// stuck "pending" here even though they genuinely succeeded on YooKassa's
// side. This replays exactly what the webhook route
// (med-guard/app/api/payments/yookassa/result/route.ts) would have done -
// re-fetch each payment from YooKassa's own API and only act on that
// authoritative status, never on an assumption.
//
// Not needed once the app is deployed somewhere YooKassa can actually
// reach - the real webhook handles this automatically there.

function readYookassaAuth(): string {
  const envPath = path.resolve(import.meta.dirname, "../../med-guard/.env.local")
  const content = fs.readFileSync(envPath, "utf8")
  const match = content.match(/^YOOKASSA_AUTH=(.*)$/m)
  if (!match?.[1]) {
    throw new Error(`YOOKASSA_AUTH not found in ${envPath}`)
  }
  return match[1].trim()
}

interface YooKassaPayment {
  id: string
  status: string
  metadata?: { invId?: string }
}

async function fetchRecentPayments(auth: string): Promise<YooKassaPayment[]> {
  const response = await fetch("https://api.yookassa.ru/v3/payments?limit=100", {
    headers: { Authorization: `Basic ${auth}` },
  })
  if (!response.ok) {
    throw new Error(`YooKassa payments list failed with status ${response.status}: ${await response.text()}`)
  }
  const data = await response.json()
  return data.items
}

async function main() {
  const auth = readYookassaAuth()
  await connectDB()

  const payments = await fetchRecentPayments(auth)
  const succeeded = payments.filter((p) => p.status === "succeeded" && p.metadata?.invId)

  let reconciled = 0
  for (const payment of succeeded) {
    const invId = Number(payment.metadata!.invId)
    const order = await Order.findOne({ invId })
    if (!order || order.status !== "pending") continue

    order.status = "paid"
    order.yookassaPayload = payment
    await order.save()
    await User.updateOne({ _id: order.userId }, { $addToSet: { currentPlanIds: order.planId } })

    console.log(`Reconciled invId ${invId} (${order.planId}) - was stuck pending, YooKassa confirms succeeded.`)
    reconciled++
  }

  console.log(`Checked ${succeeded.length} succeeded YooKassa payment(s), reconciled ${reconciled} stuck order(s).`)

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error("Reconciliation failed:", error)
  process.exit(1)
})
