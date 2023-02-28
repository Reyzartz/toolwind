import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { CSSClassObject } from '../types/common'
import { isClassNameValid, searchForCss } from '../utils'
import { ClassNameInput } from './classNameInput'

interface ClassNameTagProps {
  name: string
  onDelete: (e: any) => void
  onChange: (name: string) => void
}

export const ClassNameTag = ({
  name,
  onDelete,
  onChange
}: ClassNameTagProps) => {
  //TODO: use a reducer from and store default values of the class name

  const [isEditing, setIsEditing] = useState(false)
  const [isValid, setIsValid] = useState(isClassNameValid(name))
  const [suggestedClasses, setSuggestedClasses] = useState<CSSClassObject[]>([])

  const onChangeHandler = useCallback(
    (value: string) => {
      if (isClassNameValid(value)) {
        onChange(value)
      }

      setSuggestedClasses(searchForCss(value))
      setIsValid(isClassNameValid(value))
    },
    [onChange]
  )

  const onBlurHandler = useCallback(() => {
    setIsValid(isClassNameValid(name))
    setIsEditing(false)
  }, [])

  return (
    <div
      className=':uno: relative bg-indigo-900 border border-solid border-indigo-600 rounded-[4px] max-w-max flex cursor-pointer'
      style={{
        color: isValid ? 'white' : 'red'
      }}
    >
      {isEditing ? (
        <ClassNameInput
          classNames={suggestedClasses}
          onChange={onChangeHandler}
          defaultValue={{ name }}
          onBlur={onBlurHandler}
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className=':uno: px-2 py-1 text-sm text-inherit border-none bg-transparent'
        >
          {name}
        </button>
      )}

      <button
        onClick={onDelete}
        className=':uno: pr-2 z-0 font-bold leading-none bg-transparent border-none h-full transition-all text-slate-400 hover:text-red-500'
      >
        ⤫
      </button>
    </div>
  )
}
