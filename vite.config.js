import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 用户主页仓库 LuzzyMeow.github.io 部署到根路径，base 为 '/'
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        port: 5173,
        open: false,
    },
    build: {
        outDir: 'dist',
        target: 'es2020',
        sourcemap: false,
        chunkSizeWarningLimit: 1500,
    },
});
