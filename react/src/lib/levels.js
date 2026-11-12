// Order used on every question page: basics first, then harder topics.
export const LEVELS = ['Basics', 'Intermediate', 'Advanced', 'Coding round']

// Group questions by level, keeping their original order inside each level.
export function groupByLevel(questions) {
  return LEVELS.map((level) => ({
    level,
    id: level.toLowerCase().replace(/\s+/g, '-'),
    items: questions.filter((q) => (q.level || 'Basics') === level),
  })).filter((group) => group.items.length > 0)
}
