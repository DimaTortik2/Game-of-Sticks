import { useAtom, useSetAtom } from "jotai"
import { useCallback, useEffect } from "react"
import { toast } from "react-toastify"
import { getGameModeDataFromCookies } from "../../../../../app/stores/game/cookies/game-mode/get-game-mode-data-from-cookies"
import { gameParamsCookieAtom, sticksArrCookieAtom, isHelpingAtom, winnerAtomCookieAtom } from "../../../../../app/stores/game/game-store"
import type { IStick } from "../../../../../entities/sticks"
import { NotValidToast } from "../../../table/ui/not-valid-toast"
import { calculateAiMove } from "../helpers/calculate-ai-move"
import { normalizeGroupIdsAfterTurn } from "../helpers/normalize-group-ids"
import { validatePlayerMove } from "../helpers/validate-player-move"

import Cookies from 'js-cookie'
import type { IGameParams } from "../../../../../app/stores/interfaces/game-params.interface"

export const useGame = () => {
	// --- STATE & PARAMS ---
	const [gameParams, setGameParams] = useAtom(gameParamsCookieAtom)
	const [sticksArr, setSticksArr] = useAtom(sticksArrCookieAtom)
	const [isHelping, setIsHelping] = useAtom(isHelpingAtom)
	const setWinner = useSetAtom(winnerAtomCookieAtom)

	const { modeNum } = getGameModeDataFromCookies()
	const isDev = Cookies.get('devMode') === 'true'
	const { isEnemyStep, isFirstComputerStep, helpsCount } = gameParams
	const selectedSticksCount =
		sticksArr?.filter(stick => stick.isSelected && !stick.isTaken).length || 0

	// --- NOTIFICATIONS (бывший handleNottValid) ---
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

	// --- CORE LOGIC ---

	const makeAiTurn = useCallback(
		(currentSticks: IStick[], currentParams: IGameParams) => {
			const sticksWithAiSelection = calculateAiMove(
				currentSticks,
				currentParams,
				modeNum
			)
			if (!sticksWithAiSelection) {
				setGameParams({ ...currentParams, isEnemyStep: false })
				return
			}

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
				...currentParams,
				sticksCount: remainingCount,
				isEnemyStep: false,
			})
		},
		[modeNum, setGameParams, setSticksArr, setWinner]
	)

	// Переименованный mainlogic
	const handlePlayerTurn = useCallback(() => {
		if (!sticksArr || isEnemyStep || selectedSticksCount === 0) return

		if (!validatePlayerMove(sticksArr, gameParams, modeNum)) {
			showNotValidMoveToast()
			setSticksArr(sticksArr.map(s => ({ ...s, isSelected: false })))
			return
		}

		let afterPlayerMove = sticksArr.map(stick =>
			stick.isSelected ? { ...stick, isTaken: true, isSelected: false } : stick
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

		setTimeout(() => makeAiTurn(afterPlayerMove, newParams), 1000)
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

	// Ваш handleHelpClick
	const handleHelpClick = useCallback(() => {
		if (
			!sticksArr ||
			isEnemyStep ||
			(helpsCount !== undefined && helpsCount <= 0)
		)
			return

		setSticksArr(sticksArr.map(stick => ({ ...stick, isSelected: false })))
		setIsHelping(true)
		const newHelpsCount = (helpsCount || 0) - 1
		setGameParams({ ...gameParams, helpsCount: newHelpsCount })

		setTimeout(() => {
			if (!sticksArr) return

			const sticksWithHelpSelection = calculateAiMove(
				sticksArr,
				{ ...gameParams, helpsCount: newHelpsCount },
				modeNum
			)
			if (!sticksWithHelpSelection) {
				setIsHelping(false)
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
				setWinner('player')
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

			setTimeout(() => makeAiTurn(afterHelpMove, paramsAfterHelp), 1500)
		}, 1000)
	}, [
		sticksArr,
		isEnemyStep,
		helpsCount,
		gameParams,
		modeNum,
		setIsHelping,
		setGameParams,
		setSticksArr,
		setWinner,
		makeAiTurn,
	])

	// --- SIDE EFFECTS ---
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

	// --- API для UI ---
	return {
		gameParams,
		isDev,
		modeNum,
		isEnemyStep,
		isHelping,
		selectedSticksCount,
		handlePlayerTurn, // бывший mainlogic
		handleHelpClick, // ваш handleHelpClick
	}
}