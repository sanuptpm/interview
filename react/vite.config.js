import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The site is served from https://<user>.github.io/interview/
  base: '/interview/',
  plugins: [react(), tailwindcss()],
  build: {
    // The "Try it" editors (CodeMirror, Sandpack) are big, but they are split into
    // their own chunks and only downloaded when someone opens an editor.
    chunkSizeWarningLimit: 1500,
  },
})
