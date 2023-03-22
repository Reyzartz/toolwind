import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import contentCss from '../contentStyle/contentStyle.css?inline'

import 'virtual:uno.css'

// Main function for root
import { RecoilRoot } from 'recoil'
;(() => {
	const styles = document.createElement('style')
	styles.innerHTML = contentCss

	const root = document.createElement('toolwind-root')

	root.append(styles)

	document.querySelector('html')?.append(root)

	// TODO: remove the root when the extension is toggled off
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<RecoilRoot>
				<App />
			</RecoilRoot>
		</React.StrictMode>
	)
})()

export {}
