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
			value: value?.trim(),
		}
	})
}

export const ClassNameTag = ({
	cssClass: { id, className, meta, state, defaultClassName },
}: ClassNameTagProps) => {
	const { updateCssClass, removeCssClass } = useCSSClasses()
	const tagRef = useRef<HTMLDivElement>(null)
	const { getCssText } = useTailwindIntellisense()

	const onUpdateHandler = useCallback(
		(value: string) => {
			void updateCssClass(id, { className: value, state: 'active' })
		},
		[id, updateCssClass]
	)

	const onClickHandler: React.MouseEventHandler<HTMLButtonElement> =
		useCallback(
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

	console.log('formattedCssText', formattedCssText)

	return (
		<div
			ref={tagRef}
			className={clsx(
				'relative transition max-w-max inline-flex items-center cursor-pointer group bg-light text-default'
			)}
		>
			{state !== 'editing' && (
				<div className="absolute hidden group-hover:block bottom-full mb-2 z-[10000] border border-default">
					<ReactCodeMirror
						width="max-content"
						maxWidth="296px"
						value={formattedCssText.value ?? ''}
						className="text-xs p-1 bg-default shadow-xl"
						extensions={[css(), EditorView.lineWrapping]}
						editable={false}
						theme={editorTheme}
						basicSetup={{
							lineNumbers: false,
							foldGutter: false,
							syntaxHighlighting: false,
							highlightActiveLine: false,
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
						'flex items-center gap-1 px-2 py-0.5 text-sm text-inherit border-none bg-transparent font-medium',
						state === 'removed'
							? 'line-through cursor-text opacity-60'
							: 'cursor-pointer group-hover:text-primary group-active:text-primary-dark'
					)}
				>
					{meta.color !== null && state !== 'removed' && (
						<span
							className="w-3 h-3 inline-block border border-light rounded-1"
							style={{ background: meta.color }}
						/>
					)}

					{className}
				</button>
			)}

			{state === 'active' && (
				<button
					onClick={onDeleteHandler}
					className="p-2 pl-0 bg-transparent border-none h-full group-hover:opacity-100 transition-opacity"
				>
					<CloseIcon size={10} className="text-default hover:text-red-500" />
				</button>
			)}
		</div>
	)
}
