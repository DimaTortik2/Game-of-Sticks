import type { ReactNode } from "react"

interface IProps {
	children: ReactNode
	onClick?: () => void
}

export const InfoBtn = ({ children, onClick }: IProps) => {
	return (
		<button
			onClick={onClick}
			className='bg-[#212121] text-[#e8e8e8] w-full max-w-md px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg transition-transform transform hover:scale-105  cursor-pointer'
		>
			{children}
		</button>
	)
}
