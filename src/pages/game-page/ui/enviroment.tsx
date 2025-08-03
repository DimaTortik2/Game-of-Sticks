import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { GameState } from '../../../widgets/game'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import clsx from 'clsx'
import { ToastContainer } from 'react-toastify'
import { GameTools } from '../../../features/game/table'
import {
	gameParamsCookieAtom,
	isHelpingAtom,
	sticksArrCookieAtom,
	winnerAtomCookieAtom,
} from '../../../app/stores/game/game-store'
import type { IStick } from '../../../entities/sticks/model/interfaces/stick.interfaces'
import Cookies from 'js-cookie'
import { myStep } from '../../../features/game/field/model/helpers/my-step'

import { codeSticksData } from '../../../features/game/field/model/helpers/code/code-sticks-data'
import {
	mode_1_2_check,
	mode_3_4_check,
	mode_5_check,
	move_1_2,
	move_3_4,
	move_5,
} from '../../../features/game/field'
import { EndGameModal } from '../../../features/game/table/ui/end-game-modal'
import { getGameModeDataFromCookies } from '../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'
import { toast } from 'react-toastify'
import { NotValidToast } from '../../../features/game/table/ui/not-valid-toast'
import { GameParams } from '../../../widgets/game/ui/game-params'

export function Enviroment() {
	const handleNottValid = () => {
		toast(<NotValidToast />, {
			containerId: 'gameTable',
			position: 'bottom-right',
			autoClose: 10000,
			hideProgressBar: false,
			closeOnClick: true,
			closeButton: false,
			className: 'full-width-toast z-20',
			progressClassName: 'red-progress-bar',
			toastId: 'notValidID',
		})
	}

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

	const [isHelping, setIsHelping] = useAtom(isHelpingAtom)

	const setWinner = useSetAtom(winnerAtomCookieAtom)
	const { modeNum } = getGameModeDataFromCookies()

	const calculateAiMove = (
		currentSticks: IStick[],
		currentParams: typeof gameParams
	): IStick[] | null => {
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
		setSticksArr(sticksArr.map(stick => ({ ...stick, isSelected: false }))) // снимаем выделение
		setIsHelping(true)
		setGameParams({ ...gameParams, helpsCount: (helpsCount || 0) - 1 })

		// --- ЭТАП 1: Ход-подсказка (через 1 секунду) ---
		setTimeout(() => {
			if (!sticksArr) return

			const helpMoveResult = calculateAiMove(sticksArr, gameParams)
			if (!helpMoveResult) {
				setIsHelping(false)
				setGameParams({
					...gameParams,
					helpsCount: (helpsCount || 0) - 1,
					isEnemyStep: false,
				})
				return
			}

			// ✅ ПРОВЕРКА ПОБЕДИТЕЛЯ №1: После хода-подсказки
			if (helpMoveResult.length === 0) {
				setSticksArr(helpMoveResult)
				setWinner('player') // Игрок "сделал" ход и проиграл
				setIsHelping(false)
				return // Прерываем цепочку, игра окончена
			}

			setSticksArr(helpMoveResult)
			setIsHelping(false)
			const paramsAfterHelp = {
				...gameParams,
				sticksCount: helpMoveResult.length,
				helpsCount: (helpsCount || 0) - 1,
				isEnemyStep: true,
			}
			setGameParams(paramsAfterHelp)
			console.log('GameState: Ход переходит к врагу.')

			// --- ЭТАП 2: Настоящий ход ИИ (еще через 1.5 секунды) ---
			setTimeout(() => {
				const realAiMoveResult = calculateAiMove(
					helpMoveResult,
					paramsAfterHelp
				)
				if (!realAiMoveResult) {
					setGameParams({ ...paramsAfterHelp, isEnemyStep: false })
					return
				}

				// ✅ ПРОВЕРКА ПОБЕДИТЕЛЯ №2: После ответного хода ИИ
				if (realAiMoveResult.length === 0) {
					setSticksArr(realAiMoveResult)
					setWinner('enemy') // ИИ сделал ход и проиграл
					return // Прерываем цепочку, игра окончена
				}

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
			handleNottValid()
			return
		}

		// Проверка на окончание игры ПОСЛЕ ХОДА ИГРОКА
		if (playerMoveResult.length === 0) {
			setSticksArr(playerMoveResult)
			setWinner('player') // Игрок проиграл -> победил враг
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
				// Проверка на окончание игры ПОСЛЕ ХОДА ИИ
				if (aiMoveResult.length === 0) {
					setSticksArr(aiMoveResult)
					setWinner('enemy') // ИИ проиграл -> победил игрок
					return
				}

				setSticksArr(aiMoveResult)
				setGameParams({
					...newParams,
					sticksCount: aiMoveResult.length,
					isEnemyStep: false,
				})
			}
		}, 1000)
	}

	useEffect(() => {
		if (sticksArr && sticksArr.length > 0 && isFirstComputerStep) {
			console.log('Первый ход компьютера...')
			setGameParams({ ...gameParams, isEnemyStep: true })

			setTimeout(() => {
				const aiMoveResult = calculateAiMove(sticksArr, gameParams)
				if (aiMoveResult) {
					if (aiMoveResult.length === 0) {
						console.log('ИИ взял последнюю палочку. ИИ проиграл.')
						setSticksArr(aiMoveResult)
						setWinner('player')
						return
					}

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
			<EndGameModal />

			<GameParams
				gameParams={gameParams}
				modeNum={modeNum}
				className='absolute top-[20px] right-[20px] z-20'
			/>

			<ToastContainer
				containerId={'gameTable'}
				position='bottom-left'
				autoClose={false}
				hideProgressBar={true}
				closeOnClick={false}
				draggable={false}
			/>

			<GameTools
				isDev={isDev}
				onHelpClick={handleHelpClick}
			/>

			<GamePageBackground />

			<ExitLinkButton to='/' className='absolute left-[20px] top-[20px] z-20'>
				Выход
			</ExitLinkButton>

			<GameState
				className='absolute left-1/2 transform -translate-x-1/2 top-[20px] select-none z-20'
				isEnemyStep={isEnemyStep}
				selectedCount={selectedSticksCount}
				isHelping={isHelping}
			/>

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
