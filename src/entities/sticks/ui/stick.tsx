import clsx from 'clsx'
import { forwardRef } from 'react'
import { PREDEFINED_COLORS } from '../../../app/consts/colors'

interface StickProps {
	isSelected: boolean
	onClick: (e: React.MouseEvent) => void
	groupId: number
	isDev: boolean
}

export const Stick = forwardRef<HTMLDivElement, StickProps>(
	({ isSelected, onClick, groupId, isDev }, ref) => {
		let backgroundColor: string
		if (isSelected) backgroundColor = '#FFE5C1'
		else if (isDev) backgroundColor = PREDEFINED_COLORS[groupId]
		else backgroundColor = '#DDA961'
		return (
			<div
				ref={ref}
				onClick={onClick}
				className={clsx(
					'w-[15px] h-[60%] rounded-full transition-all duration-100 cursor-pointer pointer-events-auto',
					isSelected && 'transform scale-105'
				)}
				style={{ backgroundColor }}
			></div>
		)
	}
)
