import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import contentCss from '../contentStyle/contentStyle.css'

// Main function for root
;(() => {
  // temporary solution for injecting css
  const styles = document.createElement('style')
  styles.innerHTML = contentCss

  const root = document.createElement('div')
  root.id = 'toolwind-root'
  document.body.append(root)
  document.body.append(styles)

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})()

export {}
