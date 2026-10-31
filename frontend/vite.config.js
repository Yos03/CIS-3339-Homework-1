import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// In development, `npm run dev:frontend` proxies API calls to the Express server.
// In production, Express serves the files in dist/ itself, so no proxy is needed.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:3000' },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
