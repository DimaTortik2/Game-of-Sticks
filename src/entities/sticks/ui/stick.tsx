import clsx from 'clsx'
import { forwardRef } from 'react'
import { PREDEFINED_COLORS } from '../../../app/consts/colors'

interface StickProps {
	isSelected: boolean
	onClick?: (e: React.MouseEvent) => void
	groupId: number
	isDev: boolean
	isInvisible: boolean
}

export const Stick = forwardRef<HTMLDivElement, StickProps>(
	({ isSelected, isInvisible, onClick, groupId, isDev }, ref) => {
		// Логику с backgroundColor можно упростить,
		// так как невидимое состояние теперь управляется через opacity
		let backgroundColor: string

		if (isSelected) backgroundColor = '#FFE5C1'
		else if (isDev) backgroundColor = PREDEFINED_COLORS[groupId]
		else backgroundColor = '#DDA961'

		return (
			<div
				ref={ref}
				onClick={onClick}
				className={clsx(
					'w-[15px] h-[60%] rounded-full',
					'transition-all duration-300 ease-in-out',
					isSelected && !isInvisible && 'transform scale-105',
					isInvisible
						? 'opacity-0 scale-50 pointer-events-none cursor-auto' 
						: 'opacity-100 scale-100 cursor-pointer pointer-events-auto' 
				)}
				style={{
					backgroundColor: isInvisible ? 'transparent' : backgroundColor,
				}}
			></div>
		)
	}
)
