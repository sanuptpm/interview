import { groupByLevel } from '../lib/levels.js'

// Jump links plus one section per level, with related questions grouped under
// small sub-topic headings. renderItem(item, number) draws each card; numbering
// runs Q1, Q2... across the whole page.
// showLevels=false hides the level headings (for lists that are all one level).
function LevelSections({ questions, renderItem, idPrefix = '', topics = [], showLevels = true }) {
  const groups = groupByLevel(questions, topics)
  // Number of questions before each group, so numbering continues across sections
  const offsets = groups.map((_, i) =>
    groups.slice(0, i).reduce((sum, group) => sum + group.items.length, 0)
  )

  return (
    <>
      {showLevels && (
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
      )}

      {groups.map((group, groupIndex) => {
        let number = offsets[groupIndex]
        return (
          <section
            key={group.id}
            id={idPrefix + group.id}
            className={showLevels ? 'mt-8 scroll-mt-4' : 'mt-4'}
          >
            {showLevels && <h2 className="text-lg font-bold text-slate-900">{group.level}</h2>}
            {group.subGroups.map((sub, subIndex) => {
              const start = number
              number += sub.items.length
              return (
                <div key={subIndex} className="mt-3">
                  {sub.topic && (
                    <h3 className="mb-2 mt-5 text-xs font-semibold tracking-wider text-indigo-500 uppercase">
                      {sub.topic}
                    </h3>
                  )}
                  <div className="space-y-4">
                    {sub.items.map((item, i) => renderItem(item, start + i + 1))}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </>
  )
}

export default LevelSections
