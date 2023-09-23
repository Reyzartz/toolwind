import { useRecoilValue } from 'recoil'
import { inspectedElementState, selectedElementState } from './store'
import { ContentStyles } from './styles'
import { ClassNamesTooltip } from '@toolwind/components/classNamesTooltip'
import { SelectedElementPopup } from '@toolwind/components/selectedElementPopup'

const ReactApp = () => {
	const inspectedElement = useRecoilValue(inspectedElementState)

	const selectedElement = useRecoilValue(selectedElementState)

	return (
		<>
			<ContentStyles />

			{inspectedElement !== null && <ClassNamesTooltip />}

			{selectedElement !== null && (
				<SelectedElementPopup element={selectedElement} />
			)}
		</>
	)
}

export default ReactApp
