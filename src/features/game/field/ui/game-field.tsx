import clsx from 'clsx'
import { useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSelection } from '../model/hooks/use-selecction'
import { Stick } from '../../../../entities/sticks'
import { useAtom } from 'jotai'
import { sticksArrCookieAtom } from '../../../../app/stores/game/game-store'
import Cookies from 'js-cookie'
import { MouseFollowerAlert } from '../../../../shared/ui/alerts/mouse-follower-aalert'
import type { IStick } from '../../../../entities/sticks/model/interfaces/stick.interfaces'

interface IProps {
	className?: string
	isSticksLess: boolean
}

export function GameFiled({ className, isSticksLess }: IProps) {
	const isDev = Cookies.get('devMode') === 'true'

	const containerRef = useRef<HTMLDivElement>(null)
	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)

	if (!sticksArr) {
		return (
			<div className='bg-red-400 text-[#e8e8e8] rounded-2xl p-5 max-w-[300px] max-h-[200px] flex items-center justify-center'>
				<p>Загрузка данных об игре...</p>
			</div>
		)
	}

	const { isDragging, selectionBoxCoords, eventHandlers, getItemProps } =
		useSelection(containerRef, sticksArr, setSticksArr)

	const selectedCount = useMemo(
		() => sticksArr.filter(stick => stick.isSelected && !stick.isTaken).length,
		[sticksArr]
	)

	const totalSticksCount = sticksArr.length

	const gap =
		totalSticksCount > 1
			? `calc((100% - ${
					totalSticksCount > 25 ? 25 : totalSticksCount
			  } * 15px) / (${(totalSticksCount > 25 ? 25 : totalSticksCount) - 1}))`
			: undefined

	const renderStick = (stick: IStick) => {
		const key = stick.id

		// Если палочка "взята", рендерим ее как невидимый плейсхолдер без обработчиков событий
		if (stick.isTaken) {
			return (
				<Stick
					key={key}
					isSelected={false}
					groupId={-1}
					isDev={isDev}
					isInvisible={true} // Используем существующий флаг для невидимости
				/>
			)
		}

		// Обычная, активная палочка
		return (
			<Stick
				key={key}
				isSelected={stick.isSelected}
				groupId={stick.groupId}
				isDev={isDev}
				isInvisible={false}
				{...getItemProps(stick.id)}
			/>
		)
	}

	return (
		<>
			<MouseFollowerAlert
				isVisible={selectedCount === 1 && !isDragging}
				text='Ещё - Ctrl'
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
					style={{ gap, justifyContent: 'start' }}
				>
					{sticksArr.slice(0, 25).map(renderStick)}
				</div>
				{/* Второй блок палочек */}
				{!isSticksLess && (
					<div
						className={clsx(
							'w-[98%] flex flex-wrap items-center pointer-events-none bg-[#6E4816] rounded-2xl px-10',
							isSticksLess ? 'h-[1000px]' : 'h-[45%]'
						)}
						style={{ gap, justifyContent: 'start' }}
					>
						{sticksArr.slice(25, 50).map(renderStick)}
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
