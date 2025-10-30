import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 配置构建输出路径，Vercel默认识别dist目录
  build: {
    outDir: 'dist',
    // 确保生成的文件能够被Vercel正确处理
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  // 配置静态资源处理 - Vercel建议使用标准public目录
  publicDir: 'public',
  // 确保路径解析正确
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 服务器配置
  server: {
    open: true,
  },
})