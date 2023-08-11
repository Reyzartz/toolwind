import { type IBaseIconProps } from '@toolwind/types/components'
import clsx from 'clsx'
import { memo } from 'react'

const ArrowIcon = memo(({ size = 16, className }: IBaseIconProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			className={clsx('flex-shrink-0', className)}
		>
			<path
				fill="currentColor"
				d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"
			/>
		</svg>
	)
})

ArrowIcon.displayName = 'ArrowIcon'

export { ArrowIcon }
