// Hidden files for the Sandpack preview (besides the editable /App.js).

// Entry point. Like Sandpack's react template, but:
// - no <StrictMode>, so console.log in a component runs once per render
//   (the re-render questions count those logs);
// - if the component throws while rendering, show the error on the page
//   instead of a blank screen (React 19 only reports it to the console).
export const reactPreviewIndex = `import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

const container = document.getElementById('root')

function showError(error) {
  console.error(error)
  const box = document.createElement('pre')
  box.className = 'render-error'
  box.textContent = 'Error while rendering:\\n' + (error && error.message ? error.message : String(error)) +
    '\\n\\nFix the code on the left and the preview will update.'
  container.replaceChildren(box)
}

createRoot(container, { onUncaughtError: (error) => showError(error) }).render(<App />)
`

// Small default stylesheet, so plain snippets look tidy and the class names
// they use (.card, .overlay, .error, ...) do something.
export const reactPreviewCss = `body {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 15px;
  color: #1e293b;
  margin: 0;
  padding: 16px;
}
button {
  font: inherit;
  margin: 4px 6px 4px 0;
  padding: 5px 12px;
  border: 1px solid #4f46e5;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
  cursor: pointer;
}
button:hover { background: #6366f1; }
button:disabled { opacity: 0.6; cursor: default; }
button.active, .tab.active { background: #312e81; }
input, select, textarea {
  font: inherit;
  margin: 4px 6px 4px 0;
  padding: 5px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}
input[type='checkbox'], input[type='radio'] { margin-right: 6px; }
pre {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 10px;
  font-size: 13px;
}
.card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
}
.error, .input-error { color: crimson; border-color: crimson; }
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
}
.render-error {
  background: #fff1f2;
  color: #9f1239;
  white-space: pre-wrap;
}
.box {
  background: white;
  border-radius: 10px;
  padding: 16px;
}
`
