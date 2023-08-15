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
				type: 'FETCH_MODIFIED_ELEMENTS',
			},
		})

		void sendMessage({
			to: 'content_script',
			action: { type: 'SELECT_ELEMENT', data: { xpath: null } },
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
				data: { xpath },
			},
		})
	}, [])

	const onClickHandler = useCallback((xpath: string) => {
		void sendMessage({
			to: 'content_script',
			action: { type: 'SELECT_ELEMENT', data: { xpath } },
		})

		window.close()
	}, [])

	const onDeleteHandler = useCallback((item: ModifiedElement) => {
		void sendMessage({
			to: 'content_script',
			action: {
				type: 'DELETE_MODIFIED_ELEMENT',
				data: item,
			},
		})
	}, [])

	return (
		<div className="flex flex-col overflow-y-scroll">
			{elementsList.map((ele) => (
				<div
					key={ele.xpath}
					className="text-sm text-slate-4 border-b border-default hover:bg-light overflow-hidden cursor-pointer group relative text-default p-2"
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
					<span className="text-primary lowercase font-semibold">
						{ele.tagName}.
					</span>

					<span className="max-w-full truncate">
						{ele.updatedClassNames.join('.')}
					</span>

					<button
						className="absolute -right-full p-2 top-1 group-hover:right-0 transition-all bg-light hover:text-red-500 active:hover:text-red-600"
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
