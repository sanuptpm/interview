// Order used on every question page: basics first, then harder topics.
export const LEVELS = ['Basics', 'Intermediate', 'Advanced', 'Coding round']

const titleOf = (item) => item.q ?? item.title

// Group questions by level. Inside each level, related questions are grouped by
// sub-topic, in the order given by `topics`:
//   [{ topic: 'Hooks', questions: ['What is useState?', ...] }, ...]
// Questions not listed in `topics` keep their original order at the end of the level.
export function groupByLevel(questions, topics = []) {
  const place = new Map()
  topics.forEach((group, topicIndex) =>
    group.questions.forEach((title) => place.set(title, { topicIndex, topic: group.topic }))
  )

  return LEVELS.map((level) => {
    const items = questions
      .map((item, index) => ({ item, index, ...(place.get(titleOf(item)) || {}) }))
      .filter(({ item }) => (item.level || 'Basics') === level)
      .sort((a, b) => (a.topicIndex ?? Infinity) - (b.topicIndex ?? Infinity) || a.index - b.index)

    // Consecutive items with the same topic form one sub-group
    const subGroups = []
    for (const entry of items) {
      const topic = entry.topic || (topics.length ? 'More' : null)
      const last = subGroups[subGroups.length - 1]
      if (last && last.topic === topic) last.items.push(entry.item)
      else subGroups.push({ topic, items: [entry.item] })
    }

    return {
      level,
      id: level.toLowerCase().replace(/\s+/g, '-'),
      items: items.map((entry) => entry.item),
      subGroups,
    }
  }).filter((group) => group.items.length > 0)
}
