import clsx from 'clsx'
import { BasicModal } from '../../../../shared/ui/modal/basic-modal'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai' // 1. Меняем импорт на useAtom
import { winnerAtomCookieAtom } from '../../../../app/stores/game/game-store'

export function EndGameModal() {
	const navigate = useNavigate()
	const [countdown, setCountdown] = useState(5)

	// 2. Используем useAtom для большей надежности и чистоты кода
	const [winner, setWinner] = useAtom(winnerAtomCookieAtom)

	// ✅ 3. ГЛАВНОЕ ИСПРАВЛЕНИЕ: Правильная логика видимости
	// Модальное окно видно, только если `winner` имеет "истинное" значение,
	// то есть не `null`, не `undefined` и не пустую строку.
	const isVisible = !!winner

	const isEnemyWin = winner === 'enemy'

	useEffect(() => {
		let intervalId: ReturnType<typeof setInterval> | undefined
		let timeoutId: ReturnType<typeof setInterval> | undefined

		if (isVisible) {
			setCountdown(5)

			intervalId = setInterval(() => {
				setCountdown(prev => (prev > 0 ? prev - 1 : 0))
			}, 1000)

			timeoutId = setTimeout(() => {
				// Используем `null` для очистки, так как это более семантически верно
				setWinner(null)

				// Задержка больше не нужна, так как мы используем `useAtom`,
				// который более надежно обрабатывает асинхронные обновления.
				// Но оставим ее для 100% гарантии, что кука успеет удалиться.
				setTimeout(() => {
					navigate('/')
				}, 100)
			}, 5000)

			return () => {
				clearInterval(intervalId)
				clearTimeout(timeoutId)
			}
		}
	}, [isVisible, navigate, setWinner])

	const winGradient = 'from-green-400 via-yellow-300 to-green-500'
	const loseGradient = 'from-red-500 via-purple-600 to-red-600'

	return (
		<BasicModal
			isVisible={isVisible}
			onClose={() => {}}
			className='h-screen w-screen'
			hasCloseButton={false}
		>
			<div className='flex w-full h-full justify-center items-center flex-col gap-8'>
				<div
					className={clsx(
						'absolute top-0 left-0 w-16 h-120 [clip-path:polygon(0_0,100%_0,0_100%)] ',
						isEnemyWin ? 'bg-[#E59696]' : 'bg-[#58BF5F]'
					)}
				/>
				<div
					className={clsx(
						'absolute top-0 left-0 w-100 h-50 transform rotate-180 [clip-path:polygon(100%_100%,0_100%,100%_0)]',
						isEnemyWin ? 'bg-[#E59696]' : 'bg-[#58BF5F]'
					)}
				/>
				<div
					className={clsx(
						'absolute bottom-0 right-0 w-70 h-50  [clip-path:polygon(100%_100%,0_100%,100%_0)] ',
						isEnemyWin ? 'bg-[#E59696]' : 'bg-[#58BF5F]'
					)}
				/>
				<div
					className={clsx(
						'absolute bottom-0 right-0 w-30 h-100  transform rotate-180 [clip-path:polygon(0_0,100%_0,0_100%)] ',
						isEnemyWin ? 'bg-[#E59696]' : 'bg-[#58BF5F]'
					)}
				/>

				<div
					className={clsx(
						'absolute top-0 right-0 w-40 h-100 [clip-path:polygon(100%_0,_100%_100%,_0_0)]',
						isEnemyWin ? 'bg-[#E59696]' : 'bg-[#58BF5F]'
					)}
				/>

				<div
					className={clsx(
						'absolute bottom-0 left-0 w-100 h-50 [clip-path:polygon(0_100%,_0_0,_100%_100%)]',
						isEnemyWin ? 'bg-[#E59696]' : 'bg-[#58BF5F]'
					)}
				/>

				<div className='flex flex-col items-center justify-center gap-8'>
					<p
						className={clsx(
							'text-6xl font-bold text-center tracking-wide',
							'bg-gradient-to-r',
							isEnemyWin ? loseGradient : winGradient,
							'bg-clip-text text-transparent',
							'animate-gradient'
						)}
					>
						{isEnemyWin
							? 'Вы проиграли.\nВ следующий раз получится!'
							: 'Вы победили!\nПоздравляем!'}
					</p>

					<p className='text-xl text-gray-400'>
						Возврат в главное меню через: {countdown}
					</p>
				</div>
			</div>
		</BasicModal>
	)
}
