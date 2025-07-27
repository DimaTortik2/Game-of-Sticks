import clsx from 'clsx'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import type { ReactNode } from 'react'
import { LinkWithBackToast } from './link-with-toast'

export function ExitLinkButton({
	onClick,
	className,
	children,
	to,
}: {
	onClick?: () => void
	className?: string
	children: ReactNode
	to: string
}) {
	return (
		<LinkWithBackToast to={to}>
			<div
				onClick={onClick}
				className={clsx(
					'rounded-2xl px-6 p-4 bg-[#3e3e3e] transform hover:scale-105 transition-transform flex gap-5 cursor-pointer',
					className
				)}
			>
				<ArrowBackIcon />
				<p>{children}</p>
			</div>
		</LinkWithBackToast>
	)
}
