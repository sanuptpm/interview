import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { exportHighlights, importHighlights, useAllHighlights } from '../lib/highlights.js'
import { cloudEnabled, useCloud } from '../lib/cloudSync.js'
import AccountButton from './AccountButton.jsx'
import HighlightLock from './HighlightLock.jsx'

// Index page panel: highlight counts per topic, plus Export / Import of a backup file.
// pages: [{ title, path }] of the question pages.
function MyHighlights({ pages }) {
  const all = useAllHighlights()
  const cloud = useCloud()
  const synced = cloud.status === 'signed-in'
  const fileInput = useRef(null)
  const [message, setMessage] = useState('')

  // Count highlighted questions per page (ids are "<page path>|<question title>")
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const counts = {}
  for (const id of Object.keys(all)) {
    const path = id.split('|')[0].slice(base.length)
    counts[path] = (counts[path] || 0) + 1
  }
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0)

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const added = importHighlights(await file.text())
      setMessage(`Imported ${added} highlight${added === 1 ? '' : 's'}.`)
    } catch {
      setMessage('That file is not a highlights backup.')
    }
  }

  const button = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100'

  return (
    <section id="my-highlights" className="mt-8 scroll-mt-4 rounded-xl border border-yellow-200 bg-yellow-50/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900">
            <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-yellow-300" />
            My highlights
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {total
              ? `${total} highlighted question${total === 1 ? '' : 's'}.`
              : 'Select text in any answer to highlight it.'}{' '}
            {synced
              ? 'Synced to your Google account: they appear on every device where you sign in.'
              : cloudEnabled
                ? 'Saved in this browser. Sign in to keep them in your account and use them on every device.'
                : 'Saved in this browser. Export a backup to keep them safe or move them to another device.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <HighlightLock />
          <button type="button" className={button} onClick={exportHighlights} disabled={!total}>
            Export backup
          </button>
          <button type="button" className={button} onClick={() => fileInput.current?.click()}>
            Import backup
          </button>
          <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={onImport} />
        </div>
      </div>

      <div className="mt-3">
        <AccountButton />
      </div>

      {total > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {pages
            .filter((page) => counts[page.path])
            .map((page) => (
              <Link
                key={page.path}
                to={page.path}
                className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:text-indigo-600"
              >
                {page.title} <span className="text-slate-400">({counts[page.path]})</span>
              </Link>
            ))}
        </div>
      )}
      {message && <p className="mt-2 text-sm text-emerald-700">{message}</p>}
    </section>
  )
}

export default MyHighlights
