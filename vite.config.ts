import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 在本地开发和preview时使用根路径，只有build且环境是production时才使用GitHub Pages路径
  const base = command === 'build' && mode === 'production' ? '/pg-design/' : '/';
  
  return {
    plugins: [react()],
    base,
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
