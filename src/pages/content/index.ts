import { createPopper, Instance as PopperInstance } from '@popperjs/core'
import {
  appendClassNames,
  appendElementToBody,
  removeCustomClassNames,
  getClassNames
} from './utils'
import './style.css'

let hoveredElement: HTMLElement | null,
  hoverPopupElement: HTMLElement,
  selectedElement: HTMLElement | null,
  selectedPopupElement: HTMLTextAreaElement,
  popper: PopperInstance | null

function init () {
  hoveredElement = null
  selectedElement = null
  popper = null

  selectedPopupElement = document.createElement('textarea')
  hoverPopupElement = document.createElement('div')
}

function addPopupTool () {
  appendClassNames(hoverPopupElement, ['toolwind-hovered-popup-element'])
  appendClassNames(selectedPopupElement, ['toolwind-selected-popup-element'])

  selectedPopupElement.rows = 5

  selectedPopupElement.addEventListener('keyup', e => {
    if (selectedElement === null) return
    selectedElement.className =
      (e.target as typeof selectedPopupElement).value +
      ' selected-toolwind-element'
  })

  appendElementToBody(selectedPopupElement)
  appendElementToBody(hoverPopupElement)
}

function addEventListenerToAllElements () {
  const allElements = (
    document.querySelector('body') as HTMLBodyElement
  ).querySelectorAll('*')

  allElements.forEach(ele => {
    ele.addEventListener('click', e => {
      e.stopPropagation()

      if (selectedElement !== null) {
        removeCustomClassNames(selectedElement)
      }

      if (selectedElement !== null) {
        selectedElement = null

        return
      } else {
        selectedElement = e.target as HTMLElement

        selectedPopupElement.value = getClassNames(
          e.target as HTMLElement
        ).join(' ')

        appendClassNames(selectedElement, ['selected-toolwind-element'])
      }

      setPopperElement(selectedElement, selectedPopupElement)
    })
  })

  allElements.forEach(ele => {
    ele.addEventListener('mouseover', e => {
      e.stopPropagation()

      if (hoveredElement !== null) {
        removeCustomClassNames(hoveredElement)
      }

      if (selectedElement !== null) {
        hoveredElement = null

        return
      } else {
        hoveredElement = e.target as HTMLElement

        hoverPopupElement.innerText = getClassNames(
          e.target as HTMLElement
        ).join(' ')

        console.log('e', hoverPopupElement.innerText)

        appendClassNames(hoveredElement, ['hovered-toolwind-element'])
      }

      setPopperElement(hoveredElement, hoverPopupElement)
    })
  })
}

function setPopperElement (reference: HTMLElement, popup: HTMLElement) {
  if (popper !== null) {
    popper.destroy()
  }

  popper = createPopper(reference, popup, {
    placement: 'bottom-end'
  })
}

;(() => {
  console.log(document)

  init()
  addEventListenerToAllElements()
  addPopupTool()

  console.log('pp')
})()
