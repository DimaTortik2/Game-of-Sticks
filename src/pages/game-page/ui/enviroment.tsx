// import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
// import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
// import { GameState } from '../../../widgets/game'
// import { Clue } from '../../../shared/ui/alerts/clue'
// import { Btn } from '../../../shared/ui/btns-or-links/btn'
// import { useAtomValue, useSetAtom } from 'jotai'

// import clsx from 'clsx'
// import { ToastContainer } from 'react-toastify'
// import { GameTableBtn } from '../../../features/game/table'
// import {
// 	gameParamsCookieAtom,
// 	sticksArrCookieAtom,
// } from '../../../app/stores/game/game-store'
// import type { IStick } from '../../../entities/sticks/model/interfaces/stick.interfaces'
// import Cookies from 'js-cookie'
// import { myStep } from '../../../features/game/field/model/helpers/my-step'
// import { getGameModeDataFromCookies } from '../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'
// import { codeSticksData } from '../../../features/game/field/model/helpers/code/code-sticks-data'
// import {
// 	mode_1_2_check,
// 	mode_3_4_check,
// 	mode_5_check,
// 	move_1_2,
// 	move_3_4,
// 	move_5,
// } from '../../../features/game/field'

// export function Enviroment() {
// 	const gameParams = useAtomValue(gameParamsCookieAtom)
// 	const {
// 		maxPerStep,
// 		maxPerStepStreak,
// 		sticksRange,
// 		sticksRangeStreak,
// 		isFirstComputerStep,
// 	} = gameParams

// 	const setGameParams = useSetAtom(gameParamsCookieAtom)

// 	const isDev = Cookies.get('devMode') === 'true'

// 	const sticksArr = useAtomValue<IStick[] | undefined>(sticksArrCookieAtom)
// 	const setSticksArr = useSetAtom(sticksArrCookieAtom)

// 	const selectedSticksArr = sticksArr?.filter(stick => {
// 		return stick.isSelected
// 	})

// 	const selectedSticksCount = selectedSticksArr?.length || 0

// 	const mainlogic = () => {
// 		if (!sticksArr) {
// 			console.error('mainlogic вызвана, когда sticksArr еще не загружен.')
// 			return
// 		}

// 		const { modeNum } = getGameModeDataFromCookies()

// 		// ШАГ 1: Ход игрока. Вычисляем результат ОДИН РАЗ.
// 		// playerMoveResult содержит палочки с СОХРАНЕННЫМИ ID и новыми groupId.
// 		const playerMoveResult = myStep(sticksArr)

// 		// Кодируем состояние до и после для ПРОВЕРКИ.
// 		const nowCoded = codeSticksData(sticksArr)
// 		const afterCoded = codeSticksData(playerMoveResult)

// 		// ШАГ 2: Проверка хода игрока.
// 		let isMoveValid = false
// 		let aiMoveFunction: ((pos: number[]) => number[]) | null = null

// 		switch (modeNum) {
// 			case 1:
// 				if (maxPerStep) {
// 					isMoveValid = mode_1_2_check(nowCoded, afterCoded, 1, maxPerStep)
// 					if (isMoveValid) aiMoveFunction = pos => move_1_2(pos, 1, maxPerStep)
// 				}
// 				break
// 			case 2:
// 				if (sticksRange) {
// 					isMoveValid = mode_1_2_check(
// 						nowCoded,
// 						afterCoded,
// 						sticksRange[0],
// 						sticksRange[1]
// 					)
// 					if (isMoveValid)
// 						aiMoveFunction = pos =>
// 							move_1_2(pos, sticksRange[0], sticksRange[1])
// 				}
// 				break
// 			case 3:
// 				if (maxPerStepStreak) {
// 					isMoveValid = mode_3_4_check(
// 						nowCoded,
// 						afterCoded,
// 						1,
// 						maxPerStepStreak
// 					)
// 					if (isMoveValid)
// 						aiMoveFunction = pos => move_3_4(pos, 1, maxPerStepStreak)
// 				}
// 				break
// 			case 4:
// 				if (sticksRangeStreak) {
// 					isMoveValid = mode_3_4_check(
// 						nowCoded,
// 						afterCoded,
// 						sticksRangeStreak[0],
// 						sticksRangeStreak[1]
// 					)
// 					if (isMoveValid)
// 						aiMoveFunction = pos =>
// 							move_3_4(pos, sticksRangeStreak[0], sticksRangeStreak[1])
// 				}
// 				break
// 			case 5:
// 				isMoveValid = mode_5_check(nowCoded, afterCoded)
// 				if (isMoveValid) aiMoveFunction = move_5
// 				break
// 			default:
// 				console.error(`Неизвестный режим игры: ${modeNum}`)
// 				return
// 		}

