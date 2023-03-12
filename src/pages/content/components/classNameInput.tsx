import { Combobox } from '@headlessui/react'
import { ChangeEvent, Fragment, useCallback, useEffect } from 'react'
import { CSSClassObject, CSSProperty } from '../../../types/common'

interface CssPropertiesDisplayProps {
  onActiveOptionChange: (newClassNameOption: string) => void
  className: string
  cssProperties?: CSSProperty[]
}

const CssPropertiesDisplay = ({
  className,
  cssProperties,
  onActiveOptionChange
}: CssPropertiesDisplayProps) => {
  useEffect(() => {
    onActiveOptionChange(className)
  }, [className])

  return (
    <div className=':uno: absolute left-45 top-full m-4 min-w-56 z-[10001] bg-indigo-900 text-indigo-400 text-xs border px-2 py-1 border-indigo-600 rounded-md'>
      <span className=':uno: text-orange-500'>.{className}</span>{' '}
      <span className=':uno: text-purple-500'>&#123;</span>
      <div>
        {cssProperties?.map(({ key, value }) => (
          <div key={key}>
            <span>{key}</span>:{' '}
            <span className=':uno: text-red-500'>{value}</span>
          </div>
        ))}
      </div>
      <span className=':uno: text-purple-500'>&#125;</span>
    </div>
  )
}

interface ClassNameInputProps {
  onChange: (value: string) => void
  onBlur: () => void
  classNames: CSSClassObject[]
  defaultValue?: CSSClassObject
  onActiveOptionChange: (newClassNameOption: string) => void
}

const ClassNameInput = ({
  classNames,
  onChange,
  defaultValue,
  onBlur,
  onActiveOptionChange
}: ClassNameInputProps) => {
  const onTextInputChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value)
      console.log('eventValues', event.target.value)
    },
    []
  )

  const onChangeHandler = useCallback(({ name }: CSSClassObject) => {
    console.log('change', name)

    onChange(name)
  }, [])

  return (
    <Combobox
      as='div'
      className=':uno: relative'
      onChange={onChangeHandler}
      defaultValue={defaultValue}
    >
      {({ activeOption }) => (
        <>
          <Combobox.Input
            className=':uno: !mx-2 !my-1 text-inherit !bg-transparent !text-sm focus:!outline-none focus:!border-b border-indigo-600'
            onChange={onTextInputChangeHandler}
            displayValue={({ name }: CSSClassObject) => name}
            onBlur={onBlur}
            autoFocus
          />

          <span className=':uno: absolute top-1 left-2 text-sm text-inherit opacity-50'>
            {activeOption?.name}
          </span>

          {activeOption !== null && (
            <CssPropertiesDisplay
              className={activeOption.name}
              cssProperties={activeOption.cssProperty}
              onActiveOptionChange={onActiveOptionChange}
            />
          )}

          <Combobox.Options
            as='ul'
            className=':uno: flex flex-col mt-2 absolute z-[10000] top-full max-h-48 left-0 overflow-scroll w-48 bg-indigo-900 rounded-lg border border-indigo-600 p-2'
            static
          >
            {classNames.map(cssObject => (
              <Combobox.Option
                key={cssObject.name}
                value={cssObject}
                as={Fragment}
              >
                {({ active }) => (
                  <li
                    className={`:uno: flex justify-between text-indigo-400 font-semibold text-sm border-b px-2 py-1 border-indigo-800 rounded-md ${
                      active ? 'bg-indigo-800' : ''
                    }`}
                  >
                    {cssObject.name}
                  </li>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </>
      )}
    </Combobox>
  )
}

export { ClassNameInput }
