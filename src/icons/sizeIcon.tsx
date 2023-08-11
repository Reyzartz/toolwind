import { type IBaseIconProps } from '@toolwind/types/components'
import clsx from 'clsx'
import { memo } from 'react'

const SizeIcon = memo(({ size = 16, className }: IBaseIconProps) => {
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
				d="M0 0v24h24v-24h-24zm11.333 20h-7.333v-7.333l2.253 2.252 3.002-2.989 2.828 2.828-3.002 2.989 2.252 2.253zm8.667-8.667l-2.253-2.252-2.919 2.919-2.828-2.828 2.919-2.919-2.252-2.253h7.333v7.333z"
			/>
		</svg>
	)
})

SizeIcon.displayName = 'SizeIcon'

export { SizeIcon }
