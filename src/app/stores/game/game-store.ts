import { atom } from 'jotai'
import type { IStick } from '../../../entities/sticks/model/interfaces/stick.interfaces'
import { setSticksArrToCookies } from './cookies/sicks-arr/set-sticks-arr-to-cookies'
import { getSticksArrFromCookies } from './cookies/sicks-arr/get-sticks-arr-from-cookies'
import { PREDEFINED_COLORS } from '../../consts/colors'
import type { IGameParams } from '../interfaces/game-params.interface'
import { getGameParamsFromCookies } from './cookies/game-params/get-game-params-from-cookies'
import { setGameParamsToCookies } from './cookies/game-params/set-game-params-to-cookies'

const sticksArrAtom = atom<IStick[] | undefined>(
	getSticksArrFromCookies() as IStick[] | undefined
)

export const sticksArrCookieAtom = atom(
	get => get(sticksArrAtom),

	(_, set, newSticks: IStick[] | undefined) => {
		setSticksArrToCookies(newSticks)
		set(sticksArrAtom, newSticks)
	}
)

const gameParamsAtom = atom<IGameParams>(
	getGameParamsFromCookies() as IGameParams
)

export const gameParamsCookieAtom = atom(
	get => get(gameParamsAtom),

	(_, set, newGameParams: IGameParams) => {
		
		setGameParamsToCookies(newGameParams)
		set(gameParamsAtom, newGameParams)
	}
)

export const tableAtom = atom({
	color: PREDEFINED_COLORS[0],
	skip: 0,
	take: 1,
})
