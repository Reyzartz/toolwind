import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.css'
import App from './app'

const root = document.getElementById('toolwind-popup-root')

ReactDOM.createRoot(root!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
