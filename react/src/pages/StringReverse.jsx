function reverseString(str) {
  let reversed = ''

  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i]
  }

  return reversed
}

function StringReverse() {
  const text = 'hello world'
  const reversed = reverseString(text)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">String Reverse</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Input</p>
        <p className="mt-1 font-mono text-lg text-slate-800">{text}</p>
      </div>

      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-medium text-emerald-600">Output</p>
        <p className="mt-1 font-mono text-lg text-emerald-800">{reversed}</p>
      </div>
    </div>
  )
}

export default StringReverse
