import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/pg-design/' : '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));
