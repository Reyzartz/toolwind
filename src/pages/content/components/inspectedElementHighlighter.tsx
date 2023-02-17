import ReactDOM from 'react-dom'
import { useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { getClassNames } from '../utils'

interface ClassNamesTooltipProps {
  classNames: string[]
  tagName: string
}

const ClassNamesTooltip = ({ classNames, tagName }: ClassNamesTooltipProps) => {
  return (
    <div className='bg-white shadow-md px-3 py-1 rounded-b-lg text-sm text-slate-600 lowercase'>
      {`${tagName}# ${
        classNames.length === 0 ? 'No Classes Found' : classNames.join(', ')
      }`}
    </div>
  )
}

interface ElementOverlayProps {
  element: HTMLElement | null
}

const InspectedElementHighlighter = ({
  element
}: ElementOverlayProps): JSX.Element | null => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',
    modifiers: []
  })

  const rect = useMemo(() => element?.getClientRects()[0], [element])

  if (element === null || rect === undefined) return null

  return (
    <>
      <div
        ref={setReferenceElement as any}
        className='border-t border-purple-400 fixed z-[-10000]'
        style={{
          top: rect.y,
          left: rect.x,
          width: rect.width,
          height: rect.height
        }}
      />

      <div
        key={`${rect.y + rect.x}`}
        ref={setPopperElement as any}
        style={{ ...styles.popper, zIndex: 10000 }}
        {...attributes.popper}
      >
        <ClassNamesTooltip
          classNames={getClassNames(element)}
          tagName={element.nodeName}
        />
      </div>

      <div
        id='toolwind-highlight-bar'
        className='border-t border-purple-400 fixed z-[10000]'
        style={{
          top: rect.y,
          left: rect.x,
          width: rect.width
        }}
      />

      <div
        id='toolwind-highlight-bar'
        className='border-b border-purple-400 fixed z-[10000]'
        style={{
          top: rect.y + rect.height,
          left: rect.x,
          width: rect.width
        }}
      />

      <div
        id='toolwind-highlight-bar'
        className='border-l border-purple-400 fixed z-[10000]'
        style={{
          top: rect.y,
          left: rect.x,
          height: rect.height
        }}
      />

      <div
        id='toolwind-highlight-bar'
        className='border-r border-purple-400 fixed z-[10000]'
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
