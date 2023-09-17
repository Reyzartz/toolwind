import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import { useCallback } from 'react'

interface ToggleProps {
	checked?: boolean
	onToggle: (value: boolean) => void
}

function Toggle({ checked = false, onToggle }: ToggleProps) {
	const onToggleHandler = useCallback(
		(value: boolean) => {
			onToggle(value)
		},
		[onToggle]
	)

	return (
		<Switch
			checked={checked}
			onChange={onToggleHandler}
			className={clsx(
				'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75',
				checked ? 'bg-primary' : 'bg-light'
			)}
		>
			<span
				className={`${
					checked ? 'translate-x-0 bg-default' : 'translate-x-4 bg-default'
				}
            pointer-events-none inline-block h-4 w-4 transform rounded-full  shadow-lg ring-0 transition duration-200 ease-in-out`}
			/>
		</Switch>
	)
}

export { Toggle }
