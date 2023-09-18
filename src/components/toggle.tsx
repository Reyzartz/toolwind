import clsx from 'clsx'

interface ToggleProps {
	checked?: boolean
	onToggle: (value: boolean) => void
}

function Toggle({ checked = false, onToggle }: ToggleProps) {
	return (
		<div
			onClick={() => {
				onToggle(!checked)
			}}
			style={{
				width: 60
			}}
			className={clsx(
				'relative inline-flex h-5 shrink-0 cursor-pointer items-center rounded border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75',
				checked ? 'bg-primary' : 'bg-light'
			)}
		>
			<span
				className={clsx(
					'absolute px-1 font-semibold transition-all',
					checked ? 'left-4 text-alternative' : 'left-0 text-default'
				)}
			>
				⌥⇧T
			</span>

			<span
				className={`${checked ? 'translate-x-0' : 'translate-x-10'}
            pointer-events-none inline-block h-4 w-4 transform rounded bg-default shadow-lg ring-0 transition duration-200 ease-in-out`}
			/>
		</div>
	)
}

export { Toggle }
