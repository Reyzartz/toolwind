import { useLayoutEffect, useMemo, useState } from 'react'
import { usePopper } from 'react-popper'
import { AddClassName, ClassNameTag } from '.'
import { useRecoilTransaction_UNSTABLE, useRecoilValue } from 'recoil'
import {
	activeClassObjectState,
	classObjectsState,
	selectedElementAtomState,
	selectedElementState
} from '../store'
import { getClassObjectFromClassName } from '../utils'

export const SelectedElementPopup = () => {
	const element = useRecoilValue(selectedElementState) as HTMLElement

	const [referenceElement, setReferenceElement] = useState(null)
	const [popperElement, setPopperElement] = useState(null)
	const [arrowElement, setArrowElement] = useState(null)

	const classObjects = useRecoilValue(classObjectsState)

	const activeClassObject = useRecoilValue(activeClassObjectState)

	const { styles, attributes } = usePopper(referenceElement, popperElement, {
		placement: 'bottom-end',

		modifiers: [
			{ name: 'arrow', options: { element: arrowElement, padding: 16 } },
			{
				name: 'offset',
				options: {
					offset: [0, 8]
				}
			}
		]
	})

	const rect = useMemo(() => element.getClientRects()[0], [element])

	useLayoutEffect(() => {
		setClassNamesToElement()
	}, [classObjects, activeClassObject])

	const setClassNamesToElement = useRecoilTransaction_UNSTABLE(
		({ get }) =>
			() => {
				const classObjects = [...get(classObjectsState)]

				const selectedElement = get(selectedElementAtomState)

				const activeClassObject = get(activeClassObjectState)

				if (activeClassObject !== null) classObjects.push(activeClassObject)

				if (selectedElement === null) return

				selectedElement.className = classObjects
					.map(({ displayName }) => displayName)
					.join(' ')
			},
		[]
	)

	const deleteClassNameHandler = useRecoilTransaction_UNSTABLE(
		({ set, get }) =>
			(id) => {
				const updatedClassObjects = get(classObjectsState).filter(
					(classObject) => classObject.id !== id
				)

				set(classObjectsState, updatedClassObjects)
			},
		[]
	)

	const updateClassNameHandler = useRecoilTransaction_UNSTABLE(
		({ set, get }) =>
			(id: String, className: string) => {
				const updatedClassObjects = get(classObjectsState).map(
					(classObject) => {
						if (id !== classObject.id) return classObject

						return {
							...classObject,
							displayName:
								classObject.pseudoClassName !== undefined
									? `${classObject.pseudoClassName}:${className}`
									: className,
							className
						}
					}
				)

				set(classObjectsState, updatedClassObjects)
			},
		[]
	)

	const addClassNameHandler = useRecoilTransaction_UNSTABLE(
		({ set, get }) =>
			(className: string) => {
				const newClassObject = getClassObjectFromClassName(className)

				console.log(newClassObject)

				set(classObjectsState, [...get(classObjectsState), newClassObject])
			},
		[]
	)

	return (
		<>
			<div
				ref={setReferenceElement as any}
				className=':uno: fixed z-[-10000]'
				style={{
					top: rect.y,
					left: rect.x,
					width: rect.width,
					height: rect.height
				}}
			/>

			<div
				id='toolwind-tooltip'
				key={`${rect.y + rect.x}`}
				ref={setPopperElement as any}
				style={{ ...styles.popper, zIndex: 10000 }}
				{...attributes.popper}
			>
				<div className=':uno: bg-indigo-900 shadow-md p-3 rounded-lg text-sm text-slate-200 lowercase'>
					<div className=':uno: p-3 w-72 bg-indigo-800 border border-indigo-600 rounded-md flex flex-wrap gap-2'>
						{classObjects.map((classObject, ind) => (
							<ClassNameTag
								key={ind}
								classObject={classObject}
								onDelete={deleteClassNameHandler}
								onUpdate={updateClassNameHandler}
							/>
						))}

						<AddClassName addClassName={addClassNameHandler} />
					</div>
				</div>

				<div
					id='toolwind-arrow'
					ref={setArrowElement as any}
					style={styles.arrow}
					className=':uno: bg-indigo-900 border-transparent'
				/>
			</div>
		</>
	)
}
