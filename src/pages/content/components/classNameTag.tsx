import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { isClassNameValid } from '../utils'

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

  const onChangeHandler = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      if (isClassNameValid(value)) {
        onChange(value)
      }

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
      className='bg-indigo-900 border border-indigo-600 rounded-[4px] max-w-max flex overflow-hidden cursor-pointer'
      style={{
        color: isValid ? 'white' : 'red'
      }}
    >
      {isEditing ? (
        <input
          defaultValue={name}
          className='px-2 py-1 text-sm text-inherit bg-transparent max-w-max'
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          autoFocus
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className='px-2 py-1 text-sm text-inherit'
        >
          {name}
        </div>
      )}

      <button
        onClick={onDelete}
        className=' pr-2 font-4xl z-0 font-bold leading-none h-full transition-all text-slate-400 hover:text-red-500'
      >
        ⤫
      </button>
    </div>
  )
}
