import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
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
import { NotValidToast } from '../../../../toasts/ui/not-valid-toast'
import { cacheService } from '../../../../cahce/api/services/cache.service'

// --- Логика и Утилиты (сохранены ваши пути) ---
import * as GameEngine from '../helpers/game-engine'
import * as GameEngineMode5 from '../helpers/game-engine-mode5'
import { normalizeGroupIdsAfterTurn } from '../helpers/normalize-group-ids'

const applyAiMoveToSticks = (
	currentSticks: IStick[],
	positionBefore: number[],
	positionAfter: number[],
	modeNum: number
): IStick[] => {
	const idsToTake = new Set<number>()
	const availableSticks = currentSticks.filter(s => !s.isTaken)

	// Для режимов 1 и 2, где можно брать любые палочки, используется простой метод "взять с конца"
	if (modeNum === 1 || modeNum === 2) {
		const totalSticksToKeep = positionAfter.reduce(
			(sum, count) => sum + count,
			0
		)
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

	// НОВАЯ, БОЛЕЕ НАДЕЖНАЯ ЛОГИКА ДЛЯ РЕЖИМОВ 3, 4, 5
	// Используем карты частот для определения изменений, что решает проблему с дублирующимися группами
	const beforeCounts = new Map<number, number>()
	positionBefore.forEach(size =>
		beforeCounts.set(size, (beforeCounts.get(size) || 0) + 1)
	)

	const afterCounts = new Map<number, number>()
	positionAfter.forEach(size =>
		afterCounts.set(size, (afterCounts.get(size) || 0) + 1)
	)

	// 1. Находим, какая группа была изменена (ее размер)
	let sourceGroupSize: number | undefined
	for (const [size, count] of beforeCounts.entries()) {
		if (count > (afterCounts.get(size) || 0)) {
			sourceGroupSize = size
			break
		}
	}

	if (sourceGroupSize === undefined) {
		console.error('AI apply move: не удалось найти исходную группу для хода.', {
			positionBefore,
			positionAfter,
		})
		return currentSticks // Возвращаем без изменений в случае ошибки
	}

	// 2. Находим, какие новые группы появились в результате хода
	const newGroupSizes: number[] = []
	for (const [size, count] of afterCounts.entries()) {
		const diff = count - (beforeCounts.get(size) || 0)
		for (let i = 0; i < diff; i++) {
			newGroupSizes.push(size)
		}
	}

	// 3. Находим физическую группу палочек, которая соответствует измененной группе
	const availableSticksByGroup = new Map<number, IStick[]>()
	availableSticks.forEach(stick => {
		if (!availableSticksByGroup.has(stick.groupId)) {
			availableSticksByGroup.set(stick.groupId, [])
		}
		availableSticksByGroup.get(stick.groupId)!.push(stick)
	})

	let targetGroupId: number | undefined
	for (const [groupId, sticksInGroup] of availableSticksByGroup.entries()) {
		if (sticksInGroup.length === sourceGroupSize) {
			targetGroupId = groupId
			break // Нашли первую подходящую группу
		}
	}

	if (targetGroupId === undefined) {
		console.error(
			`AI apply move: не удалось найти физическую группу размером ${sourceGroupSize}.`
		)
		return currentSticks
	}

	const sticksInTargetGroup = availableSticksByGroup.get(targetGroupId)!
	const sticksTakenCount =
		sourceGroupSize - newGroupSizes.reduce((sum, size) => sum + size, 0)

	// 4. Определяем, какие именно палочки взять
	if (newGroupSizes.length <= 1) {
		// Случай: группа уменьшилась или была удалена. Берем с конца этой группы.
		for (let i = 0; i < sticksTakenCount; i++) {
			idsToTake.add(sticksInTargetGroup[sticksInTargetGroup.length - 1 - i].id)
		}
	} else {
		// Случай: группа была разделена.
		// Берем палочки из "пробела" между новыми образовавшимися группами.
		const firstNewGroupSize = newGroupSizes[0]
		for (let i = 0; i < sticksTakenCount; i++) {
			const stickIndexToTake = firstNewGroupSize + i
			if (stickIndexToTake < sticksInTargetGroup.length) {
				idsToTake.add(sticksInTargetGroup[stickIndexToTake].id)
			}
		}
	}

	return currentSticks.map(stick =>
		idsToTake.has(stick.id)
			? { ...stick, isTaken: true, isSelected: false }
			: stick
	)
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

let cacheLoadingPromise: Promise<Map<string, number>> | null = null

export const useGame = () => {
	const [gameParams, setGameParams] = useAtom(gameParamsCookieAtom)
	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)
	const [isHelping, setIsHelping] = useAtom(isHelpingAtom)
	const setWinner = useSetAtom(winnerAtomCookieAtom)
	const [grundyValues, setGrundyValues] = useAtom(grundyValuesAtom)
	const [aiKnowledge, setAiKnowledge] = useState<number[]>([])

	const [isAiPreparing, setIsAiPreparing] = useState(false)
	const [isTurnInProgress, setIsTurnInProgress] = useState(false)
	const [isCacheModalOpen, setCacheModalOpen] = useState(false)
	const [cacheCalcProgress, setCacheCalcProgress] = useState(0)
	const [cacheStatusMessage, setCacheStatusMessage] = useState('')
	const isMounted = useRef(false)
	const [isReadyForAiFirstMove, setReadyForAiFirstMove] = useState(false)

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

	const ensureCache5 = useCallback(async (): Promise<Map<
		string,
		number
	> | null> => {
		if (modeNum !== 5) return null
		if (grundyValues) return grundyValues

		if (cacheLoadingPromise) {
			setIsAiPreparing(true)
			const cache = await cacheLoadingPromise
			setIsAiPreparing(false)
			return cache
		}

		setIsAiPreparing(true)
		return new Promise(resolve => {
			setCacheModalOpen(true)
			;(window as any).resolveCachePromise = resolve
		})
	}, [modeNum, grundyValues])

	const makeAiTurn = useCallback(
		async (currentSticks: IStick[], currentParams: IGameParams) => {
			setIsTurnInProgress(true)

			const aiCache5 = await ensureCache5()

			if (modeNum === 5 && !aiCache5) {
				setGameParams({ ...currentParams, isEnemyStep: false })
				setIsTurnInProgress(false)
				setIsAiPreparing(false)
				return
			}

			setIsAiPreparing(false)
			await new Promise(resolve => setTimeout(resolve, 1500))

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
						currentParams.maxPerStepStreak!,
						aiKnowledge
					)
					break
				case 4:
					positionAfter = GameEngine.move_3_4(
						positionBefore,
						currentParams.sticksRangeStreak![0],
						currentParams.sticksRangeStreak![1],
						aiKnowledge
					)
					break
				case 5:
					positionAfter = GameEngineMode5.move_5(positionBefore, aiCache5!)
					break
			}

			if (positionAfter === null) {
				console.error('AI не смог сделать ход (движок вернул null).')
				setGameParams({ ...currentParams, isEnemyStep: false })
				setIsTurnInProgress(false)
				return
			}

			let newSticksState = applyAiMoveToSticks(
				currentSticks,
				positionBefore,
				positionAfter,
				modeNum
			)
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
			} else {
				setSticksArr(newSticksState)
				setGameParams(finalParams)
			}

			setIsTurnInProgress(false)
		},
		[modeNum, ensureCache5, aiKnowledge, setGameParams, setSticksArr, setWinner]
	)

	const handlePlayerTurn = useCallback(() => {
		if (
			!sticksArr ||
			isTurnInProgress ||
			isEnemyStep ||
			selectedSticksCount === 0
		)
			return

		const selectedSticks = sticksArr.filter(s => s.isSelected && !s.isTaken)
		if ((modeNum === 3 || modeNum === 4) && selectedSticks.length > 0) {
			const sortedById = [...selectedSticks].sort((a, b) => a.id - b.id)
			for (let i = 1; i < sortedById.length; i++) {
				if (sortedById[i].id !== sortedById[i - 1].id + 1) {
					showNotValidMoveToast()
					return
				}
			}
		}

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

		makeAiTurn(sticksAfterPlayerMove, newParams)
	}, [
		sticksArr,
		isTurnInProgress,
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
			isTurnInProgress ||
			isEnemyStep ||
			(helpsCount !== undefined && helpsCount <= 0)
		)
			return

		setIsHelping(true)
		setIsTurnInProgress(true)

		const newHelpsCount = (helpsCount || 0) - 1
		const currentParamsForHelp = { ...gameParams, helpsCount: newHelpsCount }
		setGameParams(currentParamsForHelp)

		const cacheForHelp = await ensureCache5()
		if (modeNum === 5 && !cacheForHelp) {
			setIsHelping(false)
			setIsTurnInProgress(false)
			setGameParams(gameParams)
			return
		}

		setIsAiPreparing(false)

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
					currentParamsForHelp.maxPerStepStreak!,
					aiKnowledge
				)
				break
			case 4:
				positionAfter = GameEngine.move_3_4(
					positionBefore,
					currentParamsForHelp.sticksRangeStreak![0],
					currentParamsForHelp.sticksRangeStreak![1],
					aiKnowledge
				)
				break
			case 5:
				positionAfter = GameEngineMode5.move_5(positionBefore, cacheForHelp!)
				break
		}

		if (positionAfter === null) {
			console.error('Подсказка не смогла рассчитать ход.')
			setIsHelping(false)
			setIsTurnInProgress(false)
			setGameParams(gameParams)
			return
		}

		await new Promise(resolve => setTimeout(resolve, 1000))

		let sticksAfterHelp = applyAiMoveToSticks(
			sticksArr,
			positionBefore,
			positionAfter!,
			modeNum
		)
		sticksAfterHelp = normalizeGroupIdsAfterTurn(sticksAfterHelp)

		const remainingAfterHelp = sticksAfterHelp.filter(s => !s.isTaken).length
		const paramsAfterHelp = {
			...currentParamsForHelp,
			sticksCount: remainingAfterHelp,
			isEnemyStep: true,
		}
		const positionForOpponent = sticksToPosition(sticksAfterHelp)

		setIsHelping(false)

		if (
			!GameEngine.canAnyoneMove(positionForOpponent, paramsAfterHelp, modeNum)
		) {
			setSticksArr(sticksAfterHelp)
			setWinner('player')
			setIsTurnInProgress(false)
			return
		}

		setSticksArr(sticksAfterHelp)
		setGameParams(paramsAfterHelp)

		makeAiTurn(sticksAfterHelp, paramsAfterHelp)
	}, [
		sticksArr,
		isTurnInProgress,
		isEnemyStep,
		helpsCount,
		gameParams,
		modeNum,
		aiKnowledge,
		setGameParams,
		setIsHelping,
		setSticksArr,
		setWinner,
		makeAiTurn,
		ensureCache5,
	])

	useEffect(() => {
		if (sticksArr && sticksArr.length > 0 && !isMounted.current) {
			isMounted.current = true

			if (modeNum === 3 || modeNum === 4) {
				const min = modeNum === 3 ? 1 : gameParams.sticksRangeStreak![0]
				const max =
					modeNum === 3
						? gameParams.maxPerStepStreak!
						: gameParams.sticksRangeStreak![1]
				const knowledge = GameEngine.gGen(min, max, gameParams.sticksCount)
				setAiKnowledge(knowledge)
			}

			if (modeNum === 5 && !grundyValues && !cacheLoadingPromise) {
				cacheLoadingPromise = cacheService.loadFromServer()
				cacheLoadingPromise
					.then(cache => setGrundyValues(cache))
					.catch(_ => {
						cacheLoadingPromise = null
					})
			}

			if (isFirstComputerStep) {
				setReadyForAiFirstMove(true)
			}
		}
		return () => {
			if (isMounted.current) {
				cacheLoadingPromise = null
				isMounted.current = false
			}
		}
	}, [isFirstComputerStep, sticksArr?.length])

	useEffect(() => {
		if (isReadyForAiFirstMove && sticksArr) {
			if ((modeNum === 3 || modeNum === 4) && aiKnowledge.length === 0) {
				return
			}

			const initialParams = {
				...gameParams,
				isEnemyStep: true,
				isFirstComputerStep: false,
			}
			setGameParams(initialParams)
			makeAiTurn(sticksArr, initialParams)
			setReadyForAiFirstMove(false)
		}
	}, [
		isReadyForAiFirstMove,
		aiKnowledge,
		sticksArr,
		gameParams,
		setGameParams,
		makeAiTurn,
	])

	const resolvePromiseWithCache = (cache: Map<string, number>) => {
		if ((window as any).resolveCachePromise) {
			;(window as any).resolveCachePromise(cache)
			delete (window as any).resolveCachePromise
		}
	}

	const handleLoadCacheFromServer = useCallback(async () => {
		setCacheStatusMessage('Загрузка с сервера...')
		try {
			const cache = await cacheService.loadFromServer()
			setGrundyValues(cache)
			setCacheModalOpen(false)
			resolvePromiseWithCache(cache)
		} catch (error) {
			setCacheStatusMessage(
				`Ошибка: ${
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				}`
			)
		}
	}, [setGrundyValues])

	const handleLoadCacheFromFile = useCallback(
		async (file: File) => {
			setCacheStatusMessage('Чтение файла...')
			try {
				const cache = await cacheService.loadFromFile(file)
				setGrundyValues(cache)
				setCacheModalOpen(false)
				resolvePromiseWithCache(cache)
			} catch (error) {
				setCacheStatusMessage(
					`Ошибка: ${
						error instanceof Error ? error.message : 'Неизвестная ошибка'
					}`
				)
			}
		},
		[setGrundyValues]
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
			resolvePromiseWithCache(cache)
		} catch (error) {
			setCacheStatusMessage(
				`Ошибка: ${
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				}`
			)
		}
	}, [gameParams.sticksCount, setGrundyValues])

	return {
		gameParams,
		isDev,
		modeNum,
		isEnemyStep,
		isHelping,
		selectedSticksCount,
		handlePlayerTurn,
		handleHelpClick,
		isAiPreparing,
		isTurnInProgress,
		isCacheModalOpen,
		cacheCalcProgress,
		cacheStatusMessage,
		handleLoadCacheFromServer,
		handleLoadCacheFromFile,
		handleCalculateCache,
	}
}
