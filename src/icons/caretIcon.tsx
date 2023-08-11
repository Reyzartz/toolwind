import { type IBaseIconProps } from '@toolwind/types/components'
import clsx from 'clsx'
import { memo } from 'react'

const CaretIcon = memo(({ size = 16, className }: IBaseIconProps) => {
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
				d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"
			/>
		</svg>
	)
})

CaretIcon.displayName = 'CaretIcon'

export { CaretIcon }
