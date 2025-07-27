import clsx from 'clsx'
import { forwardRef } from 'react'

interface StickProps {
	isSelected: boolean
	onClick: (e: React.MouseEvent) => void
}

export const Stick = forwardRef<HTMLDivElement, StickProps>(
	({ isSelected, onClick }, ref) => {
		return (
			<div
				ref={ref}
				onClick={onClick}
				className={clsx(
					'w-[15px] h-[60%] rounded-full transition-colors duration-100 cursor-pointer pointer-events-auto transition-transform',
					isSelected ? 'bg-[#FFE5C1] transform scale-105' : 'bg-[#DDA961]'
				)}
			></div>
		)
	}
)