// 		if (!isMoveValid) {
// 			console.log('Ход невалидный, состояние не изменено.')
// 			// Здесь можно добавить логику для отображения ошибки игроку.
// 			return
// 		}

// 		// ШАГ 3: Если ход валидный, обновляем состояние после хода ИГРОКА.
// 		// На этом этапе в глобальном состоянии лежат палочки с правильными ID.
// 		setSticksArr(playerMoveResult)
// 		const newGameParamsAfterPlayer = {
// 			...gameParams,
// 			sticksCount: playerMoveResult.length,
// 		}
// 		setGameParams(newGameParamsAfterPlayer)

// 		// ШАГ 4: Ход КОМПЬЮТЕРА (через 1 секунду).
// 		setTimeout(() => {
// 			if (!aiMoveFunction) return

// 			// Вычисляем закодированное состояние доски после хода ИИ.
// 			const aiFinalPositionCoded = aiMoveFunction(afterCoded)

// 			// Считаем, сколько палочек было и сколько стало, чтобы понять, сколько взял ИИ.
// 			const countAfterPlayer = afterCoded.reduce((a, b) => a + b, 0)
// 			const countAfterAI = aiFinalPositionCoded.reduce((a, b) => a + b, 0)
// 			const sticksTakenByAI = countAfterPlayer - countAfterAI

// 			if (sticksTakenByAI < 0) {
// 				console.error('Ошибка в логике ИИ: количество палочек увеличилось!')
// 				return
// 			}

// 			// СОЗДАЕМ ВРЕМЕННЫЙ МАССИВ ДЛЯ ПЕРЕСЧЕТА ГРУПП.
// 			// Мы берем доску ПОСЛЕ хода игрока (playerMoveResult)
// 			// и помечаем как "isSelected" те палочки, которые решил забрать ИИ.
// 			// Будем считать, что ИИ всегда берет палочки с конца.
// 			const tempArrayForRegrouping = playerMoveResult.map((stick, index) => ({
// 				...stick,
// 				isSelected: index >= playerMoveResult.length - sticksTakenByAI,
// 			}))

// 			// Вызываем myStep с этим временным массивом. Он удалит "выделенные" ИИ
// 			// палочки и ПРАВИЛЬНО пересчитает группы, так как ID в нем настоящие.
// 			const finalSticksAfterAI = myStep(tempArrayForRegrouping)

// 			// Обновляем состояние финальным результатом.
// 			setSticksArr(finalSticksAfterAI)
// 			const newGameParamsAfterAI = {
// 				...newGameParamsAfterPlayer,
// 				sticksCount: finalSticksAfterAI.length,
// 			}
// 			setGameParams(newGameParamsAfterAI)
// 		}, 1000)
// 	}

// 	return (
// 		<>
// 			<ToastContainer
// 				containerId={'gameTable'}
// 				position='bottom-left'
// 				autoClose={false}
// 				hideProgressBar={true}
// 				closeOnClick={false}
// 				draggable={false} // нельзя перетаскивать мышкой
// 			/>

// 			<GameTableBtn
// 				isVisible={isDev}
// 				className='absolute left-[20px] bottom-[20px] z-20'
// 			/>

// 			<GamePageBackground />

// 			<ExitLinkButton to='/' className='absolute left-[20px] top-[20px] z-20'>
// 				Выход
// 			</ExitLinkButton>

// 			<GameState
// 				className='absolute left-1/2 transform -translate-x-1/2 top-[20px] select-none z-20'
// 				isEnemyStep={false} // пока что hard code
// 				selectedCount={selectedSticksCount}
// 			/>
// 			<Clue className='z-20' />

// 			<Btn
// 				className={clsx(
// 					'bg-[#BA7821] text-[#e8e8e8] w-full max-w-md absolute bottom-[50px] transition-opacity opacity-0 z-20 select-none  duration-300 ease-in-out',
// 					selectedSticksCount > 0 && 'opacity-100'
// 				)}
// 				onClick={mainlogic}
// 			>
// 				Забрать
// 			</Btn>
// 		</>
// 	)
// }


