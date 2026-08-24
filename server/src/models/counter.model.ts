import { Schema, model } from "mongoose"

interface CounterDocument {
  _id: string
  seq: number
}

const counterSchema = new Schema<CounterDocument>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { versionKey: false }
)

const Counter = model<CounterDocument>("Counter", counterSchema)

export async function getNextSequence(counterName: string): Promise<number> {
  const counter = await Counter.findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  )
  return counter.seq
}
