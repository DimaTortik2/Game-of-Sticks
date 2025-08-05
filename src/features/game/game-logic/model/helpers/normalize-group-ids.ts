import type { IStick } from "../../../../../entities/sticks/model/interfaces/stick.interfaces"

/**
 * После каждого хода анализирует оставшиеся палочки
 * и переназначает им groupId, чтобы они всегда шли по порядку (0, 1, 2...).
 */
export const normalizeGroupIdsAfterTurn = (sticks: IStick[]): IStick[] => {
	const availableSticks = sticks
		.filter(s => !s.isTaken)
		.sort((a, b) => a.id - b.id)

	if (availableSticks.length === 0) {
		return sticks
	}

	const newAssignments = new Map<number, number>()
	let currentGroupId = 0
	let lastStickId = -1

	for (const stick of availableSticks) {
		if (lastStickId !== -1 && stick.id !== lastStickId + 1) {
			currentGroupId++
		}
		newAssignments.set(stick.id, currentGroupId)
		lastStickId = stick.id
	}

	return sticks.map(stick => {
		if (newAssignments.has(stick.id)) {
			return { ...stick, groupId: newAssignments.get(stick.id)! }
		}
		return stick
	})
}
