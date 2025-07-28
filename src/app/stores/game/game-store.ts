import { atom, createStore } from 'jotai'
import { PREDEFINED_COLORS } from '../../../features/game/table/model/consts/colors'
import type { IStick } from '../../../entities/sticks/model/interfaces/stick.interfaces'
import { setSticksArrToCookies } from './cookies/sicks-arr/set-sticks-arr-to-cookies'
import { getSticksArrFromCookies } from './cookies/sicks-arr/get-sticks-arr-from-cookies'

export const gameStore = createStore()

const sticksArrAtom = atom<IStick[] | undefined>()

export const sticksArrCookieAtom = atom(
	get => {
		if (get(sticksArrAtom) === undefined) {
			return getSticksArrFromCookies() //если няма в атоме, то возьмем из кук
		} else {
			return get(sticksArrAtom)
		}
	},
	(_, set, newSticks: IStick[] | undefined) => {
		setSticksArrToCookies(newSticks) // еще и в куки писанем
		set(sticksArrAtom, newSticks)
	}
)

export const tableAtom = atom({
	color: PREDEFINED_COLORS[0],
	skip: 0,
	take: 1,
})

gameStore.set(tableAtom, {
	color: PREDEFINED_COLORS[0],
	skip: 0,
	take: 1,
})

gameStore.set(sticksArrCookieAtom, undefined)
