// import clsx from 'clsx'
// import { useMemo, useRef } from 'react'
// import { createPortal } from 'react-dom'
// import { useSelection } from '../model/hooks/use-selecction'
// import { Stick } from '../../../../entities/sticks'
// import { useAtom } from 'jotai'
// import { sticksArrCookieAtom } from '../../../../app/stores/game/game-store'
// import { MouseFollowerAlert } from '../../../../shared/ui/alerts/mouse-follower-aalert'
// import Cookies from 'js-cookie'

// interface IProps {
// 	className?: string
// 	isSticksLess: boolean
// }

// export function GameFiled({ className, isSticksLess }: IProps) {
// 	const containerRef = useRef<HTMLDivElement>(null)
// 	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)

// 	const isDev = Cookies.get('devMode') === 'true'

// 	if (!sticksArr) {
// 		return (
// 			<div className='bg-red-400 text-[#e8e8e8] rounded-2xl p-5 max-w-[300px] max-h-[200px] flex items-center justify-center'>
// 				<p>Загрузка данных об игре...</p>
// 			</div>
// 		)
// 	}

// 	const { isDragging, selectionBoxCoords, eventHandlers, getItemProps } =
// 		useSelection(containerRef, sticksArr, setSticksArr)

// 	const selectedCount = useMemo(
// 		() => sticksArr.filter(stick => stick.isSelected).length,
// 		[sticksArr]
// 	)

// 	const gap =
// 		sticksArr.length > 1
// 			? `calc((100% - ${
// 					sticksArr.length > 25 ? 25 : sticksArr.length
// 			  } * 15px) / (${(sticksArr.length > 25 ? 25 : sticksArr.length) - 1}))`
// 			: undefined

// 	return (
// 		<>
// 			<MouseFollowerAlert
// 				isVisible={selectedCount === 1 && !isDragging}
// 				text='Ещё - Ctrl'
// 			/>

// 			<div
// 				ref={containerRef}
// 				{...eventHandlers}
// 				className={clsx(
// 					'bg-[#5C3C12] rounded-2xl p-5 gap-5 relative select-none flex flex-col items-center justify-center',
// 					className
// 				)}
// 			>
// 				<div
// 					className={clsx(
// 						'w-[98%] flex flex-wrap items-center pointer-events-none bg-[#6E4816] rounded-2xl px-10',
// 						isSticksLess ? 'h-[1000px]' : 'h-[45%]'
// 					)}
// 					style={{
// 						gap,
// 						justifyContent: 'start',
// 					}}
// 				>
// 					{sticksArr.slice(0, 25).map(stick => (
// 						<Stick
// 							key={stick.id}
// 							isSelected={stick.isSelected}
// 							groupId={stick.groupId}
// 							isDev={isDev}
// 							{...getItemProps(stick.id)}
// 						/>
// 					))}
// 				</div>
// 				{/* Второй блок палочек */}
// 				{!isSticksLess && (
// 					<div
// 						className={clsx(
// 							'w-[98%] flex flex-wrap items-center pointer-events-none bg-[#6E4816] rounded-2xl px-10',
// 							isSticksLess ? 'h-[1000px]' : 'h-[45%]'
// 						)}
// 						style={{
// 							gap,
// 							justifyContent: 'start',
// 						}}
// 					>
// 						{sticksArr.slice(25, 50).map(stick => (
// 							<Stick
// 								key={stick.id}
// 								isSelected={stick.isSelected}
// 								groupId={stick.groupId}
// 								isDev={isDev}
// 								{...getItemProps(stick.id)}
// 							/>
// 						))}
// 					</div>
// 				)}
// 			</div>

