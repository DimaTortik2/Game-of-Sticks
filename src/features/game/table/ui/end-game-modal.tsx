import clsx from 'clsx'
import { BasicModal } from '../../../../shared/ui/modal/basic-modal'
import { useState, useEffect } from 'react' // 1. Импортируем хуки
import { useNavigate } from 'react-router-dom' // 2. Импортируем хук для навигации
import { useAtomValue, useSetAtom } from 'jotai'
import { winnerAtomCookieAtom } from '../../../../app/stores/game/game-store'

export function EndGameModal() {
	const navigate = useNavigate() // 3. Инициализируем хук навигации
	const [countdown, setCountdown] = useState(3) // 4. Состояние для таймера

	const winner = useAtomValue<'player' | 'enemy' | null>(winnerAtomCookieAtom)

	const setWinner = useSetAtom(winnerAtomCookieAtom)

	console.log({ winner })

	const isVisible = winner !== null
	const isEnemyWin = winner === 'enemy'

	useEffect(() => {
		// Этот эффект будет запускаться каждый раз, когда модальное окно становится видимым
		if (isVisible) {
			// Сбрасываем таймер на 3 секунды при каждом открытии
			setCountdown(3)

			// Устанавливаем интервал, который будет срабатывать каждую секунду
			const intervalId = setInterval(() => {
				setCountdown(prevCountdown => prevCountdown - 1)
			}, 1000)

			// Устанавливаем тайм-аут для редиректа через 3 секунды
			const timeoutId = setTimeout(() => {
				setWinner(null)
				setTimeout(() => {
					console.log('Переход на главную страницу...')
					navigate('/')
				}, 100)
			}, 3000)

			// ✅ ВАЖНО: Функция очистки.
			// Она выполнится, когда компонент размонтируется или isVisible изменится.
			// Это предотвращает утечки памяти и баги.
			return () => {
				clearInterval(intervalId)
				clearTimeout(timeoutId)
			}
		}
	}, [isVisible, navigate]) // Запускаем эффект, когда isVisible или navigate меняются

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
				{/* Основной контейнер с текстом и таймером */}
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

					{/* 👇 5. ДОБАВЛЕН ТАЙМЕР 👇 */}
					<p className='text-xl text-gray-400'>
						Возврат в главное меню через: {countdown}
					</p>
				</div>
			</div>
		</BasicModal>
	)
}
