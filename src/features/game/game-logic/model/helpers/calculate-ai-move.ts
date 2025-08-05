// src/features/game/model/lib/ai-calculator.ts

import type { IStick } from "../../../../../entities/sticks/model/interfaces/stick.interfaces"
import { codeSticksData, move_1_2, move_3_4, move_5 } from '../../../field'

// Тип для параметров игры, чтобы не импортировать весь атом
type GameParamsForAI = {
	maxPerStep?: number
	// ИЗМЕНЕНИЕ: Используем number[]
	sticksRange?: number[]
	maxPerStepStreak?: number
	// ИЗМЕНЕНИЕ: Используем number[]
	sticksRangeStreak?: number[]
	// ИЗМЕНЕНИЕ: Добавлено недостающее поле
	helpsCount?: number
}

export const calculateAiMove = (
	currentSticks: IStick[],
	currentParams: GameParamsForAI,
	modeNum: number
): IStick[] | null => {
	const availableSticks = currentSticks.filter(stick => !stick.isTaken)
	if (availableSticks.length === 0) return currentSticks

	const currentCoded = codeSticksData(availableSticks)
	let aiMoveFunction: ((pos: number[]) => number[]) | null = null

	switch (modeNum) {
		case 1:
			if (currentParams.maxPerStep)
				aiMoveFunction = pos => move_1_2(pos, 1, currentParams.maxPerStep!)
			break
		case 2:
			if (currentParams.sticksRange)
				aiMoveFunction = pos =>
					move_1_2(
						pos,
						currentParams.sticksRange![0],
						currentParams.sticksRange![1]
					)
			break
		case 3:
			if (currentParams.maxPerStepStreak)
				aiMoveFunction = pos =>
					move_3_4(pos, 1, currentParams.maxPerStepStreak!)
			break
		case 4:
			if (currentParams.sticksRangeStreak)
				aiMoveFunction = pos =>
					move_3_4(
						pos,
						currentParams.sticksRangeStreak![0],
						currentParams.sticksRangeStreak![1]
					)
			break
		case 5:
			aiMoveFunction = move_5
			break
	}

	if (!aiMoveFunction) {
		console.error('Не удалось определить функцию хода ИИ.')
		return null
	}

	const aiFinalPositionCoded = aiMoveFunction(currentCoded)
	const countBeforeAI = currentCoded.reduce((a, b) => a + b, 0)
	const countAfterAI = aiFinalPositionCoded.reduce((a, b) => a + b, 0)
	const sticksTakenByAI = countBeforeAI - countAfterAI

	if (sticksTakenByAI <= 0) {
		console.log('ИИ не сделал ход.')
		// Возвращаем копию, чтобы избежать мутаций и сбросить isSelected
		return currentSticks.map(s => ({ ...s, isSelected: false }))
	}

	const sticksToSelectIds = new Set(
		availableSticks.slice(-sticksTakenByAI).map(s => s.id)
	)

	return currentSticks.map(stick => ({
		...stick,
		isSelected: sticksToSelectIds.has(stick.id),
	}))
}
