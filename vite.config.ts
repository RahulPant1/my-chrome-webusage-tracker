import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Copy function to handle static assets
function copyPublicFiles() {
  return {
    name: 'copy-public-files',
    writeBundle() {
      // Create dist directory if it doesn't exist
      if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist')
      }

      // Copy icons
      const iconSizes = [16, 48, 128]
      iconSizes.forEach(size => {
        const iconPath = `public/icon${size}.png`
        if (fs.existsSync(iconPath)) {
          fs.copyFileSync(iconPath, `dist/icon${size}.png`)
        }
      })

      // Copy manifest.json
      if (fs.existsSync('public/manifest.json')) {
        fs.copyFileSync('public/manifest.json', 'dist/manifest.json')
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyPublicFiles()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        options: path.resolve(__dirname, 'options.html'),
        background: path.resolve(__dirname, 'src/background/background.ts'),
        content: path.resolve(__dirname, 'src/content/content.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return '[name].js'
          }
          return 'assets/[name]-[hash].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: 'dist',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
