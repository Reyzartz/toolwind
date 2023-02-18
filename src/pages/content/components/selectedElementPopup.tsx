import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { getClassNames, removeClassNames } from '../utils'
import { ClassNameTag } from '.'

interface SelectedElementPopupProps {
  element: HTMLElement
}

export const SelectedElementPopup = ({
  element
}: SelectedElementPopupProps) => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)

  const [classNames, setClassNames] = useState(getClassNames(element))

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-end',

    modifiers: [
      { name: 'arrow', options: { element: arrowElement, padding: 16 } },
      {
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      }
    ]
  })

  useLayoutEffect(() => {
    setClassNames(getClassNames(element))
  }, [element])

  const rect = useMemo(() => element.getClientRects()[0], [element])

  const deleteClassNameHandler = useCallback(
    (e: Event, name: string) => {
      e.stopPropagation()

      setClassNames(removeClassNames(element, name) as string[])
    },
    [element]
  )

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
        <div className='bg-indigo-900 w-64  shadow-md p-3 rounded-lg text-sm text-slate-200 lowercase '>
          <div className='p-3 bg-indigo-800 border border-indigo-600 rounded-md flex flex-wrap gap-2'>
            {classNames.map((name, ind) => (
              <ClassNameTag
                key={`${name + ind}`}
                name={name}
                onDelete={(e: any) => deleteClassNameHandler(e, name)}
              />
            ))}
          </div>
        </div>

        <div
          id='toolwind-arrow'
          ref={setArrowElement as any}
          style={styles.arrow}
          className='bg-indigo-900 border-transparent'
        />
      </div>
    </>
  )
}
