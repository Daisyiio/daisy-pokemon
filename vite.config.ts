import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    proxy: {
      "^/play/pokedex": {
        target: 'https://www.pokemon.cn/play/pokedex/api/v1',
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(RegExp(`^/play/pokedex`), '')
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
})
