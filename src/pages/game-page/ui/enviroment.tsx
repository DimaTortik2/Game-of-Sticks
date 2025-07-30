import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { GameState } from '../../../widgets/game'
import { Clue } from '../../../shared/ui/alerts/clue'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react' // 1. Импортируем useState
import clsx from 'clsx'
import { ToastContainer } from 'react-toastify'
import { GameTools } from '../../../features/game/table'
import {
	gameParamsCookieAtom,
	sticksArrCookieAtom,
} from '../../../app/stores/game/game-store'
import type { IStick } from '../../../entities/sticks/model/interfaces/stick.interfaces'
import Cookies from 'js-cookie'
import { myStep } from '../../../features/game/field/model/helpers/my-step'
import { getGameModeDataFromCookies } from '../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'
import { codeSticksData } from '../../../features/game/field/model/helpers/code/code-sticks-data'
import {
	mode_1_2_check,
	mode_3_4_check,
	mode_5_check,
	move_1_2,
	move_3_4,
	move_5,
} from '../../../features/game/field'

export function Enviroment() {
	const gameParams = useAtomValue(gameParamsCookieAtom)
	const {
		isEnemyStep,
		maxPerStep,
		maxPerStepStreak,
		sticksRange,
		sticksRangeStreak,
		isFirstComputerStep,
		helpsCount,
	} = gameParams

	const setGameParams = useSetAtom(gameParamsCookieAtom)
	const isDev = Cookies.get('devMode') === 'true'
	const sticksArr = useAtomValue<IStick[] | undefined>(sticksArrCookieAtom)
	const setSticksArr = useSetAtom(sticksArrCookieAtom)

	// ✅ 2. Создаем локальное состояние ТОЛЬКО для визуального эффекта подсказки
	const [isHelping, setIsHelping] = useState(false)

	// "Чистая" функция: вычисляет ход ИИ, но не меняет состояние
	const calculateAiMove = (
		currentSticks: IStick[],
		currentParams: typeof gameParams
	): IStick[] | null => {
		const { modeNum } = getGameModeDataFromCookies()
		const currentCoded = codeSticksData(currentSticks)
		let aiMoveFunction: ((pos: number[]) => number[]) | null = null

		switch (modeNum) {
			case 1:
				if (currentParams.maxPerStep)
					aiMoveFunction = pos => move_1_2(pos, 1, currentParams.maxPerStep!)
				break
			case 2:
				if (currentParams.sticksRange)
					aiMoveFunction = pos =>
						move_1_2(
							pos,
							currentParams.sticksRange![0],
							currentParams.sticksRange![1]
						)
				break
			case 3:
				if (currentParams.maxPerStepStreak)
					aiMoveFunction = pos =>
						move_3_4(pos, 1, currentParams.maxPerStepStreak!)
				break
			case 4:
				if (currentParams.sticksRangeStreak)
					aiMoveFunction = pos =>
						move_3_4(
							pos,
							currentParams.sticksRangeStreak![0],
							currentParams.sticksRangeStreak![1]
						)
				break
			case 5:
				aiMoveFunction = move_5
				break
		}

		if (!aiMoveFunction) {
			console.error('Не удалось определить функцию хода ИИ.')
			return null
		}

		const aiFinalPositionCoded = aiMoveFunction(currentCoded)
		const countBeforeAI = currentCoded.reduce((a, b) => a + b, 0)
		const countAfterAI = aiFinalPositionCoded.reduce((a, b) => a + b, 0)
		const sticksTakenByAI = countBeforeAI - countAfterAI

		if (sticksTakenByAI < 0) {
			console.error('Ошибка в логике ИИ: количество палочек увеличилось!')
			return null
		}

		const tempArrayForRegrouping = currentSticks.map((stick, index) => ({
			...stick,
			isSelected: index >= currentSticks.length - sticksTakenByAI,
		}))

		return myStep(tempArrayForRegrouping)
	}

	// ==================================================================
	// ЛОГИКА ДЛЯ КНОПКИ "ПОДСКАЗКА" (ИСПРАВЛЕННАЯ ВЕРСИЯ)
	// ==================================================================
	const handleHelpClick = () => {
		// Блокируем, если ходит ИИ, нет подсказок или игра не началась
		if (
			!sticksArr ||
			isEnemyStep ||
			(helpsCount !== undefined && helpsCount <= 0)
		) {
			return
		}

		console.log('Игрок использует подсказку...')

		// --- ЭТАП 0: Начало ---
		// Сразу же включаем состояние "Подсказка" и уменьшаем счетчик.
		// GameState: "Подсказка..."
		setIsHelping(true)
		setGameParams({ ...gameParams, helpsCount: (helpsCount || 0) - 1 })

		// --- ЭТАП 1: Ход-подсказка (через 1 секунду) ---
		setTimeout(() => {
			if (!sticksArr) return // Проверка на случай размонтирования

			// Вычисляем ход, который ИИ сделал бы за игрока
			const helpMoveResult = calculateAiMove(sticksArr, gameParams)
			if (!helpMoveResult) {
				// Если ИИ не смог сходить, отменяем все и возвращаем ход игроку
				setIsHelping(false)
				setGameParams({
					...gameParams,
					helpsCount: (helpsCount || 0) - 1,
					isEnemyStep: false,
				})
				return
			}

			// Применяем ход-подсказку
			setSticksArr(helpMoveResult)

			// --- ЭТАП 2: Переход к ходу врага ---
			// Выключаем "Подсказку" и включаем "Ход противника"
			// GameState: "Ход противника"
			setIsHelping(false)
			const paramsAfterHelp = {
				...gameParams,
				sticksCount: helpMoveResult.length,
				helpsCount: (helpsCount || 0) - 1, // Убедимся, что счетчик обновлен
				isEnemyStep: true,
			}
			setGameParams(paramsAfterHelp)
			console.log('GameState: Ход переходит к врагу.')

			// --- ЭТАП 3: Настоящий ход ИИ (еще через 1.5 секунды) ---
			setTimeout(() => {
				const realAiMoveResult = calculateAiMove(
					helpMoveResult,
					paramsAfterHelp
				)
				if (!realAiMoveResult) {
					setGameParams({ ...paramsAfterHelp, isEnemyStep: false })
					return
				}

				// Применяем ход ИИ и возвращаем ход игроку
				// GameState: "Ваш ход"
				setSticksArr(realAiMoveResult)
				setGameParams({
					...paramsAfterHelp,
					sticksCount: realAiMoveResult.length,
					isEnemyStep: false,
				})
				console.log('GameState: Ход возвращается игроку.')
			}, 1500)
		}, 1000)
	}

	// Логика хода игрока
	const mainlogic = () => {
		if (!sticksArr || isEnemyStep || selectedSticksCount === 0) return

		const { modeNum } = getGameModeDataFromCookies()
		const playerMoveResult = myStep(sticksArr)
		const nowCoded = codeSticksData(sticksArr)
		const afterCoded = codeSticksData(playerMoveResult)
		let isMoveValid = false

		switch (modeNum) {
			case 1:
				if (maxPerStep)
					isMoveValid = mode_1_2_check(nowCoded, afterCoded, 1, maxPerStep)
				break
			case 2:
				if (sticksRange)
					isMoveValid = mode_1_2_check(
						nowCoded,
						afterCoded,
						sticksRange[0],
						sticksRange[1]
					)
				break
			case 3:
				if (maxPerStepStreak)
					isMoveValid = mode_3_4_check(
						nowCoded,
						afterCoded,
						1,
						maxPerStepStreak
					)
				break
			case 4:
				if (sticksRangeStreak)
					isMoveValid = mode_3_4_check(
						nowCoded,
						afterCoded,
						sticksRangeStreak[0],
						sticksRangeStreak[1]
					)
				break
			case 5:
				isMoveValid = mode_5_check(nowCoded, afterCoded)
				break
			default:
				console.error(`Неизвестный режим игры: ${modeNum}`)
				return
		}

		if (!isMoveValid) {
			console.log('Ход невалидный.')
			return
		}

		setSticksArr(playerMoveResult)
		const newParams = {
			...gameParams,
			sticksCount: playerMoveResult.length,
			isEnemyStep: true,
		}
		setGameParams(newParams)

		setTimeout(() => {
			const aiMoveResult = calculateAiMove(playerMoveResult, newParams)
			if (aiMoveResult) {
				setSticksArr(aiMoveResult)
				setGameParams({
					...newParams,
					sticksCount: aiMoveResult.length,
					isEnemyStep: false,
				})
			}
		}, 1000)
	}

	// Эффект для первого хода компьютера
	useEffect(() => {
		if (sticksArr && sticksArr.length > 0 && isFirstComputerStep) {
			console.log('Первый ход компьютера...')
			setGameParams({ ...gameParams, isEnemyStep: true })

			setTimeout(() => {
				const aiMoveResult = calculateAiMove(sticksArr, gameParams)
				if (aiMoveResult) {
					setSticksArr(aiMoveResult)
					setGameParams({
						...gameParams,
						sticksCount: aiMoveResult.length,
						isFirstComputerStep: false,
						isEnemyStep: false,
					})
				}
			}, 1000)
		}
	}, [isFirstComputerStep, sticksArr])

	const selectedSticksArr = sticksArr?.filter(stick => stick.isSelected)
	const selectedSticksCount = selectedSticksArr?.length || 0

	return (
		<>
			<ToastContainer
				containerId={'gameTable'}
				position='bottom-left'
				autoClose={false}
				hideProgressBar={true}
				closeOnClick={false}
				draggable={false}
			/>

			<GameTools isDev={isDev} onHelpClick={handleHelpClick} />

			<GamePageBackground />

			<ExitLinkButton to='/' className='absolute left-[20px] top-[20px] z-20'>
				Выход
			</ExitLinkButton>

			<GameState
				className='absolute left-1/2 transform -translate-x-1/2 top-[20px] select-none z-20'
				isEnemyStep={isEnemyStep}
				selectedCount={selectedSticksCount}
				isHelping={isHelping} // ✅ Передаем новое состояние в GameState
			/>
			<Clue className='z-20' />

			<Btn
				className={clsx(
					'bg-[#BA7821] text-[#e8e8e8] w-full max-w-md absolute bottom-[50px] transition-opacity z-20 select-none duration-300 ease-in-out',
					selectedSticksCount > 0 && !isEnemyStep
						? 'opacity-100'
						: 'opacity-0 pointer-events-none'
				)}
				onClick={mainlogic}
			>
				Забрать
			</Btn>
		</>
	)
}
