import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from '../package.json'

const [major, minor, patch, label = '0'] = packageJson.version
	.replace(/[^\d.-]+/g, '')
	.split(/[.-]/)

const manifest = defineManifest(async () => ({
	manifest_version: 3,
	name: packageJson.displayName ?? packageJson.name,
	version: `${major}.${minor}.${patch}.${label}`,
	description: packageJson.description,
	background: {
		service_worker: 'src/background.ts',
		type: 'module'
	},
	action: {
		default_popup: 'src/index.html',
		default_icon: {
			'16': 'icons/logo-16.png',
			'24': 'icons/logo-24.png',
			'32': 'icons/disabled-logo-32.png'
		}
	},
	permissions: ['tabs', 'activeTab', 'storage', 'clipboardWrite'],
	icons: {
		'16': 'icons/logo-16.png',
		'32': 'icons/disabled-logo-32.png',
		'48': 'icons/logo-48.png',
		'128': 'icons/logo-128.png'
	},
	content_scripts: [
		{
			matches: ['http://*/*', 'https://*/*'],
			js: ['src/content/index.ts'],
			run_at: 'document_end'
		}
	],
	web_accessible_resources: [
		{
			resources: ['assets/js/*.js', 'assets/css/*.css', 'assets/img/*'],
			matches: ['http://*/*', 'https://*/*']
		}
	]
}))

export default manifest
