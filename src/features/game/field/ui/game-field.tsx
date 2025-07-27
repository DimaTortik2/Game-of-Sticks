import clsx from 'clsx'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { Stick } from './stick'
import { useSelection } from '../model/hooks/use-selecction'
import { useMousePosition } from '../../../../shared/model/hooks/use-mouse-position'
import { MouseAlert } from '../../../../shared/ui/alerts/mouse-alert'

interface IProps {
	className?: string
	sticksCount?: number
	isSticksLess: boolean
}

export function GameFiled({
	className,
	isSticksLess,
	sticksCount = 50,
}: IProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const {
		selectedIds,
		isDragging,
		selectionBoxCoords,
		eventHandlers,
		getItemProps,
	} = useSelection(containerRef)
	const sticksArr = Array.from({ length: sticksCount }, (_, i) => i + 1)

	const mousePosition = useMousePosition()

	const gap =
		sticksArr.length > 1
			? `calc((100% - ${
					sticksArr.length > 25 ? 25 : sticksArr.length
			  } * 15px) / (${(sticksArr.length > 25 ? 25 : sticksArr.length) - 1}))`
			: undefined

	return (
		<>
			<MouseAlert
				text='Ещё - Ctrl'
				isVisible={selectedIds.size === 1 && !isDragging}
				left={mousePosition.x}
				top={mousePosition.y}
			/>

			<div
				ref={containerRef}
				{...eventHandlers}
				className={clsx(
					'bg-[#5C3C12] rounded-2xl p-5 gap-5 relative select-none flex flex-col items-center justify-center',
					className
				)}
			>
				<div
					className={clsx(
						'w-[98%] flex flex-wrap items-center pointer-events-none bg-[#6E4816] rounded-2xl px-10',
						isSticksLess ? 'h-[1000px]' : 'h-[45%]'
					)}
					style={{
						gap,
						justifyContent: 'start',
					}}
				>
					{sticksArr.slice(0, 25).map(stickNumber => (
						<Stick
							key={stickNumber}
							isSelected={selectedIds.has(stickNumber)}
							{...getItemProps(stickNumber)}
						/>
					))}
				</div>
				{!isSticksLess && (
					<div
						className={clsx(
							'w-[98%] flex flex-wrap items-center pointer-events-none bg-[#6E4816] rounded-2xl px-10',
							isSticksLess ? 'h-[1000px]' : 'h-[45%]'
						)}
						style={{
							gap,
							justifyContent: 'start',
						}}
					>
						{sticksArr.slice(25, 50).map(stickNumber => (
							<Stick
								key={stickNumber}
								isSelected={selectedIds.has(stickNumber)}
								{...getItemProps(stickNumber)}
							/>
						))}
					</div>
				)}
			</div>

			{isDragging &&
				createPortal(
					<div
						style={{
							position: 'fixed',
							left: selectionBoxCoords.left,
							top: selectionBoxCoords.top,
							width: selectionBoxCoords.width,
							height: selectionBoxCoords.height,
						}}
						className='z-50 bg-[#e8e8e830] bg-opacity-30 border-4 border-[#212121] rounded-2xl pointer-events-none flex items-end'
					>
						<div
							className={clsx(
								'p-2 bg-[#212121] text-[#e8e8e8] rounded-b-xl w-full transition-opacity ',
								selectionBoxCoords.width > 130 && selectionBoxCoords.height > 50
									? 'opacity-100'
									: 'opacity-0'
							)}
						>
							Ещё - Ctrl
						</div>
					</div>,
					document.body
				)}
		</>
	)
}
