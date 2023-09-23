import React from 'react'
import ReactDOM from 'react-dom/client'
import css from '../index.css?inline'
import { RecoilRoot } from 'recoil'
import RecoilNexus from 'recoil-nexus'
import { type DestroyFn } from '@toolwind/types/components'

const renderReactComponent = (App: () => JSX.Element): DestroyFn => {
	const root = document.createElement('div')
	root.id = 'toolwind'
	root.attachShadow({ mode: 'open' })

	const style = document.createElement('style')
	style.innerText = css

	root.shadowRoot?.append(style)

	Object.assign(root.style, {
		position: 'fixed',
		zIndex: 10000
	})

	document.body.prepend(root)

	const renderRoot = ReactDOM.createRoot(root.shadowRoot!)

	// prevent global keyboard shortcuts when using an input field
	root.shadowRoot?.addEventListener('keypress', (e) => {
		e.stopPropagation()
	})

	root.shadowRoot?.addEventListener('keydown', (e) => {
		e.stopPropagation()
	})

	renderRoot.render(
		<React.StrictMode>
			<RecoilRoot>
				<RecoilNexus />
				<App />
			</RecoilRoot>
		</React.StrictMode>
	)

	return () => {
		if (root !== null) {
			renderRoot.unmount()
			root.remove()
		}
	}
}

export { renderReactComponent }
