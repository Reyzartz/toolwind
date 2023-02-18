import { useCallback, useEffect, useState } from 'react'
import { InspectedElementHighlighter } from './components'

const App = () => {
  const [inspectedElement, setInspectedElement] = useState<HTMLElement | null>(
    null
  )

  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null
  )

  const [isElementSelected, setIsElementSelected] = useState(false)

  // this function doesn't get the updated state values since it's inside a event listener
  const onHoverElementHandler = useCallback(
    (ele: HTMLElement) => {
      if (isElementSelected) return

      setInspectedElement(ele)
    },
    [isElementSelected, inspectedElement]
  )

  // this function doesn't get the updated state values since it's inside a event listener
  const onSelectElementHandler = useCallback(
    (ele: HTMLElement) => {
      setSelectedElement(ele)

      setIsElementSelected(true)
    },
    [isElementSelected, selectedElement]
  )

  const addEventListenerToAllElements = useCallback(function () {
    const allElements = (
      document.querySelector('body') as HTMLBodyElement
    ).querySelectorAll('*')

    allElements.forEach(element => {
      element.addEventListener('mouseover', e => {
        e.stopPropagation()

        onHoverElementHandler(element as HTMLElement)
      })

      element.addEventListener('click', e => {
        e.stopPropagation()

        if (!element.id.includes('toolwind')) {
          onSelectElementHandler(element as HTMLElement)
        }
      })
    })
  }, [])

  useEffect(() => {
    // this function need to run before any of the toolwind components are mounted
    addEventListenerToAllElements()
  }, [])

  return (
    <>
      <InspectedElementHighlighter element={inspectedElement} />

      {isElementSelected && (
        <InspectedElementHighlighter element={selectedElement} selected />
      )}
    </>
  )
}

export { App }
