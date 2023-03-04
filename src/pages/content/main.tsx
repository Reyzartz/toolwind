import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import contentCss from '../contentStyle/contentStyle.css'

import 'virtual:uno.css'

// Main function for root
;(() => {
  // temporary solution for injecting css
  const styles = document.createElement('style')
  styles.innerHTML = contentCss

  // create a custom html component
  const root = document.createElement('toolwind-root')

  root.append(styles)

  document.querySelector('html')?.append(root)

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})()

export {}
