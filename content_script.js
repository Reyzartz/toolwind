function injectCSSStyles () {
  let cssLink = document.createElement('link')
  cssLink.href = chrome.runtime.getURL('/styles/index.css')
  cssLink.type = 'text/css'
  cssLink.rel = 'stylesheet'

  const head = document.querySelector('head')
  const body = document.querySelector('body')

  head.appendChild(cssLink)

  const allElements = body.querySelectorAll('*')

  let currentlyHoveredElement = null

  const popupElement = document.createElement('textarea')
  popupElement.rows = '4'
  popupElement.type = 'text'
  popupElement.className = 'toolwind-popup-element'

  popupElement.addEventListener('change', e => {
    currentlyHoveredElement.className = e.target.value
  })

  body.appendChild(popupElement)

  allElements.forEach(ele => {
    ele.addEventListener('mouseover', e => {
      e.stopPropagation()

      if (
        currentlyHoveredElement &&
        typeof currentlyHoveredElement.className === 'string'
      ) {
        currentlyHoveredElement.className =
          currentlyHoveredElement.className.replace(
            ' hovered-toolwind-element',
            ''
          )
      }

      currentlyHoveredElement = e.target

      console.log(currentlyHoveredElement.className)

      popupElement.value = currentlyHoveredElement.className

      currentlyHoveredElement.className += ' hovered-toolwind-element'

      Popper.createPopper(currentlyHoveredElement, popupElement, {
        placement: 'bottom'
      })
    })
  })
}

;(() => {
  injectCSSStyles()

  console.log('pp')
})()
