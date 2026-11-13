import { useEffect } from 'react'
import { groupByLevel } from '../lib/levels.js'

// Contents list: levels -> sub-topics -> questions, as jump links.
function Contents({ groups, idPrefix, showLevels }) {
  return (
    <nav className="space-y-4 text-sm">
      {groups.map((group) => (
        <div key={group.id}>
          {showLevels && (
            <a
              href={'#' + idPrefix + group.id}
              className="block font-semibold text-slate-900 hover:text-indigo-600"
            >
              {group.level} <span className="font-normal text-slate-400">({group.count})</span>
            </a>
          )}
          <ul className="mt-1 space-y-0.5">
            {group.subGroups.map((sub) => (
              <li key={sub.id}>
                <details>
                  <summary className="cursor-pointer rounded px-1 py-0.5 text-slate-600 hover:bg-slate-100 hover:text-indigo-600">
                    {sub.topic || 'Questions'}{' '}
                    <span className="text-slate-400">({sub.items.length})</span>
                  </summary>
                  <ul className="mb-1 ml-3 border-l border-slate-200 pl-2">
                    <li>
                      <a
                        href={'#' + idPrefix + sub.id}
                        className="block py-0.5 text-xs font-medium text-indigo-600 hover:underline"
                      >
                        Go to section
                      </a>
                    </li>
                    {sub.items.map(({ title, number }) => (
                      <li key={title}>
                        <a
                          href={'#' + idPrefix + 'q' + number}
                          className="block py-0.5 text-xs text-slate-500 hover:text-indigo-600"
                        >
                          Q{number}. {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

// Level sections with related questions grouped under sub-topic headings, plus a
// contents sidebar (a dropdown on small screens). renderItem(item, number) draws a card.
// showLevels=false hides the level headings (for lists that are all one level).
function LevelSections({ questions, renderItem, idPrefix = '', topics = [], showLevels = true }) {
  const groups = groupByLevel(questions, topics)

  // Jump to #section when the page is opened from a link (e.g. the Index page)
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <div className="mt-4 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
      {/* Sidebar on large screens */}
      <aside className="hidden lg:block">
        <div className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Contents
          </p>
          <Contents groups={groups} idPrefix={idPrefix} showLevels={showLevels} />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Dropdown on small screens */}
        <details className="mb-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3 lg:hidden">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">Contents</summary>
          <div className="mt-3">
            <Contents groups={groups} idPrefix={idPrefix} showLevels={showLevels} />
          </div>
        </details>

        {showLevels && (
          <div className="flex flex-wrap gap-2 text-sm">
            {groups.map((group) => (
              <a
                key={group.id}
                href={'#' + idPrefix + group.id}
                className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 hover:bg-indigo-100"
              >
                {group.level} ({group.count})
              </a>
            ))}
          </div>
        )}

        {groups.map((group) => (
          <section
            key={group.id}
            id={idPrefix + group.id}
            className={showLevels ? 'mt-8 scroll-mt-4' : 'mt-2'}
          >
            {showLevels && <h2 className="text-lg font-bold text-slate-900">{group.level}</h2>}
            {group.subGroups.map((sub) => (
              <div key={sub.id} id={idPrefix + sub.id} className="mt-3 scroll-mt-4">
                {sub.anchor && <span id={idPrefix + sub.anchor} className="block scroll-mt-4" />}
                {sub.topic && (
                  <h3 className="mt-5 mb-2 text-xs font-semibold tracking-wider text-indigo-500 uppercase">
                    {sub.topic}
                  </h3>
                )}
                <div className="space-y-4">
                  {sub.items.map(({ item, title, number }) => (
                    <div key={title} id={idPrefix + 'q' + number} className="scroll-mt-4">
                      {renderItem(item, number)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export default LevelSections
