import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      /*
        127.0.0.1     → 내 PC 내부에서만 접근 가능
        localhost     → 보통 내 PC 내부 접근
        0.0.0.0       → 외부/다른 네트워크 인터페이스에서도 접근 가능
      */
      host: '0.0.0.0',
      allowedHosts: ['app.local.test'],
      watch: {
        usePolling: true,
      },
      hmr: {
        protocol: 'wss',
        host: 'app.local.test',
        clientPort: 443,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
    },
  };
});