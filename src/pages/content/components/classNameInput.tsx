import { Combobox, Portal } from '@headlessui/react'
import { ChangeEvent, Fragment, useCallback } from 'react'

interface ClassNameInputProps {
  onChange: (value: string) => void
  onBlur: () => void
  classNames: string[]
  defaultValue?: string
}

const ClassNameInput = ({
  classNames,
  onChange,
  defaultValue = '',
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
      onChange={onChange as any}
      as='div'
      className=':uno: relative'
      defaultValue={defaultValue}
    >
      <Combobox.Input
        className=':uno: px-2 py-1 text-inherit bg-transparent text-sm'
        onChange={onChangeHandler}
        onBlur={onBlur}
        autoFocus
      />

      <Combobox.Options
        as='ul'
        className=':uno: flex flex-col mt-2 absolute z-[10000] top-full max-h-48 left-0 overflow-scroll w-48 bg-indigo-900 rounded-lg border border-indigo-600 p-2'
      >
        {classNames.map(name => (
          <Combobox.Option key={name} value={name} as={Fragment}>
            {({ active }) => (
              <li
                className={`:uno: text-indigo-400 font-semibold text-sm border-b px-2 py-1 border-indigo-800 rounded-md ${
                  active ? 'bg-indigo-800' : ''
                }`}
              >
                {name}
              </li>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}

export { ClassNameInput }
