import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

// --- Jotai State & Types (сохранены ваши пути) ---
import {
	gameParamsCookieAtom,
	sticksArrCookieAtom,
	isHelpingAtom,
	winnerAtomCookieAtom,
	grundyValuesAtom,
} from '../../../../../app/stores/game/game-store'
import type { IGameParams } from '../../../../../app/stores/interfaces/game-params.interface'
import type { IStick } from '../../../../../entities/sticks'

// --- UI & Services ---
import { getGameModeDataFromCookies } from '../../../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'
import { NotValidToast } from '../../../table/ui/not-valid-toast'
import { cacheService } from '../../../../cahce/api/services/cache.service'

// --- Логика и Утилиты (сохранены ваши пути) ---
import * as GameEngine from '../helpers/game-engine'
import * as GameEngineMode5 from '../helpers/game-engine-mode5'
import { normalizeGroupIdsAfterTurn } from '../helpers/normalize-group-ids'

const applyAiMoveToSticks = (
	currentSticks: IStick[],
	positionAfter: number[]
): IStick[] => {
	const availableSticks = currentSticks.filter(s => !s.isTaken)
	const totalSticksToKeep = positionAfter.reduce((sum, count) => sum + count, 0)
	const idsToKeep = new Set<number>()

	for (let i = 0; i < totalSticksToKeep; i++) {
		if (i < availableSticks.length) {
			idsToKeep.add(availableSticks[i].id)
		}
	}

	return currentSticks.map(stick => {
		if (stick.isTaken) return stick
		if (!idsToKeep.has(stick.id)) {
			return { ...stick, isTaken: true, isSelected: false }
		}
		return stick
	})
}

const sticksToPosition = (sticks: IStick[]): number[] => {
	if (!sticks || sticks.length === 0) return []
	const availableSticks = sticks.filter(s => !s.isTaken)
	if (availableSticks.length === 0) return []
	const groups = new Map<number, number>()

	availableSticks.forEach(stick => {
		const groupId = stick.groupId
		if (typeof groupId === 'number' && groupId >= 0) {
			groups.set(groupId, (groups.get(groupId) || 0) + 1)
		}
	})

	const sortedGroupIds = Array.from(groups.keys()).sort((a, b) => a - b)
	return sortedGroupIds.map(id => groups.get(id)!)
}

