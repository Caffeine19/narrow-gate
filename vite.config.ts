import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

const isDev = process.env.NODE_ENV?.trim() === 'development'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: isDev ? './' : '/' + path.resolve(__dirname, './dist/'),
  server: {
    port: 5177
  }
})
