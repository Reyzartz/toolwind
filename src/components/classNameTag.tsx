import { useCSSClasses } from '@toolwind/content/hooks/useCssClasses'
import { type CSSClass } from '@toolwind/types/common'
import { type MouseEventHandler, useCallback, useRef, useMemo } from 'react'
import { ClassNameInput } from './classNameInput'
import { CloseIcon } from '@toolwind/icons'
import clsx from 'clsx'
import ReactCodeMirror from '@uiw/react-codemirror'
import { css } from '@codemirror/lang-css'
import { useAsync } from 'react-use'
import { editorTheme } from '@toolwind/helpers/constant'
import { EditorView } from '@codemirror/view'
import cssbeautify from 'cssbeautify'
import { tailwindAutoComplete } from '@toolwind/content'

interface ClassNameTagProps {
	cssClass: CSSClass
	index: number
}

export const ClassNameTag = ({
	cssClass: { id, className, meta, state, defaultClassName, cssText },
	index
}: ClassNameTagProps) => {
	const tagRef = useRef<HTMLDivElement>(null)

	const { updateCssClass, removeCssClass, isEditing, setIsEditing } =
		useCSSClasses()

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
		async () =>
			cssbeautify(
				cssText ?? (await tailwindAutoComplete.getCssText(className ?? '')) ?? ''
			),
		[className]
	)

	const defaultValue = useMemo(
		() => ({
			name: className,
			color: tailwindAutoComplete.getColor(className),
			variants: tailwindAutoComplete.getVariantsFromClassName(className),
			isVariant: false,
			important: className.includes('!')
		}),
		[className]
	)

	return (
		<div
			ref={tagRef}
			className={clsx(
				'group relative inline-flex max-w-max cursor-pointer items-center bg-light text-default ring-primary ring-opacity-70 transition focus-within:ring-2'
			)}
		>
			{!isEditing &&
				formattedCssText.value !== undefined &&
				formattedCssText.value.length > 0 && (
					<div className="pointer-events-none invisible absolute bottom-full z-[10000] mb-2 border border-default transition-all delay-0 group-hover:visible group-hover:delay-500">
						<ReactCodeMirror
							width="max-content"
							maxWidth="296px"
							indentWithTab
							value={formattedCssText.value}
							className="bg-default p-1 text-xs shadow-xl"
							extensions={[css(), EditorView.lineWrapping]}
							editable={false}
							theme={editorTheme}
							basicSetup={{
								lineNumbers: false,
								foldGutter: false,
								syntaxHighlighting: false,
								highlightActiveLine: false,
								indentOnInput: true
							}}
						/>
					</div>
				)}

			{state === 'editing' ? (
				<ClassNameInput
					initialWidth={tagRef.current?.getClientRects()[0].width}
					defaultValue={defaultValue}
					onSave={onUpdateHandler}
				/>
			) : (
				<button
					autoFocus={index === 0}
					onClick={onClickHandler}
					className={clsx(
						'flex items-center gap-1 border-none bg-transparent px-2 py-0.5 text-sm font-medium text-inherit outline-none',
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
					tabIndex={-1}
					onClick={onDeleteHandler}
					className="h-full border-none bg-transparent p-2 pl-0 outline-none transition-opacity group-hover:opacity-100"
				>
					<CloseIcon size={10} className="text-default hover:text-red-500" />
				</button>
			)}
		</div>
	)
}
