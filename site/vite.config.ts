import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 相対パスにして、GitHub Pages のサブパスでも dist/ をそのまま置けるようにする
  base: './',
  build: {
    // 全レッスンを1つのファイルにまとめている（レッスン一覧を作るために meta を同期で読むため）。
    // 個人用でオフラインでも読めればよいので、分割せずに警告の上限だけ上げる
    chunkSizeWarningLimit: 2500,
  },
  server: {
    // 学習ログページでリポジトリ直下の learning-log/ などの Markdown を読むため
    fs: { allow: ['..'] },
  },
})
