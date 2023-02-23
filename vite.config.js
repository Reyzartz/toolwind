import react from '@vitejs/plugin-react-swc'
import { crx } from '@crxjs/vite-plugin'
import { resolve, parse } from 'path'
import { defineConfig } from 'vite'
import manifest from './src/manifest'
import UnoCSS from 'unocss/vite'

const root = resolve(__dirname, 'src')
const pagesDir = resolve(root, 'pages')
const assetsDir = resolve(root, 'assets')
const outDir = resolve(__dirname, 'dist')
const publicDir = resolve(__dirname, 'public')

export default defineConfig({
  plugins: [
    react(),
    UnoCSS({}),
    crx({
      manifest,
      contentScripts: {
        injectCss: true
      }
    })
  ],

  resolve: {
    alias: {
      '@src': root,
      '@assets': assetsDir,
      '@pages': pagesDir
    }
  },
  publicDir,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        panel: resolve(pagesDir, 'panel', 'index.html'),
        content: resolve(pagesDir, 'content', 'main.tsx'),
        background: resolve(pagesDir, 'background', 'index.ts'),
        devtools: resolve(pagesDir, 'devtools', 'index.html'),
        options: resolve(pagesDir, 'options', 'index.html'),
        contentStyle: resolve(pagesDir, 'contentStyle', 'contentStyle.css'),
        popup: resolve(pagesDir, 'popup', 'index.html')
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const { dir, name: _name } = parse(assetInfo.name)
          const assetFolder = dir.split('/').at(-1)
          const name = assetFolder + _name
          return `assets/[ext]/${name}.[hash].[ext]`
        }
      }
    }
  }
})
