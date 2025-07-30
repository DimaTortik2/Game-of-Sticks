import type { IStick } from '../../../../../entities/sticks/model/interfaces/stick.interfaces'
export type RenderableStick = IStick & { isInvisible?: boolean }

export function addSeparatorsToSticks(sticks: IStick[]): RenderableStick[] {
	if (sticks.length < 2) {
		return sticks
	}

	const sticksWithSeparators: RenderableStick[] = []
	let separatorIndex = 0 // Для уникальных ID разделителей

	for (let i = 0; i < sticks.length; i++) {
		const currentStick = sticks[i]
		sticksWithSeparators.push(currentStick)

		const nextStick = sticks[i + 1]
		if (nextStick && currentStick.groupId !== nextStick.groupId) {
			sticksWithSeparators.push({
				// ✅ ID теперь отрицательное число, чтобы не пересекаться с реальными
				// и соответствовать типу number.
				id: -1 - separatorIndex++,
				groupId: -1,
				isSelected: false,
				isInvisible: true,
			})
		}
	}

	return sticksWithSeparators
}