import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { GameState } from '../../../widgets/game'
import { Clue } from '../../../shared/ui/alerts/clue'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import clsx from 'clsx'
import { ToastContainer } from 'react-toastify'
import { GameTableBtn } from '../../../features/game/table'
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
		maxPerStep,
		maxPerStepStreak,
		sticksRange,
		sticksRangeStreak,
		isFirstComputerStep,
	} = gameParams

	const setGameParams = useSetAtom(gameParamsCookieAtom)
	const isDev = Cookies.get('devMode') === 'true'
	const sticksArr = useAtomValue<IStick[] | undefined>(sticksArrCookieAtom)
	const setSticksArr = useSetAtom(sticksArrCookieAtom)

	const makeAiMove = (
		currentSticks: IStick[],
		currentParams: typeof gameParams
	) => {
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
			return
		}

		const aiFinalPositionCoded = aiMoveFunction(currentCoded)
		const countBeforeAI = currentCoded.reduce((a, b) => a + b, 0)
		const countAfterAI = aiFinalPositionCoded.reduce((a, b) => a + b, 0)
		const sticksTakenByAI = countBeforeAI - countAfterAI

		if (sticksTakenByAI < 0) {
			console.error('Ошибка в логике ИИ: количество палочек увеличилось!')
			return
		}

		const tempArrayForRegrouping = currentSticks.map((stick, index) => ({
			...stick,
			isSelected: index >= currentSticks.length - sticksTakenByAI,
		}))

		const finalSticksAfterAI = myStep(tempArrayForRegrouping)

		setSticksArr(finalSticksAfterAI)
		const newGameParamsAfterAI = {
			...currentParams,
			sticksCount: finalSticksAfterAI.length,
			isFirstComputerStep: false,
		}
		setGameParams(newGameParamsAfterAI)
	}

	useEffect(() => {
		if (sticksArr && sticksArr.length > 0 && isFirstComputerStep) {
			console.log('Первый ход компьютера...')
			setTimeout(() => {
				makeAiMove(sticksArr, gameParams)
			}, 1000)
		}
	}, [isFirstComputerStep, sticksArr]) // Добавил sticksArr в зависимости для надежности

	const selectedSticksArr = sticksArr?.filter(stick => stick.isSelected)
	const selectedSticksCount = selectedSticksArr?.length || 0

	const mainlogic = () => {
		if (!sticksArr) return

		// ✅ ИСПРАВЛЕНИЕ: Добавляем эту строку
		const { modeNum } = getGameModeDataFromCookies()

		const playerMoveResult = myStep(sticksArr)
		const nowCoded = codeSticksData(sticksArr)
		const afterCoded = codeSticksData(playerMoveResult)

		let isMoveValid = false
		// Теперь `modeNum` здесь определен
		switch (modeNum) {
			case 1:
				if (maxPerStep) {
					isMoveValid = mode_1_2_check(nowCoded, afterCoded, 1, maxPerStep)
				}
				break
			case 2:
				if (sticksRange) {
					isMoveValid = mode_1_2_check(
						nowCoded,
						afterCoded,
						sticksRange[0],
						sticksRange[1]
					)
				}
				break
			case 3:
				if (maxPerStepStreak) {
					isMoveValid = mode_3_4_check(
						nowCoded,
						afterCoded,
						1,
						maxPerStepStreak
					)
				}
				break
			case 4:
				if (sticksRangeStreak) {
					isMoveValid = mode_3_4_check(
						nowCoded,
						afterCoded,
						sticksRangeStreak[0],
						sticksRangeStreak[1]
					)
				}
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
		const newGameParamsAfterPlayer = {
			...gameParams,
			sticksCount: playerMoveResult.length,
			isFirstComputerStep: false,
		}
		setGameParams(newGameParamsAfterPlayer)

		setTimeout(() => {
			makeAiMove(playerMoveResult, newGameParamsAfterPlayer)
		}, 1000)
	}

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

			<GameTableBtn
				isVisible={isDev}
				className='absolute left-[20px] bottom-[20px] z-20'
			/>

			<GamePageBackground />

			<ExitLinkButton to='/' className='absolute left-[20px] top-[20px] z-20'>
				Выход
			</ExitLinkButton>

			<GameState
				className='absolute left-1/2 transform -translate-x-1/2 top-[20px] select-none z-20'
				isEnemyStep={false}
				selectedCount={selectedSticksCount}
			/>
			<Clue className='z-20' />

			<Btn
				className={clsx(
					'bg-[#BA7821] text-[#e8e8e8] w-full max-w-md absolute bottom-[50px] transition-opacity opacity-0 z-20 select-none  duration-300 ease-in-out',
					selectedSticksCount > 0 && 'opacity-100'
				)}
				onClick={mainlogic}
			>
				Забрать
			</Btn>
		</>
	)
}