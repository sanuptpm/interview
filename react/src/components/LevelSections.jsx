import { groupByLevel } from '../lib/levels.js'

// Jump links plus one section per level. renderItem(item, number) draws each card;
// numbering runs Q1, Q2... across the whole page in basics-to-advanced order.
function LevelSections({ questions, renderItem, idPrefix = '' }) {
  const groups = groupByLevel(questions)
  // Number of questions before each group, so numbering continues across sections
  const offsets = groups.map((_, i) =>
    groups.slice(0, i).reduce((sum, group) => sum + group.items.length, 0)
  )

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {groups.map((group) => (
          <a
            key={group.id}
            href={'#' + idPrefix + group.id}
            className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 hover:bg-indigo-100"
          >
            {group.level} ({group.items.length})
          </a>
        ))}
      </div>

      {groups.map((group, groupIndex) => (
        <section key={group.id} id={idPrefix + group.id} className="mt-8 scroll-mt-4">
          <h2 className="text-lg font-bold text-slate-900">{group.level}</h2>
          <div className="mt-3 space-y-4">
            {group.items.map((item, i) => renderItem(item, offsets[groupIndex] + i + 1))}
          </div>
        </section>
      ))}
    </>
  )
}

export default LevelSections
