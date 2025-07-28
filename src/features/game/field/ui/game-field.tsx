import clsx from 'clsx'
import { useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSelection } from '../model/hooks/use-selecction'
import { useMousePosition } from '../../../../shared/model/hooks/use-mouse-position'
import { MouseAlert } from '../../../../shared/ui/alerts/mouse-alert'
import { Stick } from '../../../../entities/sticks'
import { useAtom } from 'jotai'
import { sticksArrCookieAtom } from '../../../../app/stores/game/game-store'

interface IProps {
	className?: string
	isSticksLess: boolean
}

export function GameFiled({ className, isSticksLess }: IProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)

	// Добавляем проверку, чтобы не передавать undefined в хук
	if (!sticksArr) {
		return (
			<div className='bg-red-400 text-[#e8e8e8] rounded-2xl p-5 max-w-[300px] max-h-[200px] flex items-center justify-center'>
				<p>Загрузка данных об игре...</p>
			</div>
		)
	}

	const { isDragging, selectionBoxCoords, eventHandlers, getItemProps } =
		useSelection(containerRef, sticksArr, setSticksArr)

	const mousePosition = useMousePosition()

	// Вычисляем количество выделенных палочек для MouseAlert
	const selectedCount = useMemo(
		() => sticksArr.filter(stick => stick.isSelected).length,
		[sticksArr]
	)

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
				isVisible={selectedCount === 1 && !isDragging}
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
				{/* Первый блок палочек */}
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
					{sticksArr.slice(0, 25).map(stick => (
						<Stick
							key={stick.id}
							isSelected={stick.isSelected} // Это теперь работает!
							isWrong={stick.isWrong}
							{...getItemProps(stick.id)}
						/>
					))}
				</div>
				{/* Второй блок палочек */}
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
						{sticksArr.slice(25, 50).map(stick => (
							<Stick
								key={stick.id}
								isSelected={stick.isSelected} // И это тоже
								isWrong={stick.isWrong}
								{...getItemProps(stick.id)}
							/>
						))}
					</div>
				)}
			</div>

			{isDragging &&
				createPortal(
					/* ... портал остается без изменений ... */
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
