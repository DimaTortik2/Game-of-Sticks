import clsx from 'clsx'
import ClearIcon from '@mui/icons-material/Clear'
import { Modal } from '@mui/material'
import type { ReactNode } from 'react'
import { IconButton } from '../icons/icon-button'
import { motion } from 'framer-motion'

interface IProps {
	children: ReactNode
	className?: string
	onClose: () => void
	title?: string
	isVisible: boolean
	zIndex?: number
	headerOptionsComponent?: ReactNode
	hasCloseButton?: boolean
}

const modalVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1 },
}

export function BasicModal({
	children,
	className,
	onClose,
	title,
	isVisible,
	zIndex,
	headerOptionsComponent,
	hasCloseButton = true,
}: IProps) {
	return (
		<Modal
			open={isVisible}
			onClose={onClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
			className=' flex items-center justify-center bg-[rgba(0,0,0,0.8)] text-white'
			style={{ zIndex }}
			BackdropProps={{ timeout: 300 }}
		>
			<motion.div
				variants={modalVariants}
				initial='hidden'
				animate='visible'
				exit='hidden'
				transition={{ duration: 0.3, ease: 'easeOut' }}
				className={clsx(
					'bg-[#3F3F3F] rounded-2xl flex flex-col outline-none',
					'relative transform-gpu',
					className
				)}
				onClick={e => e.stopPropagation()}
			>
				<div
					className={clsx(
						'w-full flex  py-[5px]',
						title ? 'justify-between' : 'justify-end'
					)}
				>
					{title && (
						<label className=' flex justify-center items-center px-4 text-zinc-400'>
							{title}
						</label>
					)}
					{headerOptionsComponent}
					{hasCloseButton && (
						<IconButton icon={<ClearIcon />} onClick={onClose} />
					)}
				</div>

				{children}
			</motion.div>
		</Modal>
	)
}
