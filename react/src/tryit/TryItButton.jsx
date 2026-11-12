// The "Try it" toggle shown in each question card header.
function TryItButton({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition ${
        open
          ? 'bg-indigo-600 text-white hover:bg-indigo-500'
          : 'border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50'
      }`}
    >
      {open ? 'Close editor' : 'Try it ▸'}
    </button>
  )
}

export default TryItButton
