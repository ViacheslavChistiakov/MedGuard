import "dotenv/config"
import mongoose from "mongoose"
import { connectDB } from "../src/config/db.js"
import { User } from "../src/models/user.model.js"
import { Order } from "../src/models/order.model.js"

// Backfills User.currentPlanIds from existing paid orders. Uses $addToSet
// throughout, so it's safe to re-run - already-present ids are a no-op.
async function main() {
  await connectDB()

  const grouped = await Order.aggregate<{ _id: string; planIds: string[] }>([
    { $match: { status: "paid" } },
    { $group: { _id: "$userId", planIds: { $addToSet: "$planId" } } },
  ])

  let updatedUsers = 0
  for (const { _id: userId, planIds } of grouped) {
    const result = await User.updateOne(
      { _id: userId },
      { $addToSet: { currentPlanIds: { $each: planIds } } }
    )
    if (result.modifiedCount > 0) updatedUsers++
  }

  console.log(`Checked ${grouped.length} user(s) with paid orders, updated ${updatedUsers}.`)

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})