export const useGame = () => {
	const [gameParams, setGameParams] = useAtom(gameParamsCookieAtom)
	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)
	const [isHelping, setIsHelping] = useAtom(isHelpingAtom)
	const setWinner = useSetAtom(winnerAtomCookieAtom)
	const [grundyValues, setGrundyValues] = useAtom(grundyValuesAtom)

	const [isCacheModalOpen, setCacheModalOpen] = useState(false)
	const [cacheCalcProgress, setCacheCalcProgress] = useState(0)
	const [cacheStatusMessage, setCacheStatusMessage] = useState('')

	const { modeNum } = getGameModeDataFromCookies()
	const isDev = Cookies.get('devMode') === 'true'
	const { isEnemyStep, isFirstComputerStep, helpsCount } = gameParams
	const selectedSticksCount =
		sticksArr?.filter(stick => stick.isSelected && !stick.isTaken).length || 0

	const showNotValidMoveToast = useCallback(() => {
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
	}, [])

	const makeAiTurn = useCallback(
		async (currentSticks: IStick[], currentParams: IGameParams) => {
			const positionBefore = sticksToPosition(currentSticks)
			let positionAfter: number[] | null = null

			switch (modeNum) {
				case 1:
					positionAfter = GameEngine.move_1_2(
						positionBefore,
						1,
						currentParams.maxPerStep!
					)
					break
				case 2:
					positionAfter = GameEngine.move_1_2(
						positionBefore,
						currentParams.sticksRange![0],
						currentParams.sticksRange![1]
					)
					break
				case 3:
					positionAfter = GameEngine.move_3_4(
						positionBefore,
						1,
						currentParams.maxPerStepStreak!
					)
					break
				case 4:
					positionAfter = GameEngine.move_3_4(
						positionBefore,
						currentParams.sticksRangeStreak![0],
						currentParams.sticksRangeStreak![1]
					)
					break
				case 5:
					if (!grundyValues) {
						if (currentParams.sticksCount > 30) {
							setCacheModalOpen(true)
							return
						}
						const cache = GameEngineMode5.calculateGrundyCache(
							currentParams.sticksCount,
							() => {}
						)
						setGrundyValues(cache)
						positionAfter = GameEngineMode5.move_5(positionBefore, cache)
					} else {
						positionAfter = GameEngineMode5.move_5(positionBefore, grundyValues)
					}
					break
			}

			if (positionAfter === null) {
				console.error('AI не смог сделать ход.')
				setGameParams({ ...currentParams, isEnemyStep: false })
				return
			}

			let newSticksState = applyAiMoveToSticks(currentSticks, positionAfter)
			newSticksState = normalizeGroupIdsAfterTurn(newSticksState)

			const remainingCount = newSticksState.filter(s => !s.isTaken).length
			const finalParams = {
				...currentParams,
				sticksCount: remainingCount,
				isEnemyStep: false,
			}
			const positionForPlayer = sticksToPosition(newSticksState)

			if (!GameEngine.canAnyoneMove(positionForPlayer, finalParams, modeNum)) {
				setSticksArr(newSticksState)
				setWinner('enemy')
				return
			}

			setSticksArr(newSticksState)
			setGameParams(finalParams)
		},
		[
			modeNum,
			grundyValues,
			setGameParams,
			setSticksArr,
			setWinner,
			setGrundyValues,
			setCacheModalOpen,
		]
	)

	const handlePlayerTurn = useCallback(() => {
		if (!sticksArr || isEnemyStep || selectedSticksCount === 0) return

		const selectedSticks = sticksArr.filter(s => s.isSelected && !s.isTaken)

		// =================== ГЛАВНОЕ ИСПРАВЛЕНИЕ ЗДЕСЬ ===================
		// Эта проверка теперь применяется ТОЛЬКО к режимам 3 и 4.
		// Режим 5 будет полностью проверяться своей функцией `mode_5_check`.
		if ((modeNum === 3 || modeNum === 4) && selectedSticks.length > 0) {
			const sortedById = [...selectedSticks].sort((a, b) => a.id - b.id)
			for (let i = 1; i < sortedById.length; i++) {
				if (sortedById[i].id !== sortedById[i - 1].id + 1) {
					showNotValidMoveToast()
					return
				}
			}
		}
		// ================= КОНЕЦ ИСПРАВЛЕНИЯ =================

		const tempSticksForCheck = sticksArr.map(s =>
			s.isSelected ? { ...s, isTaken: true } : s
		)
		const normalizedForCheck = normalizeGroupIdsAfterTurn(tempSticksForCheck)

		const positionBefore = sticksToPosition(sticksArr)
		const positionAfter = sticksToPosition(normalizedForCheck)

		let isMoveValid = false
		switch (modeNum) {
			case 1:
				isMoveValid = GameEngine.mode_1_2_check(
					positionBefore,
					positionAfter,
					1,
					gameParams.maxPerStep!
				)
				break
			case 2:
				isMoveValid = GameEngine.mode_1_2_check(
					positionBefore,
					positionAfter,
					gameParams.sticksRange![0],
					gameParams.sticksRange![1]
				)
				break
			case 3:
				isMoveValid = GameEngine.mode_3_4_check(
					positionBefore,
					positionAfter,
					1,
					gameParams.maxPerStepStreak!
				)
				break
			case 4:
				isMoveValid = GameEngine.mode_3_4_check(
					positionBefore,
					positionAfter,
					gameParams.sticksRangeStreak![0],
					gameParams.sticksRangeStreak![1]
				)
				break
			case 5:
				isMoveValid = GameEngineMode5.mode_5_check(
					positionBefore,
					positionAfter
				)
				break
		}

		if (!isMoveValid) {
			showNotValidMoveToast()
			setSticksArr(sticksArr.map(s => ({ ...s, isSelected: false })))
			return
		}

		let sticksAfterPlayerMove = sticksArr.map(stick =>
			stick.isSelected ? { ...stick, isTaken: true, isSelected: false } : stick
		)
		sticksAfterPlayerMove = normalizeGroupIdsAfterTurn(sticksAfterPlayerMove)

		const remainingAfterPlayer = sticksAfterPlayerMove.filter(
			s => !s.isTaken
		).length
		const newParams = {
			...gameParams,
			sticksCount: remainingAfterPlayer,
			isEnemyStep: true,
		}
		const positionForOpponent = sticksToPosition(sticksAfterPlayerMove)

		if (!GameEngine.canAnyoneMove(positionForOpponent, newParams, modeNum)) {
			setSticksArr(sticksAfterPlayerMove)
			setWinner('player')
			return
		}

		setSticksArr(sticksAfterPlayerMove)
		setGameParams(newParams)
		setTimeout(() => makeAiTurn(sticksAfterPlayerMove, newParams), 1500)
	}, [
		sticksArr,
		isEnemyStep,
		selectedSticksCount,
		gameParams,
		modeNum,
		setSticksArr,
		setWinner,
		setGameParams,
		makeAiTurn,
		showNotValidMoveToast,
	])

	const handleHelpClick = useCallback(async () => {
		if (
			!sticksArr ||
			isEnemyStep ||
			(helpsCount !== undefined && helpsCount <= 0)
		)
			return

		setIsHelping(true)
		const newHelpsCount = (helpsCount || 0) - 1
		const currentParamsForHelp = { ...gameParams, helpsCount: newHelpsCount }
		setGameParams(currentParamsForHelp)

		const positionBefore = sticksToPosition(sticksArr)
		let positionAfter: number[] | null = null

		switch (modeNum) {
			case 1:
				positionAfter = GameEngine.move_1_2(
					positionBefore,
					1,
					currentParamsForHelp.maxPerStep!
				)
				break
			case 2:
				positionAfter = GameEngine.move_1_2(
					positionBefore,
					currentParamsForHelp.sticksRange![0],
					currentParamsForHelp.sticksRange![1]
				)
				break
			case 3:
				positionAfter = GameEngine.move_3_4(
					positionBefore,
					1,
					currentParamsForHelp.maxPerStepStreak!
				)
				break
			case 4:
				positionAfter = GameEngine.move_3_4(
					positionBefore,
					currentParamsForHelp.sticksRangeStreak![0],
					currentParamsForHelp.sticksRangeStreak![1]
				)
				break
			case 5:
				if (!grundyValues) {
					if (currentParamsForHelp.sticksCount > 30) {
						setCacheModalOpen(true)
						setIsHelping(false)
						setGameParams(gameParams)
						return
					}
					const cache = GameEngineMode5.calculateGrundyCache(
						currentParamsForHelp.sticksCount,
						() => {}
					)
					positionAfter = GameEngineMode5.move_5(positionBefore, cache)
				} else {
					positionAfter = GameEngineMode5.move_5(positionBefore, grundyValues)
				}
				break
		}

		if (positionAfter === null) {
			console.error('Подсказка не смогла рассчитать ход.')
			setIsHelping(false)
			setGameParams(gameParams)
			return
		}

		setTimeout(() => {
			let sticksAfterHelp = applyAiMoveToSticks(sticksArr, positionAfter!)
			sticksAfterHelp = normalizeGroupIdsAfterTurn(sticksAfterHelp)

			const remainingAfterHelp = sticksAfterHelp.filter(s => !s.isTaken).length
			const paramsAfterHelp = {
				...currentParamsForHelp,
				sticksCount: remainingAfterHelp,
				isEnemyStep: true,
			}
			const positionForOpponent = sticksToPosition(sticksAfterHelp)

			if (
				!GameEngine.canAnyoneMove(positionForOpponent, paramsAfterHelp, modeNum)
			) {
				setSticksArr(sticksAfterHelp)
				setWinner('player')
				setIsHelping(false)
				return
			}

			setSticksArr(sticksAfterHelp)
			setGameParams(paramsAfterHelp)
			setIsHelping(false)

			setTimeout(() => makeAiTurn(sticksAfterHelp, paramsAfterHelp), 1500)
		}, 1000)
	}, [
		sticksArr,
		isEnemyStep,
		helpsCount,
		gameParams,
		modeNum,
		grundyValues,
		setGameParams,
		setIsHelping,
		setSticksArr,
		setWinner,
		makeAiTurn,
		setCacheModalOpen,
	])

	useEffect(() => {
		if (sticksArr && sticksArr.length > 0 && isFirstComputerStep) {
			const initialParams = {
				...gameParams,
				isEnemyStep: true,
				isFirstComputerStep: false,
			}
			setGameParams(initialParams)
			setTimeout(() => makeAiTurn(sticksArr, initialParams), 1000)
		}
	}, [isFirstComputerStep, sticksArr, gameParams, setGameParams, makeAiTurn])

	const handleLoadCacheFromServer = useCallback(async () => {
		setCacheStatusMessage('Загрузка с сервера...')
		try {
			const cache = await cacheService.loadFromServer()
			setGrundyValues(cache)
			setCacheModalOpen(false)
			setTimeout(() => makeAiTurn(sticksArr!, gameParams), 50)
		} catch (error) {
			setCacheStatusMessage(
				`Ошибка: ${
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				}`
			)
		}
	}, [sticksArr, gameParams, setGrundyValues, makeAiTurn])

	const handleLoadCacheFromFile = useCallback(
		async (file: File) => {
			setCacheStatusMessage('Чтение файла...')
			try {
				const cache = await cacheService.loadFromFile(file)
				setGrundyValues(cache)
				setCacheModalOpen(false)
				setTimeout(() => makeAiTurn(sticksArr!, gameParams), 50)
			} catch (error) {
				setCacheStatusMessage(
					`Ошибка: ${
						error instanceof Error ? error.message : 'Неизвестная ошибка'
					}`
				)
			}
		},
		[sticksArr, gameParams, setGrundyValues, makeAiTurn]
	)

	const handleCalculateCache = useCallback(async () => {
		setCacheStatusMessage('Идет расчет... Это займет много времени.')
		setCacheCalcProgress(0)
		try {
			const cache = await cacheService.calculate(
				gameParams.sticksCount,
				percent => {
					setCacheCalcProgress(percent)
				}
			)
			setGrundyValues(cache)
			setCacheModalOpen(false)
			setTimeout(() => makeAiTurn(sticksArr!, gameParams), 50)
		} catch (error) {
			setCacheStatusMessage(
				`Ошибка: ${
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				}`
			)
		}
	}, [
		gameParams.sticksCount,
		sticksArr,
		gameParams,
		setGrundyValues,
		makeAiTurn,
	])

	return {
		gameParams,
		isDev,
		modeNum,
		isEnemyStep,
		isHelping,
		selectedSticksCount,
		handlePlayerTurn,
		handleHelpClick,
		isCacheModalOpen,
		cacheCalcProgress,
		cacheStatusMessage,
		handleLoadCacheFromServer,
		handleLoadCacheFromFile,
		handleCalculateCache,
	}
}
