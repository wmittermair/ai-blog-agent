import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ai-blog-agent/',
  build: {
    outDir: 'docs',
    sourcemap: true,
    rollupOptions: {
      output: {
        format: 'es',
        compact: true,
        banner: 'const ENV_VARS = {};'
      }
    }
  },
  server: {
    fs: {
      strict: false
    }
  }
})
