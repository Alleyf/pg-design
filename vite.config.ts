import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据构建模式决定使用的base路径
  // github-pages模式使用子路径，其他情况使用根路径
  const isGitHubPages = mode === 'github-pages';
  const base = command === 'build' && isGitHubPages ? '/pg-design/' : '/';
  
  console.log(`Vite config: command=${command}, mode=${mode}, isGitHubPages=${isGitHubPages}, base=${base}`);
  
  return {
    plugins: [react()],
    base,
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
