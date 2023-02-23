import { useMemo, useState } from 'react'
import { getClassNames } from '../utils'
import { ClassNamesTooltip, SelectedElementPopup } from '.'

interface ElementOverlayProps {
  element: HTMLElement | null
  selected?: boolean
}

const InspectedElementHighlighter = ({
  element,
  selected = false
}: ElementOverlayProps): JSX.Element | null => {
  const rect = useMemo(() => element?.getClientRects()[0], [element])

  if (element === null || rect === undefined) return null

  return (
    <>
      {selected ? (
        <SelectedElementPopup element={element} />
      ) : (
        <ClassNamesTooltip
          classNames={getClassNames(element)}
          tagName={element.nodeName}
          rect={rect}
        />
      )}

      {/* inspected Element Highted  */}
      <div
        id='toolwind-highlight-bar-t'
        className=':uno: bg-purple-600 fixed z-[10000]'
        style={{
          top: rect.y,
          left: rect.x,
          width: rect.width,
          height: 10
        }}
      />

      <div
        id='toolwind-highlight-bar-b'
        className=':uno: border border-solid border-purple-600 fixed z-[10000]'
        style={{
          top: rect.y + rect.height,
          left: rect.x,
          width: rect.width
        }}
      />

      <div
        id='toolwind-highlight-bar-l'
        className=':uno: border border-solid border-purple-600 fixed z-[10000]'
        style={{
          top: rect.y,
          left: rect.x,
          height: rect.height
        }}
      />

      <div
        id='toolwind-highlight-bar-r'
        className=':uno: border border-solid border-purple-600 fixed z-[10000]'
        style={{
          top: rect.y,
          left: rect.x + rect.width - 2,
          height: rect.height
        }}
      />
    </>
  )
}

export { InspectedElementHighlighter }
