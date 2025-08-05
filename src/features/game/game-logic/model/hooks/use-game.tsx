import { useAtom, useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

// --- Jotai State ---

// --- ИНТЕГРАЦИЯ: Импорт настоящей игровой логики ---
import * as GameEngine from '../helpers/game-engine'
import * as GameEngineMode5 from '../helpers/game-engine-mode5'
import { cacheService } from '../../../../cahce/api/services/cache.service'
import { getGameModeDataFromCookies } from '../../../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies'
import { gameParamsCookieAtom, sticksArrCookieAtom, isHelpingAtom, winnerAtomCookieAtom, grundyValuesAtom } from '../../../../../app/stores/game/game-store'
import type { IGameParams } from '../../../../../app/stores/interfaces/game-params.interface'
import type { IStick } from '../../../../../entities/sticks'
import { NotValidToast } from '../../../table/ui/not-valid-toast'

// --- Вспомогательные функции-переводчики ---

/**
 * Переводит состояние из массива объектов IStick в простой массив чисел,
 * понятный для игровой логики (например, [[stick, stick], [stick]] -> [2, 1]).
 */
const sticksToPosition = (sticks: IStick[]): number[] => {
	if (!sticks || sticks.length === 0) return []

	const availableSticks = sticks.filter(s => !s.isTaken)
	if (availableSticks.length === 0) return []

	const groups = new Map<number, number>()
	availableSticks.forEach(stick => {
		groups.set(stick.groupId, (groups.get(stick.groupId) || 0) + 1)
	})

	return Array.from(groups.values())
}

/**
 * Переводит простой массив чисел обратно в массив объектов IStick.
 * Создает совершенно новый массив палочек.
 */
const positionToSticks = (position: number[]): IStick[] => {
	const newSticks: IStick[] = []
	let stickIdCounter = 0
	position.forEach((groupCount, groupIndex) => {
		for (let i = 0; i < groupCount; i++) {
			newSticks.push({
				id: stickIdCounter++,
				isTaken: false,
				isSelected: false,
				groupId: groupIndex,
			})
		}
	})
	return newSticks
}

export const useGame = () => {
	// --- STATE & PARAMS ---
	const [gameParams, setGameParams] = useAtom(gameParamsCookieAtom)
	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)
	const [isHelping, setIsHelping] = useAtom(isHelpingAtom)
	const setWinner = useSetAtom(winnerAtomCookieAtom)
	const [grundyValues, setGrundyValues] = useAtom(grundyValuesAtom) // Состояние для кэша

	// Состояние для управления UI модального окна кэша
	const [isCacheModalOpen, setCacheModalOpen] = useState(false)
	const [cacheCalcProgress, setCacheCalcProgress] = useState(0)
	const [cacheStatusMessage, setCacheStatusMessage] = useState('')

	const { modeNum } = getGameModeDataFromCookies()
	const isDev = Cookies.get('devMode') === 'true'
	const { isEnemyStep, isFirstComputerStep, helpsCount, sticksCount } =
		gameParams
	const selectedSticksCount =
		sticksArr?.filter(stick => stick.isSelected && !stick.isTaken).length || 0

	// --- NOTIFICATIONS ---
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

	// --- CORE GAME LOGIC ---

	const makeAiTurn = useCallback(
		async (currentSticks: IStick[], currentParams: IGameParams) => {
			const currentPosition = sticksToPosition(currentSticks)
			let newPosition: number[] | null = null

			switch (modeNum) {
				case 1:
					newPosition = GameEngine.move_1_2(
						currentPosition,
						1,
						currentParams.maxPerStep!
					)
					break
				case 2:
					newPosition = GameEngine.move_1_2(
						currentPosition,
						currentParams.sticksRange![0],
						currentParams.sticksRange![1]
					)
					break
				case 3:
					newPosition = GameEngine.move_3_4(
						currentPosition,
						1,
						currentParams.maxPerStepStreak!
					)
					break
				case 4:
					newPosition = GameEngine.move_3_4(
						currentPosition,
						currentParams.sticksRangeStreak![0],
						currentParams.sticksRangeStreak![1]
					)
					break
				case 5:
					if (!grundyValues) {
						if (currentParams.sticksCount > 30) {
							setCacheModalOpen(true)
							return // Прерываем ход, ждем действий пользователя в модалке
						}
						// Для малого кол-ва палочек считаем "на лету" без прогресс-бара
						const smallCache = GameEngineMode5.calculateGrundyCache(
							currentParams.sticksCount,
							() => {}
						)
						setGrundyValues(smallCache)
						newPosition = GameEngineMode5.move_5(currentPosition, smallCache)
					} else {
						newPosition = GameEngineMode5.move_5(currentPosition, grundyValues)
					}
					break
			}

			if (newPosition === null) {
				console.error('AI не смог сделать ход. Проверьте логику.')
				setGameParams({ ...currentParams, isEnemyStep: false }) // Отдаем ход игроку
				return
			}

			const newSticks = positionToSticks(newPosition)
			const remainingCount = newSticks.length

			if (remainingCount === 0) {
				setSticksArr(newSticks)
				setWinner('enemy') // Противник сделал последний ход и проиграл
				return
			}

			setSticksArr(newSticks)
			setGameParams({
				...currentParams,
				sticksCount: remainingCount,
				isEnemyStep: false,
			})
		},
		[
			modeNum,
			gameParams,
			grundyValues,
			setGameParams,
			setSticksArr,
			setWinner,
			setGrundyValues,
		]
	)

	const handlePlayerTurn = useCallback(() => {
		if (!sticksArr || isEnemyStep || selectedSticksCount === 0) return

		const positionBefore = sticksToPosition(sticksArr)
		const tempSticksAfter = sticksArr.map(stick =>
			stick.isSelected ? { ...stick, isTaken: true } : stick
		)
		const positionAfter = sticksToPosition(tempSticksAfter)

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
			// Сбрасываем выделение
			setSticksArr(sticksArr.map(s => ({ ...s, isSelected: false })))
			return
		}

		const newSticks = positionToSticks(positionAfter)
		const remainingAfterPlayer = newSticks.length

		if (remainingAfterPlayer === 0) {
			setSticksArr(newSticks)
			setWinner('player') // Игрок сделал последний ход и проиграл
			return
		}

		const newParams = {
			...gameParams,
			sticksCount: remainingAfterPlayer,
			isEnemyStep: true,
		}
		setSticksArr(newSticks)
		setGameParams(newParams)

		setTimeout(() => makeAiTurn(newSticks, newParams), 1500)
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

const handleHelpClick = useCallback(() => {
	// 1. Проверяем, можно ли использовать подсказку
	if (
		!sticksArr ||
		isEnemyStep ||
		(helpsCount !== undefined && helpsCount <= 0)
	) {
		return
	}

	// 2. Обновляем UI и состояние: показываем, что "думаем", и уменьшаем счетчик
	setIsHelping(true)
	const newHelpsCount = (helpsCount || 0) - 1
	// Сразу обновляем gameParams, чтобы в расчетах использовалось актуальное число подсказок
	const currentParamsForHelp = { ...gameParams, helpsCount: newHelpsCount }
	setGameParams(currentParamsForHelp)

	// 3. Вычисляем оптимальный ход для текущей позиции игрока
	const currentPosition = sticksToPosition(sticksArr)
	let optimalNextPosition: number[] | null = null

	switch (modeNum) {
		case 1:
			optimalNextPosition = GameEngine.move_1_2(
				currentPosition,
				1,
				currentParamsForHelp.maxPerStep!
			)
			break
		case 2:
			optimalNextPosition = GameEngine.move_1_2(
				currentPosition,
				currentParamsForHelp.sticksRange![0],
				currentParamsForHelp.sticksRange![1]
			)
			break
		case 3:
			optimalNextPosition = GameEngine.move_3_4(
				currentPosition,
				1,
				currentParamsForHelp.maxPerStepStreak!
			)
			break
		case 4:
			optimalNextPosition = GameEngine.move_3_4(
				currentPosition,
				currentParamsForHelp.sticksRangeStreak![0],
				currentParamsForHelp.sticksRangeStreak![1]
			)
			break
		case 5:
			// Проверяем наличие кэша, как и при ходе ИИ
			if (!grundyValues) {
				if (currentParamsForHelp.sticksCount > 30) {
					// Если кэш нужен, но его нет, отменяем подсказку и открываем модалку
					setCacheModalOpen(true)
					setIsHelping(false) // Отменяем состояние "думаем"
					setGameParams(gameParams) // Возвращаем старое число подсказок
					return // Прерываем выполнение
				}
				// Для малого числа палочек считаем на лету
				const smallCache = GameEngineMode5.calculateGrundyCache(
					currentParamsForHelp.sticksCount,
					() => {}
				)
				optimalNextPosition = GameEngineMode5.move_5(
					currentPosition,
					smallCache
				)
			} else {
				optimalNextPosition = GameEngineMode5.move_5(
					currentPosition,
					grundyValues
				)
			}
			break
	}

	if (optimalNextPosition === null) {
		console.error('Подсказка не смогла рассчитать ход.')
		setIsHelping(false) // Сбрасываем UI
		setGameParams(gameParams) // Возвращаем счетчик
		return
	}

	// 4. Через небольшую задержку (для эффекта "раздумий") делаем ход за игрока
	setTimeout(() => {
		const sticksAfterHelp = positionToSticks(optimalNextPosition!)
		const remainingAfterHelp = sticksAfterHelp.length

		// 5. Проверяем, не закончилась ли игра этим ходом
		if (remainingAfterHelp === 0) {
			setSticksArr(sticksAfterHelp)
			setWinner('player') // Игрок использовал подсказку, чтобы проиграть
			setIsHelping(false)
			return
		}

		// 6. Обновляем доску и передаем ход компьютеру
		const paramsAfterHelp = {
			...currentParamsForHelp,
			sticksCount: remainingAfterHelp,
			isEnemyStep: true,
		}
		setSticksArr(sticksAfterHelp)
		setGameParams(paramsAfterHelp)
		setIsHelping(false) // Завершаем состояние "помощи"

		// 7. Вызываем ответный ход ИИ
		setTimeout(() => {
			makeAiTurn(sticksAfterHelp, paramsAfterHelp)
		}, 1500)
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
	setCacheModalOpen, // Добавлена зависимость
])

	// --- SIDE EFFECTS (First computer move) ---
	useEffect(() => {
		if (sticksArr && sticksArr.length > 0 && isFirstComputerStep) {
			const initialParams = {
				...gameParams,
				isEnemyStep: true,
				isFirstComputerStep: false,
			}
			setGameParams(initialParams)
			// Запускаем ход ИИ с начальными параметрами
			setTimeout(() => makeAiTurn(sticksArr, initialParams), 1000)
		}
	}, [isFirstComputerStep, sticksArr, gameParams, setGameParams, makeAiTurn])

	// --- CACHE MODAL HANDLERS ---
	const handleLoadCacheFromServer = useCallback(async () => {
		setCacheStatusMessage('Загрузка с сервера...')
		try {
			const cache = await cacheService.loadFromServer()
			setGrundyValues(cache)
			setCacheModalOpen(false)
			// После успешной загрузки, автоматически повторяем ход ИИ
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
		setCacheCalcProgress(0) // Сбрасываем прогресс-бар
		try {
			const cache = await cacheService.calculate(sticksCount, percent => {
				setCacheCalcProgress(percent)
			})
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
	}, [sticksCount, sticksArr, gameParams, setGrundyValues, makeAiTurn])

	// --- API для UI ---
	return {
		gameParams,
		isDev,
		modeNum,
		isEnemyStep,
		isHelping,
		selectedSticksCount,
		handlePlayerTurn,
		handleHelpClick,
		// Новые пропсы для модального окна
		isCacheModalOpen,
		cacheCalcProgress,
		cacheStatusMessage,
		handleLoadCacheFromServer,
		handleLoadCacheFromFile,
		handleCalculateCache,
	}
}
