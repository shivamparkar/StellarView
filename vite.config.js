import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/StellarView/',   // 👈 note the trailing slash
  server: {
    proxy: {
      '/nasa-exoplanet': {
        target: 'https://exoplanetarchive.ipac.caltech.edu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nasa-exoplanet/, '')
      }
    }
  }
})
