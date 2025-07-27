import { atom, createStore } from 'jotai'

export const gameStore = createStore()

export const selectedSticksIdsAtom = atom(new Set<string | number>())

gameStore.set(selectedSticksIdsAtom, new Set())
