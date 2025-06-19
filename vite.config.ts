import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        player: resolve(__dirname, 'player/index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
        zen: resolve(__dirname, 'zen/index.html'),
      },
    },
  },
  plugins: [
    tailwindcss()
  ],
})
