import React from 'react'
import ReactDOM from 'react-dom/client'
import css from '../index.css?inline'
import { RecoilRoot } from 'recoil'

const renderReactComponent = (App: () => JSX.Element) => {
	const root = document.createElement('div')
	root.id = 'toolwind'
	root.attachShadow({ mode: 'open' })

	const style = document.createElement('style')
	style.innerText = css

	root.shadowRoot?.append(style)

	Object.assign(root.style, {
		position: 'fixed',
		zIndex: 10000,
	})

	document.body.prepend(root)

	const renderRoot = ReactDOM.createRoot(root.shadowRoot!)

	renderRoot.render(
		<React.StrictMode>
			<RecoilRoot>
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
