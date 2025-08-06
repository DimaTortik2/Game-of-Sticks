import { GAME_MODES } from '../../../app/consts/game-modes'
import type { IGameParams } from '../../../app/stores/interfaces/game-params.interface'

function mode1(k?: number) {
	const desc = GAME_MODES[0].description
	const kIndex = desc.indexOf('k')
	return desc.slice(0, kIndex - 1) + ' ' + k + ' ' + desc.slice(kIndex + 1)
}

function mode2(range?: number[]) {
	if (!range) return ' Ошибка !'
	const desc = GAME_MODES[1].description
	const aIndex = desc.indexOf('a')
	const bIndex = desc.indexOf('b')
	return (
		desc.slice(0, aIndex - 1) +
		' ' +
		range[0] +
		' ' +
		desc.slice(aIndex + 1, bIndex - 1) +
		' ' +
		range[1] +
		' ' +
		desc.slice(bIndex + 1)
	)
}

function mode3(k?: number) {
	const desc = GAME_MODES[2].description
	const kIndex = desc.indexOf('k')
	return desc.slice(0, kIndex - 1) + ' ' + k + ' ' + desc.slice(kIndex + 1)
}

function mode4(range?: number[]) {
	if (!range) return ' Ошибка !'
	const desc = GAME_MODES[3].description
	const aIndex = desc.indexOf('a')
	const bIndex = desc.indexOf('b')
	return (
		desc.slice(0, aIndex - 1) +
		' ' +
		range[0] +
		' ' +
		desc.slice(aIndex + 1, bIndex - 1) +
		' ' +
		range[1] +
		' ' +
		desc.slice(bIndex + 1)
	)
}

function mode5() {
	return GAME_MODES[4].description
}

export function nonValidClueText(
	params: Partial<IGameParams> & { modeNum: number }
) {
	if (
		!params.maxPerStep &&
		!params.maxPerStepStreak &&
		!params.modeNum &&
		!params.sticksRange &&
		!params.sticksRangeStreak
	)
		return 'Ошибка ошибки'

	switch (params.modeNum) {
		case 1:
			return mode1(params.maxPerStep)
		case 2:
			return mode2(params.sticksRange)
		case 3:
			return mode3(params.maxPerStepStreak)
		case 4:
			return mode4(params.sticksRangeStreak)
		case 5:
			return mode5()
	}
}
