import type { IStick } from '../../../../../entities/sticks/model/interfaces/stick.interfaces'

/**
 * ФИНАЛЬНАЯ, ИСПРАВЛЕННАЯ ВЕРСИЯ.
 * Эта функция теперь работает с полным массивом палочек,
 * используя isTaken как разделитель для создания групп.
 */
export const normalizeGroupIdsAfterTurn = (sticks: IStick[]): IStick[] => {
	if (!sticks || sticks.length === 0) {
		return []
	}

	// 1. Работаем с копией, отсортированной по ID, чтобы гарантировать порядок
	const sortedSticks = [...sticks].sort((a, b) => a.id - b.id)
	const resultSticks: IStick[] = []

	let currentGroupId = -1 // Начнем с -1, чтобы первая же доступная палочка начала группу 0
	let isFirstAvailableStick = true

	// 2. Итерируемся по ВСЕМ палочкам, включая взятые
	for (let i = 0; i < sortedSticks.length; i++) {
		const currentStick = sortedSticks[i]

		// Если палочка взята, ее groupId нас не волнует, просто добавляем ее
		if (currentStick.isTaken) {
			resultSticks.push({ ...currentStick, groupId: -1 }) // Присваиваем -1 для ясности
			continue
		}

		// Если палочка доступна:
		// a) Это самая первая доступная палочка в массиве? Начинаем группу 0.
		if (isFirstAvailableStick) {
			currentGroupId = 0
			isFirstAvailableStick = false
		}
		// b) Предыдущая палочка была взята? Это стена, начинаем новую группу.
		else if (i > 0 && sortedSticks[i - 1].isTaken) {
			currentGroupId++
		}

		// Присваиваем палочке ее правильный groupId
		resultSticks.push({ ...currentStick, groupId: currentGroupId })
	}

	// 3. Возвращаем результат в том же порядке, что и исходный массив
	const idToStickMap = new Map(resultSticks.map(s => [s.id, s]))
	return sticks.map(originalStick => idToStickMap.get(originalStick.id)!)
}
