import { type IBaseIconProps } from '@toolwind/types/components'
import clsx from 'clsx'
import { memo } from 'react'

const CopyIcon = memo(({ size = 16, className }: IBaseIconProps) => {
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
				d="M22 6v16h-16v-16h16zm2-2h-20v20h20v-20zm-24 17v-21h21v2h-19v19h-2z"
			/>
		</svg>
	)
})

CopyIcon.displayName = 'CopyIcon'

export { CopyIcon }
