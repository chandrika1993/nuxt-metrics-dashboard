import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// UI components and shared utilities use explicit imports, so they can be
// unit tested with plain Vite + Vue without booting a Nuxt runtime.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.spec.ts'],
  },
})
