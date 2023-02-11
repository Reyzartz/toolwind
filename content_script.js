let hoveredElement,
  hoverPopupElement,
  selectedElement,
  selectedPopupElement,
  popper

function init () {
  hoveredElement = null
  selectedElement = null
  popper = null

  selectedPopupElement = document.createElement('textarea')
  hoverPopupElement = document.createElement('div')
}

function injectCSSStyles () {
  let cssLink = document.createElement('link')
  cssLink.href = chrome.runtime.getURL('/styles/index.css')
  cssLink.type = 'text/css'
  cssLink.rel = 'stylesheet'

  appendElementToHead(cssLink)
}

function addPopupTool () {
  appendClassNames(hoverPopupElement, ['toolwind-hovered-popup-element'])
  appendClassNames(selectedPopupElement, ['toolwind-selected-popup-element'])

  selectedPopupElement.rows = 5

  selectedPopupElement.addEventListener('keyup', e => {
    selectedElement.className = e.target.value + ' selected-toolwind-element'
  })

  appendElementToBody(selectedPopupElement)
  appendElementToBody(hoverPopupElement)
}

function addEventListenerToAllElements () {
  const allElements = document.querySelector('body').querySelectorAll('*')

  allElements.forEach(ele => {
    ele.addEventListener('click', e => {
      e.stopPropagation()

      console.log('se')

      removeCustomClassNames(selectedElement)

      if (selectedElement !== null) {
        selectedElement = null

        return
      } else {
        selectedElement = e.target

        selectedPopupElement.value = getClassNames(e.target).join(' ')

        appendClassNames(selectedElement, ['selected-toolwind-element'])
      }

      setPopperElement(selectedElement, selectedPopupElement)
    })
  })

  allElements.forEach(ele => {
    ele.addEventListener('mouseover', e => {
      e.stopPropagation()

      console.log('ho')

      if (selectedElement !== null) {
        hoveredElement = null

        return
      } else {
        removeCustomClassNames(hoveredElement)

        hoveredElement = e.target

        hoverPopupElement.innerText = getClassNames(e.target).join(' ')

        appendClassNames(hoveredElement, ['hovered-toolwind-element'])
      }

      setPopperElement(hoveredElement, hoverPopupElement)
    })
  })
}

function setPopperElement (reference, popup) {
  if (popper !== null) {
    popper.destroy()
  }

  popper = Popper.createPopper(reference, popup, {
    placement: 'bottom-end'
  })
}

;(() => {
  init()
  injectCSSStyles()
  addEventListenerToAllElements()
  addPopupTool()

  console.log('pp')
})()
