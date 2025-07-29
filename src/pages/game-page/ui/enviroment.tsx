import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { GameState } from '../../../widgets/game'
import { Clue } from '../../../shared/ui/alerts/clue'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import { useAtomValue, useSetAtom } from 'jotai'

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
import { setGameParamsToCookies } from '../../../app/stores/game/cookies/game-params/set-game-params-to-cookies'
import { codeSticksData } from '../../../features/game/field/model/helpers/code/code-sticks-data'
import { decodeSticksData } from '../../../features/game/field/model/helpers/code/decode-sticks-data'
import {
	mode_1_2_check,
	mode_3_4_check,
	mode_5_check,
	move_1_2,
	move_3_4,
	move_5,
} from '../../../features/game/field'
import type { IGameParams } from '../../../app/stores/interfaces/game-params.interface'

export function Enviroment() {
	const gameParams = useAtomValue(gameParamsCookieAtom)
	const {
		sticksCount,
		maxPerStep,
		maxPerStepStreak,
		sticksRange,
		sticksRangeStreak,
	} = gameParams

	const setGameParams = useSetAtom(gameParamsCookieAtom)

	const isDev = Cookies.get('devMode') === 'true'

	const sticksArr = useAtomValue<IStick[] | undefined>(sticksArrCookieAtom)
	const setSticksArr = useSetAtom(sticksArrCookieAtom)

	// console.log({ sticksArr })

	const selectedSticksArr = sticksArr?.filter(stick => {
		// console.log({ isSelected: stick.isSelected })
		return stick.isSelected
	})
	// console.log({ selectedSticksArr })

	const selectedSticksCount = selectedSticksArr?.length || 0

	// main logic
	// const mainlogic = () => {
	// 	const { modeNum } = getGameModeDataFromCookies()

	// 	const nowCoded = codeSticksData(sticksArr)
	// 	if (nowCoded.length === 0) {
	// 		console.log('beforeSticksArr is Empty')
	// 		return
	// 	}

	// 	setSticksArr(myStep(sticksArr))
	// 	const afterCoded = codeSticksData(myStep(sticksArr))

	// 	if (afterCoded.length === 0) {
	// 		console.log('beforeSticksArr is Empty')
	// 		return
	// 	}

	// 	switch (modeNum) {
	// 		case 1:
	// 			if (!maxPerStep) {
	// 				console.log('maxPerStep нету')
	// 				break
	// 			}

	// 			if (mode_1_2_check(nowCoded, afterCoded, 1, maxPerStep)) {
	// 				const afterDecoded = decodeSticksData(afterCoded)
	// 				setSticksArr(afterDecoded)
	// 				setGameParams({
	// 					...gameParams,
	// 					sticksCount: afterDecoded.length,
	// 				})

	// 				setTimeout(() => {
	// 					setSticksArr(decodeSticksData(move_1_2(afterCoded, 1, maxPerStep)))
	// 				}, 1000)
	// 			}
	// 			break

	// 		case 2:
	// 			if (!sticksRange || sticksRange?.length === 0) {
	// 				console.log(
	// 					'sticksRange нету или вот как оно выглядит: ',
	// 					sticksRange
	// 				)
	// 				break
	// 			}

	// 			if (
	// 				mode_1_2_check(nowCoded, afterCoded, sticksRange[0], sticksRange[1])
	// 			) {
	// 				const afterDecoded = decodeSticksData(afterCoded)
	// 				setSticksArr(afterDecoded)
	// 				setGameParams({
	// 					...gameParams,
	// 					sticksCount: afterDecoded.length,
	// 				})

	// 				setTimeout(() => {
	// 					setSticksArr(
	// 						decodeSticksData(
	// 							move_1_2(afterCoded, sticksRange[0], sticksRange[1])
	// 						)
	// 					)
	// 				}, 1000)
	// 			}
	// 			break

	// 		case 3:
	// 			if (!maxPerStepStreak) {
	// 				console.log('maxPerStepStreak нету')
	// 				break
	// 			}

	// 			if (mode_3_4_check(nowCoded, afterCoded, 1, maxPerStepStreak)) {
	// 				const afterDecoded = decodeSticksData(afterCoded)
	// 				setSticksArr(afterDecoded)
	// 				setGameParams({
	// 					...gameParams,
	// 					sticksCount: afterDecoded.length,
	// 				})

	// 				setTimeout(() => {
	// 					setSticksArr(
	// 						decodeSticksData(move_3_4(afterCoded, 1, maxPerStepStreak))
	// 					)
	// 				}, 1000)
	// 			}
	// 			break

	// 		case 4:
	// 			if (!sticksRangeStreak || sticksRangeStreak?.length === 0) {
	// 				console.log(
	// 					'sticksRangeStreak нету или вот как оно выглядит: ',
	// 					sticksRangeStreak
	// 				)
	// 				break
	// 			}

	// 			if (
	// 				mode_3_4_check(
	// 					nowCoded,
	// 					afterCoded,
	// 					sticksRangeStreak[0],
	// 					sticksRangeStreak[1]
	// 				)
	// 			) {
	// 				const afterDecoded = decodeSticksData(afterCoded)
	// 				setSticksArr(afterDecoded)
	// 				setGameParams({
	// 					...gameParams,
	// 					sticksCount: afterDecoded.length,
	// 				})

	// 				setTimeout(() => {
	// 					setSticksArr(
	// 						decodeSticksData(
	// 							move_3_4(afterCoded, sticksRangeStreak[0], sticksRangeStreak[1])
	// 						)
	// 					)
	// 				}, 1000)
	// 			}
	// 			break

	// 		case 5:
	// 			if (mode_5_check(nowCoded, afterCoded)) {
	// 				const afterDecoded = decodeSticksData(afterCoded)
	// 				setSticksArr(afterDecoded)
	// 				setGameParams({
	// 					...gameParams,
	// 					sticksCount: afterDecoded.length,
	// 				})

	// 				setTimeout(() => {
	// 					setSticksArr(decodeSticksData(move_5(afterCoded)))
	// 				}, 1000)
	// 			}
	// 			break
	// 	}
	// }

	const mainlogic = () => {
		if (!sticksArr) {
			console.error('mainlogic вызвана, когда sticksArr еще не загружен.')
			return
		}

		const { modeNum } = getGameModeDataFromCookies()

		// ШАГ 1: Ход игрока. Вычисляем результат ОДИН РАЗ.
		// playerMoveResult содержит палочки с СОХРАНЕННЫМИ ID и новыми groupId.
		const playerMoveResult = myStep(sticksArr)

		// Кодируем состояние до и после для ПРОВЕРКИ.
		const nowCoded = codeSticksData(sticksArr)
		const afterCoded = codeSticksData(playerMoveResult)

		// ШАГ 2: Проверка хода игрока.
		let isMoveValid = false
		let aiMoveFunction: ((pos: number[]) => number[]) | null = null

		switch (modeNum) {
			case 1:
				if (maxPerStep) {
					isMoveValid = mode_1_2_check(nowCoded, afterCoded, 1, maxPerStep)
					if (isMoveValid) aiMoveFunction = pos => move_1_2(pos, 1, maxPerStep)
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
					if (isMoveValid)
						aiMoveFunction = pos =>
							move_1_2(pos, sticksRange[0], sticksRange[1])
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
					if (isMoveValid)
						aiMoveFunction = pos => move_3_4(pos, 1, maxPerStepStreak)
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
					if (isMoveValid)
						aiMoveFunction = pos =>
							move_3_4(pos, sticksRangeStreak[0], sticksRangeStreak[1])
				}
				break
			case 5:
				isMoveValid = mode_5_check(nowCoded, afterCoded)
				if (isMoveValid) aiMoveFunction = move_5
				break
			default:
				console.error(`Неизвестный режим игры: ${modeNum}`)
				return
		}

		if (!isMoveValid) {
			console.log('Ход невалидный, состояние не изменено.')
			// Здесь можно добавить логику для отображения ошибки игроку.
			return
		}

		// ШАГ 3: Если ход валидный, обновляем состояние после хода ИГРОКА.
		// На этом этапе в глобальном состоянии лежат палочки с правильными ID.
		setSticksArr(playerMoveResult)
		const newGameParamsAfterPlayer = {
			...gameParams,
			sticksCount: playerMoveResult.length,
		}
		setGameParams(newGameParamsAfterPlayer)

		// ШАГ 4: Ход КОМПЬЮТЕРА (через 1 секунду).
		setTimeout(() => {
			if (!aiMoveFunction) return

			// Вычисляем закодированное состояние доски после хода ИИ.
			const aiFinalPositionCoded = aiMoveFunction(afterCoded)

			// Считаем, сколько палочек было и сколько стало, чтобы понять, сколько взял ИИ.
			const countAfterPlayer = afterCoded.reduce((a, b) => a + b, 0)
			const countAfterAI = aiFinalPositionCoded.reduce((a, b) => a + b, 0)
			const sticksTakenByAI = countAfterPlayer - countAfterAI

			if (sticksTakenByAI < 0) {
				console.error('Ошибка в логике ИИ: количество палочек увеличилось!')
				return
			}

			// СОЗДАЕМ ВРЕМЕННЫЙ МАССИВ ДЛЯ ПЕРЕСЧЕТА ГРУПП.
			// Мы берем доску ПОСЛЕ хода игрока (playerMoveResult)
			// и помечаем как "isSelected" те палочки, которые решил забрать ИИ.
			// Будем считать, что ИИ всегда берет палочки с конца.
			const tempArrayForRegrouping = playerMoveResult.map((stick, index) => ({
				...stick,
				isSelected: index >= playerMoveResult.length - sticksTakenByAI,
			}))

			// Вызываем myStep с этим временным массивом. Он удалит "выделенные" ИИ
			// палочки и ПРАВИЛЬНО пересчитает группы, так как ID в нем настоящие.
			const finalSticksAfterAI = myStep(tempArrayForRegrouping)

			// Обновляем состояние финальным результатом.
			setSticksArr(finalSticksAfterAI)
			const newGameParamsAfterAI = {
				...newGameParamsAfterPlayer,
				sticksCount: finalSticksAfterAI.length,
			}
			setGameParams(newGameParamsAfterAI)
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
				draggable={false} // нельзя перетаскивать мышкой
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
				isEnemyStep={false} // пока что hard code
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
