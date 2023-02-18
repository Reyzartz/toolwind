import { useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { getClassNames } from '../utils'

interface ClassNamesTooltipProps {
  classNames: string[]
  tagName: string
  rect: DOMRect
}

const ClassNamesTooltip = ({
  classNames,
  tagName,
  rect
}: ClassNamesTooltipProps) => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',

    modifiers: [
      { name: 'arrow', options: { element: arrowElement, padding: 8 } },
      {
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      }
    ]
  })

  return (
    <>
      <div
        ref={setReferenceElement as any}
        className='fixed z-[-10000]'
        style={{
          top: rect.y,
          left: rect.x,
          width: rect.width,
          height: rect.height
        }}
      />

      <div
        id='toolwind-tooltip'
        key={`${rect.y + rect.x}`}
        ref={setPopperElement as any}
        style={{ ...styles.popper, zIndex: 10000 }}
        {...attributes.popper}
      >
        <div className='bg-purple-600 min-w-[48px] border border-white shadow-md px-3 py-1 rounded-md text-sm text-slate-200 lowercase'>
          {`${tagName}# ${
            classNames.length === 0 ? '' : classNames.join(', ')
          }`}
        </div>

        <div
          id='toolwind-arrow'
          ref={setArrowElement as any}
          style={styles.arrow}
          className='bg-purple-600 border border-white'
        />
      </div>
    </>
  )
}

interface ElementOverlayProps {
  element: HTMLElement | null
}

const InspectedElementHighlighter = ({
  element
}: ElementOverlayProps): JSX.Element | null => {
  const rect = useMemo(() => element?.getClientRects()[0], [element])

  if (element === null || rect === undefined) return null

  return (
    <>
      <ClassNamesTooltip
        classNames={getClassNames(element)}
        tagName={element.nodeName}
        rect={rect}
      />

      {/* inspected Element Highted border */}
      <div
        id='toolwind-highlight-bar'
        className='border-t border-purple-600 fixed z-[10000]'
        style={{
          top: rect.y,
          left: rect.x,
          width: rect.width
        }}
      />

      <div
        id='toolwind-highlight-bar'
        className='border-b border-purple-600 fixed z-[10000]'
        style={{
          top: rect.y + rect.height,
          left: rect.x,
          width: rect.width
        }}
      />

      <div
        id='toolwind-highlight-bar'
        className='border-l border-purple-600 fixed z-[10000]'
        style={{
          top: rect.y,
          left: rect.x,
          height: rect.height
        }}
      />

      <div
        id='toolwind-highlight-bar'
        className='border-r border-purple-600 fixed z-[10000]'
        style={{
          top: rect.y,
          left: rect.x + rect.width,
          height: rect.height
        }}
      />
    </>
  )
}

export { InspectedElementHighlighter }
