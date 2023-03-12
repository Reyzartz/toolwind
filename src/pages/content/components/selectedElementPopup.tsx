import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import {
  addTemporaryClassName,
  getClassNames,
  removeClassNames,
  updateClassName
} from '../utils'
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
    (name: string) => {
      setClassNames(removeClassNames(element, name) as string[])
    },
    [element]
  )

  const updateClassNameHandler = useCallback(
    (ind: number, updatedClassName: string) => {
      setClassNames(updateClassName(element, ind, updatedClassName))
    },
    [element]
  )

  const addActiveOptionClassName = useCallback(
    (ind: number, newClassNameOption: string) => {
      // adding an extra className to the end of the existing classnames
      addTemporaryClassName(element, classNames, ind, newClassNameOption)
    },
    [element]
  )

  return (
    <>
      <div
        ref={setReferenceElement as any}
        className=':uno: fixed z-[-10000]'
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
        <div className=':uno: bg-indigo-900 shadow-md p-3 rounded-lg text-sm text-slate-200 lowercase'>
          <div className=':uno: p-3 w-72 bg-indigo-800 border border-indigo-600 rounded-md flex flex-wrap gap-2'>
            {classNames.map((name, ind) => (
              <ClassNameTag
                key={ind}
                name={name}
                onDelete={() => deleteClassNameHandler(name)}
                onChange={name => updateClassNameHandler(ind, name)}
                onActiveOptionChange={name =>
                  addActiveOptionClassName(ind, name)
                }
              />
            ))}
          </div>
        </div>

        <div
          id='toolwind-arrow'
          ref={setArrowElement as any}
          style={styles.arrow}
          className=':uno: bg-indigo-900 border-transparent'
        />
      </div>
    </>
  )
}
