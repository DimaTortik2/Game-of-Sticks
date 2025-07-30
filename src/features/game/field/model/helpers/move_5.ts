export function move_5(now: number[]) {
	console.log('Ход ИИ. Доска до:', { now })

	// 1. Создаем копию массива, чтобы не изменять оригинал
	const newPosition = [...now]

	// 2. Проверяем, есть ли вообще палочки на доске
	if (newPosition.length === 0) {
		console.error('ИИ пытался ходить на пустой доске.')
		return []
	}

	// 3. Получаем последний элемент (последнюю группу палочек)
	const lastGroupIndex = newPosition.length - 1
	const lastGroupCount = newPosition[lastGroupIndex]

	// 4. ИИ берет 1 палочку (согласно вашей логике e - 1)
	const sticksToTake = 1

	// 5. Проверяем, можем ли мы вообще взять палочку
	if (lastGroupCount < sticksToTake) {
		console.error(
			'Ошибка логики ИИ: попытка взять больше палочек, чем есть в группе.'
		)
		return now // Возвращаем исходное состояние, чтобы игра не сломалась
	}

	// 6. Уменьшаем количество палочек в последней группе
	newPosition[lastGroupIndex] = lastGroupCount - sticksToTake

	console.log('Ход ИИ. Доска после:', newPosition)

	// 7. Возвращаем новый массив, отфильтровав группы, в которых не осталось палочек
	return newPosition.filter(count => count > 0)
}
