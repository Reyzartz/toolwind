import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './style.css'

// Main function for root
;(() => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})()

export {}
