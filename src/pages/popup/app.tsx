import { useCallback, useEffect, useState } from 'react'
import { ExtensionStateMessageAction } from '../../types/common'
import { Toggle } from './components/toggle'

import {
  getItemFromStorage,
  sendMessageToContentScript,
  setItemToStorage
} from './utils'

function App () {
  const [extensionState, setExtensionState] =
    useState<ExtensionStateMessageAction['state']>('disabled')

  const onToggleHandler = useCallback((value: boolean) => {
    setExtensionState(value ? 'enabled' : 'disabled')

    setItemToStorage('toolwind_extension_state', value ? 'enabled' : 'disabled')

    sendMessageToContentScript({
      actionType: 'EXTENSION_STATE',
      action: { state: value ? 'enabled' : 'disabled' }
    })
  }, [])

  useEffect(() => {
    getItemFromStorage('toolwind_extension_state').then(res => {
      setExtensionState(res)
    })
  }, [])

  return (
    <div className='p-6 bg-indigo-900'>
      <Toggle
        onToggle={onToggleHandler}
        checked={extensionState === 'enabled'}
      />
    </div>
  )
}

export default App
