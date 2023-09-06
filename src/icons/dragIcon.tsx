import { type IBaseIconProps } from '@toolwind/types/components'
import clsx from 'clsx'
import { memo } from 'react'

const DragIcon = memo(({ size = 16, className }: IBaseIconProps) => {
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
				d="M24 12l-6-5v4h-5v-5h4l-5-6-5 6h4v5h-5v-4l-6 5 6 5v-4h5v5h-4l5 6 5-6h-4v-5h5v4z"
			/>
		</svg>
	)
})

DragIcon.displayName = 'DragIcon'

export { DragIcon }
