import { atom, createStore } from 'jotai'
import { PREDEFINED_COLORS } from '../../../features/game/table/model/consts/colors'

export const gameStore = createStore()

export const selectedSticksIdsAtom = atom(new Set<string | number>())
export const tableAtom = atom({
	color: PREDEFINED_COLORS[0],
	skip: 0,
	take: 1,
})

gameStore.set(selectedSticksIdsAtom, new Set())
gameStore.set(tableAtom, {
	color: PREDEFINED_COLORS[0],
	skip: 0,
	take: 1,
})
