import { type IBaseIconProps } from '@toolwind/types/components'
import clsx from 'clsx'
import { memo } from 'react'

const AddIcon = memo(({ size = 16, className }: IBaseIconProps) => {
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
				d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
			/>
		</svg>
	)
})

AddIcon.displayName = 'AddIcon'

export { AddIcon }
