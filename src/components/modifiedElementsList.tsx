import { addMessageListener, sendMessage } from '@toolwind/helpers/message'
import { DeleteIcon } from '@toolwind/icons'
import { type ModifiedElement } from '@toolwind/types/common'
import { useCallback, useEffect, useState } from 'react'

const ModifiedElementsList = () => {
	const [elementsList, setElementList] = useState<ModifiedElement[]>([])

	useEffect(() => {
		void sendMessage({
			to: 'content_script',
			action: {
				type: 'FETCH_MODIFIED_ELEMENTS'
			}
		})

		void sendMessage({
			to: 'content_script',
			action: { type: 'SELECT_ELEMENT', data: { xpath: null } }
		})

		void addMessageListener((message) => {
			if (message.type === 'MODIFIED_ELEMENTS_UPDATED') {
				setElementList(message.data)
			}
		})
	}, [])

	const onMouseEnterHandler = useCallback((xpath: string | null = null) => {
		void sendMessage({
			to: 'content_script',
			action: {
				type: 'HOVER_ELEMENT',
				data: { xpath }
			}
		})
	}, [])

	const onClickHandler = useCallback((xpath: string) => {
		void sendMessage({
			to: 'content_script',
			action: { type: 'SELECT_ELEMENT', data: { xpath } }
		})

		window.close()
	}, [])

	const onDeleteHandler = useCallback((item: ModifiedElement) => {
		void sendMessage({
			to: 'content_script',
			action: {
				type: 'DELETE_MODIFIED_ELEMENT',
				data: item
			}
		})
	}, [])

	return (
		<div className="flex flex-col overflow-y-scroll">
			{elementsList.map((ele) => (
				<div
					key={ele.xpath}
					className="text-slate-4 group relative cursor-pointer overflow-hidden border-b border-default p-2 text-sm text-default hover:bg-light"
					onMouseEnter={() => {
						onMouseEnterHandler(ele.xpath)
					}}
					onMouseLeave={() => {
						onMouseEnterHandler()
					}}
					onClick={() => {
						onClickHandler(ele.xpath)
					}}
				>
					<span className="font-semibold lowercase text-primary">
						{ele.tagName}.
					</span>

					<span className="max-w-full truncate">
						{ele.updatedClassNames.join('.')}
					</span>

					<button
						className="absolute -right-full top-1 bg-light p-2 transition-all hover:text-red-500 active:hover:text-red-600 group-hover:right-0"
						onClick={(e) => {
							e.stopPropagation()
							onDeleteHandler(ele)
						}}
					>
						<DeleteIcon size={14} />
					</button>
				</div>
			))}
		</div>
	)
}

export { ModifiedElementsList }
