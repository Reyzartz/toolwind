interface ClassNameTagProps {
  name: string
  onDelete: (e: any) => void
}

export const ClassNameTag = ({ name, onDelete }: ClassNameTagProps) => {
  return (
    <div className='bg-indigo-900 border border-indigo-600 rounded-[4px] max-w-max flex overflow-hidden cursor-pointer'>
      <div className='px-2 py-1  text-sm text-slate-300'>{name}</div>

      <button
        onClick={onDelete}
        className=' pr-2 font-4xl z-0 font-bold leading-none h-full transition-all hover:text-red-500'
      >
        ⤫
      </button>
    </div>
  )
}
