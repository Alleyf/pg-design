import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据构建模式决定使用的base路径
  // github-pages模式使用子路径，其他情况使用根路径
  const isGitHubPages = mode === 'github-pages';
  
  // 对于Vercel部署，始终使用根路径
  const isVercel = process.env.VERCEL === '1';
  
  let base = '/';
  
  if (command === 'build') {
    if (isVercel) {
      base = '/';
    } else if (isGitHubPages) {
      base = '/pg-design/'; // 恢复为子路径
    }
  }
  
  console.log(`Vite config: command=${command}, mode=${mode}, isGitHubPages=${isGitHubPages}, isVercel=${isVercel}, base=${base}`);
  
  return {
    plugins: [react()],
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      manifest: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
          entryFileNames: 'assets/[name].[hash].js'
        }
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
