import { useSyncExternalStore } from 'react'

// Text highlights the reader adds while studying, saved in this browser (localStorage).
// Shape: { [id]: [{ start, end, color }] }, where id = page path + '|' + question title and
// start/end are character offsets into the answer text. Ranges never overlap.
const KEY = 'interview-highlights:v1'
export const COLORS = ['yellow', 'important']

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

let data = load()
const listeners = new Set()

function save(next) {
  data = next
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // storage full or blocked: highlights still work until the page is reloaded
  }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Same id for the answer text and for the page's "Highlighted only" filter
export const highlightId = (title) => window.location.pathname + '|' + title

// Ask the browser not to clear this site's storage on its own (e.g. when disk is low)
let askedPersist = false
function keepStorage() {
  if (askedPersist) return
  askedPersist = true
  navigator.storage?.persist?.().catch(() => {})
}

// Add one range to a list, merging it with any range it touches, so ranges never overlap
function mergeRange(ranges, start, end, color) {
  let from = start
  let to = end
  const kept = []
  for (const range of ranges) {
    if (range.end < from || range.start > to) kept.push(range)
    else {
      from = Math.min(from, range.start)
      to = Math.max(to, range.end)
    }
  }
  kept.push({ start: from, end: to, color })
  return kept.sort((a, b) => a.start - b.start)
}

// Union of two highlight sets (used when signing in: this browser + the cloud copy)
export function mergeHighlights(base, incoming) {
  const result = { ...base }
  for (const [id, ranges] of Object.entries(incoming || {})) {
    if (!Array.isArray(ranges)) continue
    for (const range of ranges) {
      if (!Number.isInteger(range?.start) || !Number.isInteger(range?.end) || range.end <= range.start) continue
      const color = COLORS.includes(range.color) ? range.color : 'yellow'
      result[id] = mergeRange(result[id] || [], range.start, range.end, color)
    }
  }
  return result
}

export function addHighlight(id, start, end, color) {
  if (end <= start) return
  keepStorage()
  save({ ...data, [id]: mergeRange(data[id] || [], start, end, color) })
}

export function removeHighlight(id, index) {
  const ranges = (data[id] || []).filter((_, i) => i !== index)
  const next = { ...data }
  if (ranges.length) next[id] = ranges
  else delete next[id]
  save(next)
}

// Remove every highlight whose id starts with this page path
export function clearPageHighlights() {
  const prefix = window.location.pathname + '|'
  save(Object.fromEntries(Object.entries(data).filter(([id]) => !id.startsWith(prefix))))
}

// Backup: everything as a JSON file the reader can download
export function exportHighlights() {
  const file = { app: 'interview-highlights', version: 1, savedAt: new Date().toISOString(), highlights: data }
  const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'interview-highlights-' + new Date().toISOString().slice(0, 10) + '.json'
  link.click()
  URL.revokeObjectURL(url)
}

// Restore a backup, merged with the highlights already in this browser. Returns how many were added.
export function importHighlights(text) {
  const parsed = JSON.parse(text)
  const incoming = parsed?.highlights ?? parsed
  if (!incoming || typeof incoming !== 'object') throw new Error('Not a highlights file')
  const count = Object.values(incoming).reduce((sum, ranges) => sum + (Array.isArray(ranges) ? ranges.length : 0), 0)
  save(mergeHighlights(data, incoming))
  return count
}

// For cloud sync (cloudSync.js)
export const getAllHighlights = () => data
export const replaceAllHighlights = (next) => save(next)
export const subscribeHighlights = subscribe

const EMPTY = []
export const useHighlights = (id) => useSyncExternalStore(subscribe, () => data[id] || EMPTY)
export const useAllHighlights = () => useSyncExternalStore(subscribe, () => data)
