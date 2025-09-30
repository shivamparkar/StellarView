import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],   // <-- use the plugin here
  server: {
    proxy: {
      '/nasa-exoplanet': {
        target: 'https://exoplanetarchive.ipac.caltech.edu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nasa-exoplanet/, '')
      }
    }
  }
});
