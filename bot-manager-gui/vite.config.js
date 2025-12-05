import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    target: 'esnext',
  },
  server: {
    port: 3100,
    strictPort: false,
  },
});
