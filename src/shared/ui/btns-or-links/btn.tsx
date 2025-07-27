import clsx from 'clsx'
import type { ReactNode } from 'react'

interface IProps {
	children: ReactNode
	onClick?: () => void
	className?: string
}

export const Btn = ({ children, onClick, className }: IProps) => {
	return (
		<button
			onClick={onClick}
			className={clsx(
				'px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-transform transform hover:scale-105  cursor-pointer',
				className
			)}
		>
			{children}
		</button>
	)
}

