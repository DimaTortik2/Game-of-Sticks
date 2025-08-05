// src/features/game/model/lib/move-validator.ts
import type { IStick } from '../../../../../entities/sticks'
import {
  codeSticksData,
	mode_1_2_check,
	mode_3_4_check,
	mode_5_check,
} from '../../../field'
type GameParamsForValidation = {
	maxPerStep?: number
	// ИЗМЕНЕНИЕ: Используем number[] вместо [number, number]
	sticksRange?: number[]
	maxPerStepStreak?: number
	// ИЗМЕНЕНИЕ: Используем number[] вместо [number, number]
	sticksRangeStreak?: number[]
}

export const validatePlayerMove = (
	sticksArr: IStick[],
	gameParams: GameParamsForValidation,
	modeNum: number
): boolean => {
	const sticksBeforePlayerMove = sticksArr.filter(s => !s.isTaken)
	const tempAfterPlayerMove = sticksArr.map(stick =>
		stick.isSelected ? { ...stick, isTaken: true } : stick
	)

	const nowCoded = codeSticksData(sticksBeforePlayerMove)
	const afterCoded = codeSticksData(tempAfterPlayerMove)

	switch (modeNum) {
		case 1:
			return gameParams.maxPerStep
				? mode_1_2_check(nowCoded, afterCoded, 1, gameParams.maxPerStep)
				: false
		case 2:
			// Проверяем, что в массиве есть два элемента перед использованием
			return gameParams.sticksRange && gameParams.sticksRange.length === 2
				? mode_1_2_check(
						nowCoded,
						afterCoded,
						gameParams.sticksRange[0],
						gameParams.sticksRange[1]
				  )
				: false
		case 3:
			return gameParams.maxPerStepStreak
				? mode_3_4_check(nowCoded, afterCoded, 1, gameParams.maxPerStepStreak)
				: false
		case 4:
			// Проверяем, что в массиве есть два элемента перед использованием
			return gameParams.sticksRangeStreak &&
				gameParams.sticksRangeStreak.length === 2
				? mode_3_4_check(
						nowCoded,
						afterCoded,
						gameParams.sticksRangeStreak[0],
						gameParams.sticksRangeStreak[1]
				  )
				: false
		case 5:
			return mode_5_check(nowCoded, afterCoded)
		default:
			console.error(`Неизвестный режим игры: ${modeNum}`)
			return false
	}
}