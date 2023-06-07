import { Message, ModifiedElement } from '../../types/common'

let modifiedElementsList: ModifiedElement[] = []

chrome.runtime.onMessage.addListener((request: Message, _sender, response) => {
	switch (request.messageType) {
		case 'MODIFIED_ELEMENTS_UPDATED':
			modifiedElementsList = [...request.message]
			break
		case 'FETCH_MODIFIED_ELEMENTS':
			response(modifiedElementsList)
			break
	}
})

export {}
