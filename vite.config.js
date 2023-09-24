import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import manifest from './src/manifest'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
	build: {
		terserOptions: {
			compress: {
				drop_console: true
			}
		},
		sourcemap: true
	},
	plugins: [
		nodePolyfills(),
		react(),
		crx({
			manifest,
			contentScripts: {
				injectCss: true
			}
		})
	],
	resolve: {
		alias: {
			src: path.resolve(__dirname, './src'),
			'@toolwind': path.resolve(__dirname, './src')
		}
	}
})
