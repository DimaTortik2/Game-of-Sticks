import type { IStick } from '../../../../../entities/sticks/model/interfaces/stick.interfaces'

export function myStep(data?: IStick[]): IStick[] {
	// 0. Обрабатываем крайний случай, если данных нет
	if (!data || data.length === 0) {
		return []
	}

	// 1. Убираем выделенные палочки, как и раньше
	const remainingSticks = data.filter(el => !el.isSelected)

	// Если после удаления ничего не осталось, возвращаем пустой массив
	if (remainingSticks.length === 0) {
		return []
	}

	// Массив, в который мы будем складывать результат
	const regroupedSticks: IStick[] = []
	// Начинаем с первой группы (ID = 0)
	let currentGroupId = 0

	// 2. Обрабатываем самую первую оставшуюся палочку.
	// Она всегда начинает первую группу (groupId: 0).
	// Мы создаем новый объект, чтобы не мутировать старый (хорошая практика).
	regroupedSticks.push({
		...remainingSticks[0], // Копируем все свойства
		groupId: currentGroupId, // Устанавливаем groupId
	})

	// 3. Проходим по всем остальным палочкам, начиная со второй (индекс 1)
	for (let i = 1; i < remainingSticks.length; i++) {
		const previousStick = remainingSticks[i - 1]
		const currentStick = remainingSticks[i]

		// 4. ГЛАВНАЯ ЛОГИКА: Проверяем, есть ли "разрыв" в оригинальных ID.
		// Если ID текущей палочки не равен (ID предыдущей + 1),
		// значит, между ними была удалена как минимум одна палочка.
		// Это признак начала НОВОЙ ГРУППЫ.
		if (currentStick.id !== previousStick.id + 1) {
			currentGroupId++ // Увеличиваем счетчик групп
		}

		// 5. Добавляем текущую палочку в результат с ее новым (или старым) groupId.
		// Также сбрасываем isSelected, так как этих палочек мы не касались.
		regroupedSticks.push({
			...currentStick,
			groupId: currentGroupId,
			isSelected: false, // На всякий случай сбрасываем флаг
		})
	}

	return regroupedSticks
}
