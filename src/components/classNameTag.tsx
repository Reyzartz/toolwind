import { useCSSClasses } from '@toolwind/content/hooks/useCssClasses'
import { type CSSClass } from '@toolwind/types/common'
import { type MouseEventHandler, useCallback, useRef } from 'react'
import { ClassNameInput } from './classNameInput'
import { CloseIcon } from '@toolwind/icons'
import clsx from 'clsx'
import ReactCodeMirror from '@uiw/react-codemirror'
import { css } from '@codemirror/lang-css'
import { useTailwindIntellisense } from '@toolwind/content/hooks/useTailwindIntellisense'
import { useAsync } from 'react-use'
import { editorTheme } from '@toolwind/helpers/constant'
import { EditorView } from '@codemirror/view'
interface ClassNameTagProps {
	cssClass: CSSClass
}

export const getCssClassPropertiesFromCssText = (cssText: string) => {
	let propertyText = cssText.slice(
		cssText.indexOf('{') + 1,
		cssText.indexOf('}')
	)
	propertyText = propertyText.slice(0, propertyText.lastIndexOf(';'))
	return propertyText.split(';').map((property) => {
		const [key, value] = property.split(':')
		return {
			key: key?.trim(),
			value: value?.trim()
		}
	})
}

export const ClassNameTag = ({
	cssClass: { id, className, meta, state, defaultClassName }
}: ClassNameTagProps) => {
	const { updateCssClass, removeCssClass, isEditing, setIsEditing } =
		useCSSClasses()
	const tagRef = useRef<HTMLDivElement>(null)
	const { getCssText } = useTailwindIntellisense()

	const onUpdateHandler = useCallback(
		(value: string) => {
			void updateCssClass(id, { className: value, state: 'active' })

			setIsEditing(false)
		},
		[id, setIsEditing, updateCssClass]
	)

	const onClickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(
		(e) => {
			e.stopPropagation()
			if (state === 'removed') return

			void updateCssClass(id, { state: 'editing' })
		},
		[id, state, updateCssClass]
	)

	const onDeleteHandler: MouseEventHandler<HTMLButtonElement> = useCallback(
		(e) => {
			e.stopPropagation()

			if (defaultClassName === null) {
				removeCssClass(id)
			} else {
				void updateCssClass(id, { state: 'removed' })
			}
		},
		[defaultClassName, id, removeCssClass, updateCssClass]
	)

	const formattedCssText = useAsync(
		async () => await getCssText(className ?? ''),
		[className]
	)

	return (
		<div
			ref={tagRef}
			className={clsx(
				'group relative inline-flex max-w-max cursor-pointer items-center bg-light text-default transition'
			)}
		>
			{!isEditing && (
				<div className="pointer-events-none invisible absolute bottom-full z-[10000] mb-2 border border-default transition-all delay-0 group-hover:visible group-hover:delay-500">
					<ReactCodeMirror
						width="max-content"
						maxWidth="296px"
						value={formattedCssText.value ?? ''}
						className="bg-default p-1 text-xs shadow-xl"
						extensions={[css(), EditorView.lineWrapping]}
						editable={false}
						theme={editorTheme}
						basicSetup={{
							lineNumbers: false,
							foldGutter: false,
							syntaxHighlighting: false,
							highlightActiveLine: false
						}}
					/>
				</div>
			)}

			{state === 'editing' ? (
				<ClassNameInput
					initialWidth={tagRef.current?.getClientRects()[0].width}
					defaultValue={{ name: className, variants: [] }}
					onSave={onUpdateHandler}
				/>
			) : (
				<button
					onClick={onClickHandler}
					className={clsx(
						'flex items-center gap-1 border-none bg-transparent px-2 py-0.5 text-sm font-medium text-inherit',
						state === 'removed'
							? 'cursor-text line-through opacity-60'
							: 'cursor-pointer group-hover:text-primary group-active:text-primary-dark'
					)}
				>
					{meta.color !== null && state !== 'removed' && (
						<span
							className="rounded-1 inline-block h-3 w-3 border border-light"
							style={{ background: meta.color }}
						/>
					)}

					{className}
				</button>
			)}

			{state === 'active' && (
				<button
					onClick={onDeleteHandler}
					className="h-full border-none bg-transparent p-2 pl-0 transition-opacity group-hover:opacity-100"
				>
					<CloseIcon size={10} className="text-default hover:text-red-500" />
				</button>
			)}
		</div>
	)
}
