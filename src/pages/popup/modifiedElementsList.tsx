import { useCallback, useEffect, useState } from 'react'
import { onMessageListener, sendMessage } from '../content/utils'
import { ModifiedElement } from '../../types/common'
import { sendMessageToContentScript } from './utils'

const ModifiedElementsList = () => {
	const [elementsList, setElementList] = useState<ModifiedElement[]>([])

	const fetchElementsList = () => {
		sendMessage({
			messageType: 'FETCH_MODIFIED_ELEMENTS',
			callback: (res) => {
				setElementList(res)
			}
		})
	}

	useEffect(() => {
		fetchElementsList()

		sendMessageToContentScript({
			messageType: 'SELECT_ELEMENT',
			message: null
		})

		onMessageListener('MODIFIED_ELEMENTS_UPDATED', (updatedItems) => {
			setElementList(updatedItems)
		})
	}, [])

	const onMouseEnterHandler = useCallback((xpath: string | null = null) => {
		sendMessageToContentScript({
			messageType: 'HOVER_ELEMENT',
			message: xpath
		})
	}, [])

	const onClickHandler = useCallback((xpath: string) => {
		sendMessageToContentScript({
			messageType: 'SELECT_ELEMENT',
			message: xpath
		})

		window.close()
	}, [])

	const onDeleteHandler = useCallback((item: ModifiedElement) => {
		sendMessageToContentScript({
			messageType: 'DELETE_MODIFIED_ELEMENT',
			message: item
		})
	}, [])

	return (
		<div className=':uno: flex gap-2 flex-col p-3 overflow-y-scroll'>
			{elementsList.map((ele) => (
				<div
					key={ele.xpath}
					className=':uno: rounded-md border border-solid border-indigo-400 text-xs text-slate-4 hover:border-indigo-300 overflow-hidden cursor-pointer flex gap-2 items-center group relative'
					onMouseEnter={() => onMouseEnterHandler(ele.xpath)}
					onMouseLeave={() => onMouseEnterHandler()}
					onClick={() => onClickHandler(ele.xpath)}
				>
					<span className=':uno: pl-2 pr-1 py-1.5 bg-white text-indigo-900 transition-all lowercase'>
						{ele.tagName}:
					</span>

					<span className=':uno: max-w-full truncate'>
						{ele.updatedClassNames.join(', ')}
					</span>

					<div
						className=':uno: text-lg pr-2 pl-10 absolute -right-full group-hover:right-0 transition-all hover:text-white'
						style={{
							background:
								'linear-gradient(to left, rgba(49,46,129), transparent)'
						}}
						onClick={(e) => {
							e.stopPropagation()
							onDeleteHandler(ele)
						}}
					>
						⤫
					</div>
				</div>
			))}
		</div>
	)
}

export { ModifiedElementsList }