// 			{isDragging &&
// 				createPortal(
// 					<div
// 						style={{
// 							position: 'fixed',
// 							left: selectionBoxCoords.left,
// 							top: selectionBoxCoords.top,
// 							width: selectionBoxCoords.width,
// 							height: selectionBoxCoords.height,
// 						}}
// 						className='z-50 bg-[#e8e8e830] bg-opacity-30 border-4 border-[#212121] rounded-2xl pointer-events-none flex items-end'
// 					>
// 						<div
// 							className={clsx(
// 								'p-2 bg-[#212121] text-[#e8e8e8] rounded-b-xl w-full transition-opacity ',
// 								selectionBoxCoords.width > 130 && selectionBoxCoords.height > 50
// 									? 'opacity-100'
// 									: 'opacity-0'
// 							)}
// 						>
// 							Ещё - Ctrl
// 						</div>
// 					</div>,
// 					document.body
// 				)}
// 		</>
// 	)
// }

import clsx from 'clsx'
import { useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useSelection } from '../model/hooks/use-selecction'
import { Stick } from '../../../../entities/sticks'
import { useAtom } from 'jotai'
import { sticksArrCookieAtom } from '../../../../app/stores/game/game-store'
import type { IStick } from '../../../../entities/sticks/model/interfaces/stick.interfaces'
import Cookies from 'js-cookie'
import { MouseFollowerAlert } from '../../../../shared/ui/alerts/mouse-follower-aalert'

// ==================================================================
// 1. НОВАЯ ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ (ИСПРАВЛЕННАЯ)
// ==================================================================
// Определим новый тип, который может быть либо реальной палочкой, либо разделителем
type RenderableStick = IStick & { isInvisible?: boolean }

function addSeparatorsToSticks(sticks: IStick[]): RenderableStick[] {
	if (sticks.length < 2) {
		return sticks
	}

	const sticksWithSeparators: RenderableStick[] = []
	let separatorIndex = 0 // Для уникальных ID разделителей

	for (let i = 0; i < sticks.length; i++) {
		const currentStick = sticks[i]
		sticksWithSeparators.push(currentStick)

		const nextStick = sticks[i + 1]
		if (nextStick && currentStick.groupId !== nextStick.groupId) {
			sticksWithSeparators.push({
				// ✅ ID теперь отрицательное число, чтобы не пересекаться с реальными
				// и соответствовать типу number.
				id: -1 - separatorIndex++,
				groupId: -1,
				isSelected: false,
				isInvisible: true,
			})
		}
	}

	return sticksWithSeparators
}

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

	const sticksToRender = useMemo(
		() => addSeparatorsToSticks(sticksArr),
		[sticksArr]
	)

	const selectedCount = useMemo(
		() => sticksArr.filter(stick => stick.isSelected).length,
		[sticksArr]
	)

	const gap =
		sticksToRender.length > 1
			? `calc((100% - ${
					sticksToRender.length > 25 ? 25 : sticksToRender.length
			  } * 15px) / (${
					(sticksToRender.length > 25 ? 25 : sticksToRender.length) - 1
			  }))`
			: undefined

	// ==================================================================
	// 2. ФУНКЦИЯ РЕНДЕРИНГА ПАЛОЧЕК (ДЛЯ ЧИСТОТЫ КОДА)
	// ==================================================================
	const renderStick = (stick: RenderableStick) => {
		// ✅ Для ключа используем комбинацию, чтобы он был уникальным для React
		const key = stick.isInvisible ? `sep-${stick.id}` : stick.id

		if (stick.isInvisible) {
			// Если это разделитель, передаем только необходимые пропсы
			return (
				<Stick
					key={key}
					isSelected={false}
					groupId={-1}
					isDev={isDev}
					isInvisible={true}
					onClick={() => {}} // Пустая функция для onClick
					// ref не передаем
				/>
			)
		}

		// Если это реальная палочка, передаем все пропсы
		return (
			<Stick
				key={key}
				isSelected={stick.isSelected}
				groupId={stick.groupId}
				isDev={isDev}
				isInvisible={false}
				{...getItemProps(stick.id)} // getItemProps вернет ref и onClick
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
					{/* ✅ Используем новую функцию для рендера */}
					{sticksToRender.slice(0, 25).map(renderStick)}
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
						{/* ✅ И здесь тоже */}
						{sticksToRender.slice(25, 50).map(renderStick)}
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
