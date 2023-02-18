import { useState } from 'react'
import { usePopper } from 'react-popper'

interface ClassNamesTooltipProps {
  classNames: string[]
  tagName: string
  rect: DOMRect
}

export const ClassNamesTooltip = ({
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
