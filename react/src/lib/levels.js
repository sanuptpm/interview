// Order used on every question page: basics first, then harder topics.
export const LEVELS = ['Basics', 'Intermediate', 'Advanced', 'Coding round']

const titleOf = (item) => item.q ?? item.title

// URL-friendly id: 'Hooks: effects' -> 'hooks-effects'
export const slug = (text) =>
  text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Group questions by level. Inside each level, related questions are grouped by
// sub-topic, in the order given by `topics`:
//   [{ topic: 'Hooks', questions: ['What is useState?', ...] }, ...]
// Questions not listed in `topics` keep their original order at the end of the level.
// Every question gets its running number (Q1, Q2, ...) and every sub-group an id;
// the first time a topic appears on the page it also gets `anchor` = slug(topic),
// which the Index page links to.
export function groupByLevel(questions, topics = []) {
  const place = new Map()
  topics.forEach((group, topicIndex) =>
    group.questions.forEach((title) => place.set(title, { topicIndex, topic: group.topic }))
  )

  let number = 0
  const seenTopics = new Set()

  return LEVELS.map((level) => {
    const levelId = slug(level)
    const items = questions
      .map((item, index) => ({ item, index, ...(place.get(titleOf(item)) || {}) }))
      .filter(({ item }) => (item.level || 'Basics') === level)
      .sort((a, b) => (a.topicIndex ?? Infinity) - (b.topicIndex ?? Infinity) || a.index - b.index)

    // Consecutive items with the same topic form one sub-group
    const subGroups = []
    for (const entry of items) {
      const topic = entry.topic || (topics.length ? 'More' : null)
      const numbered = { item: entry.item, title: titleOf(entry.item), number: ++number }
      const last = subGroups[subGroups.length - 1]
      if (last && last.topic === topic) {
        last.items.push(numbered)
        continue
      }
      const anchor = topic && !seenTopics.has(topic) ? slug(topic) : null
      if (topic) seenTopics.add(topic)
      subGroups.push({ topic, id: levelId + '-' + slug(topic || 'questions'), anchor, items: [numbered] })
    }

    return { level, id: levelId, count: items.length, subGroups }
  }).filter((group) => group.count > 0)
}
