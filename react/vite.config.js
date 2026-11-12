import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The site is served from https://<user>.github.io/interview/
  base: '/interview/',
  plugins: [react()],
})
