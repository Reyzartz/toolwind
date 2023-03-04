import { Combobox } from '@headlessui/react'
import { ChangeEvent, Fragment, useCallback } from 'react'
import { CSSClassObject } from '../../../types/common'

const CssPropertiesDisplay = ({ name, cssProperty }: CSSClassObject) => {
  return (
    <div className=':uno: absolute left-45 top-full m-4 min-w-56 z-[10001] bg-indigo-900 text-indigo-400 text-xs border px-2 py-1 border-indigo-600 rounded-md'>
      <span className=':uno: text-orange-500'>.{name}</span>{' '}
      <span className=':uno: text-purple-500'>&#123;</span>
      <div>
        {cssProperty?.map(({ key, value }) => (
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
}

const ClassNameInput = ({
  classNames,
  onChange,
  defaultValue,
  onBlur
}: ClassNameInputProps) => {
  const onChangeHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value)
    },
    []
  )

  return (
    <Combobox
      onChange={({ name }) => onChange(name)}
      as='div'
      className=':uno: relative'
      defaultValue={defaultValue}
    >
      {({ activeOption }) => (
        <>
          <Combobox.Input
            className=':uno: !mx-2 !my-1 text-inherit !bg-transparent !text-sm focus:!outline-none focus:!border-b border-indigo-600'
            onChange={onChangeHandler}
            displayValue={({ name }: CSSClassObject) => name}
            onBlur={onBlur}
            autoFocus
          />

          {activeOption !== null && <CssPropertiesDisplay {...activeOption} />}

          <Combobox.Options
            as='ul'
            className=':uno: flex flex-col mt-2 absolute z-[10000] top-full max-h-48 left-0 overflow-scroll w-48 bg-indigo-900 rounded-lg border border-indigo-600 p-2'
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
