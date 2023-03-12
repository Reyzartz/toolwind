import { useCallback, useState } from 'react'
import { CSSClassObject } from '../../../types/common'
import { isClassNameValid, searchForCss } from '../utils'
import { ClassNameInput } from './classNameInput'

interface ClassNameTagProps {
  name: string
  onDelete: React.MouseEventHandler<HTMLButtonElement>
  onChange: (name: string) => void
  onActiveOptionChange: (newClassNameOption: string) => void
}

export const ClassNameTag = ({
  name,
  onDelete,
  onChange,
  onActiveOptionChange
}: ClassNameTagProps) => {
  //TODO: use a reducer from and store default values of the class name

  const [isEditing, setIsEditing] = useState(false)
  const [isValid, setIsValid] = useState(isClassNameValid(name))
  const [suggestedClasses, setSuggestedClasses] = useState<CSSClassObject[]>([])

  const onChangeHandler = useCallback(
    (value: string) => {
      onChange(value)

      setSuggestedClasses(searchForCss(value))
      setIsValid(isClassNameValid(value))
    },
    [onChange]
  )

  const onBlurHandler = useCallback(() => {
    // onChange(name)

    setIsValid(isClassNameValid(name))
    setIsEditing(false)
  }, [name])

  const onClickHandler: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(e => {
      e.stopPropagation()
      setIsEditing(true)
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
          onActiveOptionChange={onActiveOptionChange}
        />
      ) : (
        <button
          onClick={onClickHandler}
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
