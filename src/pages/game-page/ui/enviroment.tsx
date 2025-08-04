import { GamePageBackground } from '../../../shared/ui/bg/game-page-background'
import { ExitLinkButton } from '../../../shared/ui/btns-or-links/exit-link-button'
import { GameState } from '../../../widgets/game'
import { Btn } from '../../../shared/ui/btns-or-links/btn'
import { useAtom, useSetAtom } from 'jotai'
import { useEffect } from 'react'
import clsx from 'clsx'
import { ToastContainer, toast } from 'react-toastify'
import { GameTools } from '../../../features/game/table'
import {
	gameParamsCookieAtom,
	isHelpingAtom,
	sticksArrCookieAtom,
	winnerAtomCookieAtom,
} from '../../../app/stores/game/game-store'
import type { IStick } from '../../../entities/sticks/model/interfaces/stick.interfaces'
import Cookies from 'js-cookie'

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
import { NotValidToast } from '../../../features/game/table/ui/not-valid-toast'
import { GameParams } from '../../../widgets/game/ui/game-params'

/**
 * Ключевая функция. После каждого хода она анализирует оставшиеся палочки
 * и переназначает им groupId, чтобы они всегда шли по порядку (0, 1, 2...).
 */
const normalizeGroupIdsAfterTurn = (sticks: IStick[]): IStick[] => {
	// 1. Находим только те палочки, что еще в игре, и сортируем их по ID
	const availableSticks = sticks
		.filter(s => !s.isTaken)
		.sort((a, b) => a.id - b.id)

	if (availableSticks.length === 0) {
		return sticks // Если палочек не осталось, ничего не делаем
	}

	// 2. Создаем карту для новых назначений: `Map<stickId, newGroupId>`
	const newAssignments = new Map<number, number>()
	let currentGroupId = 0
	let lastStickId = -1 // Используем -1 для инициализации

	for (const stick of availableSticks) {
		// Если ID текущей палочки не следует сразу за предыдущей, это новая группа
		if (lastStickId !== -1 && stick.id !== lastStickId + 1) {
			currentGroupId++
		}
		newAssignments.set(stick.id, currentGroupId)
		lastStickId = stick.id
	}

	// 3. Применяем новые groupId ко всему массиву палочек
	return sticks.map(stick => {
		if (newAssignments.has(stick.id)) {
			// Если палочка доступна, обновляем ее groupId
			return { ...stick, groupId: newAssignments.get(stick.id)! }
		}
		// Если палочка уже была взята, оставляем как есть
		return stick
	})
}

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

	const [gameParams, setGameParams] = useAtom(gameParamsCookieAtom)
	const {
		isEnemyStep,
		maxPerStep,
		maxPerStepStreak,
		sticksRange,
		sticksRangeStreak,
		isFirstComputerStep,
		helpsCount,
	} = gameParams

	const isDev = Cookies.get('devMode') === 'true'
	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)
	const [isHelping, setIsHelping] = useAtom(isHelpingAtom)
	const setWinner = useSetAtom(winnerAtomCookieAtom)
	const { modeNum } = getGameModeDataFromCookies()

	const calculateAiMove = (
		currentSticks: IStick[],
		currentParams: typeof gameParams
	): IStick[] | null => {
		const availableSticks = currentSticks.filter(stick => !stick.isTaken)
		if (availableSticks.length === 0) return currentSticks

		const currentCoded = codeSticksData(availableSticks)
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

		if (sticksTakenByAI <= 0) {
			console.log('ИИ не сделал ход.')
			return currentSticks.map(s => ({ ...s, isSelected: false }))
		}

		const sticksToSelectIds = new Set(
			availableSticks.slice(-sticksTakenByAI).map(s => s.id)
		)

		return currentSticks.map(stick => ({
			...stick,
			isSelected: sticksToSelectIds.has(stick.id),
		}))
	}

	const handleHelpClick = () => {
		if (
			!sticksArr ||
			isEnemyStep ||
			(helpsCount !== undefined && helpsCount <= 0)
		) {
			return
		}

		console.log('Игрок использует подсказку...')
		setSticksArr(sticksArr.map(stick => ({ ...stick, isSelected: false })))
		setIsHelping(true)
		const newHelpsCount = (helpsCount || 0) - 1
		setGameParams({ ...gameParams, helpsCount: newHelpsCount })

		setTimeout(() => {
			if (!sticksArr) return

			const sticksWithHelpSelection = calculateAiMove(sticksArr, {
				...gameParams,
				helpsCount: newHelpsCount,
			})
			if (!sticksWithHelpSelection) {
				setIsHelping(false)
				setGameParams({ ...gameParams, helpsCount: newHelpsCount })
				return
			}

			let afterHelpMove = sticksWithHelpSelection.map(stick =>
				stick.isSelected
					? { ...stick, isSelected: false, isTaken: true }
					: stick
			)
			afterHelpMove = normalizeGroupIdsAfterTurn(afterHelpMove)

			const remainingAfterHelp = afterHelpMove.filter(s => !s.isTaken).length

			if (remainingAfterHelp === 0) {
				setSticksArr(afterHelpMove)
				setWinner('player') // Игрок проиграл после подсказки
				setIsHelping(false)
				return
			}

			setSticksArr(afterHelpMove)
			setIsHelping(false)
			const paramsAfterHelp = {
				...gameParams,
				sticksCount: remainingAfterHelp,
				helpsCount: newHelpsCount,
				isEnemyStep: true,
			}
			setGameParams(paramsAfterHelp)
			console.log('GameState: Ход переходит к врагу.')

			setTimeout(() => {
				const sticksWithAiSelection = calculateAiMove(
					afterHelpMove,
					paramsAfterHelp
				)
				if (!sticksWithAiSelection) {
					setGameParams({ ...paramsAfterHelp, isEnemyStep: false })
					return
				}

				let afterAiMove = sticksWithAiSelection.map(stick =>
					stick.isSelected
						? { ...stick, isSelected: false, isTaken: true }
						: stick
				)
				afterAiMove = normalizeGroupIdsAfterTurn(afterAiMove)

				const remainingAfterAI = afterAiMove.filter(s => !s.isTaken).length

				if (remainingAfterAI === 0) {
					setSticksArr(afterAiMove)
					setWinner('enemy') // ИИ проиграл
					return
				}

				setSticksArr(afterAiMove)
				setGameParams({
					...paramsAfterHelp,
					sticksCount: remainingAfterAI,
					isEnemyStep: false,
				})
				console.log('GameState: Ход возвращается игроку.')
			}, 1500)
		}, 1000)
	}

	const mainlogic = () => {
		if (!sticksArr || isEnemyStep || selectedSticksCount === 0) return

		const { modeNum } = getGameModeDataFromCookies()

		const sticksBeforePlayerMove = sticksArr.filter(s => !s.isTaken)
		const tempAfterPlayerMove = sticksArr.map(stick =>
			stick.isSelected ? { ...stick, isTaken: true } : stick
		)

		const nowCoded = codeSticksData(sticksBeforePlayerMove)
		const afterCoded = codeSticksData(tempAfterPlayerMove)

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
			setSticksArr(sticksArr.map(s => ({ ...s, isSelected: false })))
			return
		}

		let afterPlayerMove = sticksArr.map(stick =>
			stick.isSelected
				? { ...stick, isTaken: true, isSelected: false }
				: { ...stick, isSelected: false }
		)

		afterPlayerMove = normalizeGroupIdsAfterTurn(afterPlayerMove)

		const remainingAfterPlayer = afterPlayerMove.filter(s => !s.isTaken).length
		if (remainingAfterPlayer === 0) {
			setSticksArr(afterPlayerMove)
			setWinner('player')
			return
		}

		setSticksArr(afterPlayerMove)
		const newParams = {
			...gameParams,
			sticksCount: remainingAfterPlayer,
			isEnemyStep: true,
		}
		setGameParams(newParams)

		setTimeout(() => {
			const sticksWithAiSelection = calculateAiMove(afterPlayerMove, newParams)
			if (sticksWithAiSelection) {
				let afterAiMove = sticksWithAiSelection.map(stick =>
					stick.isSelected
						? { ...stick, isSelected: false, isTaken: true }
						: stick
				)

				afterAiMove = normalizeGroupIdsAfterTurn(afterAiMove)

				const remainingSticksAfterAI = afterAiMove.filter(
					s => !s.isTaken
				).length

				if (remainingSticksAfterAI === 0) {
					setSticksArr(afterAiMove)
					setWinner('enemy')
					return
				}

				setSticksArr(afterAiMove)
				setGameParams({
					...newParams,
					sticksCount: remainingSticksAfterAI,
					isEnemyStep: false,
				})
			} else {
				setGameParams({ ...newParams, isEnemyStep: false })
			}
		}, 1000)
	}

	useEffect(() => {
		if (sticksArr && sticksArr.length > 0 && isFirstComputerStep) {
			console.log('Первый ход компьютера...')
			const initialParams = {
				...gameParams,
				isEnemyStep: true,
				isFirstComputerStep: false,
			}
			setGameParams(initialParams)

			setTimeout(() => {
				const sticksWithAiSelection = calculateAiMove(sticksArr, initialParams)
				if (sticksWithAiSelection) {
					let afterAiMove = sticksWithAiSelection.map(stick =>
						stick.isSelected
							? { ...stick, isSelected: false, isTaken: true }
							: stick
					)

					afterAiMove = normalizeGroupIdsAfterTurn(afterAiMove)

					const remainingCount = afterAiMove.filter(s => !s.isTaken).length
					if (remainingCount === 0) {
						setSticksArr(afterAiMove)
						setWinner('enemy')
						return
					}

					setSticksArr(afterAiMove)
					setGameParams({
						...initialParams,
						sticksCount: remainingCount,
						isEnemyStep: false,
					})
				}
			}, 1000)
		}
	}, [isFirstComputerStep, sticksArr?.length])

	const selectedSticksCount =
		sticksArr?.filter(stick => stick.isSelected && !stick.isTaken).length || 0

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

			<GameTools isDev={isDev} onHelpClick={handleHelpClick} />

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
