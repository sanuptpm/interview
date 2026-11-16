/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',              // fake browser DOM
    globals: true,                     // describe / it / expect without imports
    setupFiles: './src/setupTests.js', // runs before every test file
  },
})
