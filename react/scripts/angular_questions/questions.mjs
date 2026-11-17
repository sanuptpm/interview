// All Angular questions, grouped by sub-topic in learning order (see gen.mjs).
import { part1 } from './part1.mjs'
import { part2 } from './part2.mjs'
import { part3 } from './part3.mjs'
import { part4 } from './part4.mjs'
import { part5 } from './part5.mjs'

const base = [...part1, ...part2, ...part3, ...part4].map((t) => ({ ...t, items: [...t.items] }))

// part5 adds questions to existing topics by name; a topic with `after` is new
for (const extra of part5) {
  const existing = base.find((t) => t.topic === extra.topic)
  if (existing) existing.items.push(...extra.items)
  else if (extra.after) base.splice(base.findIndex((t) => t.topic === extra.after) + 1, 0, { topic: extra.topic, items: extra.items })
  else throw new Error('Unknown topic: ' + extra.topic)
}

export const topics = base
