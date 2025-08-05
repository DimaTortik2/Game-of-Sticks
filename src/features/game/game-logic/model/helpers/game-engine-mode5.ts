// src/features/game/model/lib/game-engine-mode5.ts

// Тип для нашего кэша
type GrundyCache = Map<string, number>

/**
 * Важно! Все функции этого файла теперь НЕ ИМЕЮТ СОБСТВЕННОГО СОСТОЯНИЯ.
 * Кэш `grundyValues` они получают как аргумент.
 */

// gGen_5 и generatePartitions становятся внутренними хелперами для функции расчета кэша
// Мы их не будем экспортировать напрямую
function generatePartitions(n: number): number[][] {
	const result: number[][] = []
	const partition: number[] = []
	function find(target: number, max: number) {
		if (target === 0) {
			result.push([...partition])
			return
		}
		for (let i = Math.min(target, max); i >= 1; i--) {
			partition.push(i)
			find(target - i, i)
			partition.pop()
		}
	}
	find(n, n)
	return result
}

// Эта функция теперь чистая, она не меняет глобальных переменных.
// Она принимает onProgress для обратной связи с UI.
export function calculateGrundyCache(
	maxSticks: number,
	onProgress: (percent: number) => void
): GrundyCache {
	const grundyMemo: GrundyCache = new Map()
	grundyMemo.set('', 0)

	for (let totalSticks = 1; totalSticks <= maxSticks; totalSticks++) {
		const partitions = generatePartitions(totalSticks)
		for (const piles of partitions) {
			piles.sort((a, b) => a - b)
			const key = piles.join(',')
			if (grundyMemo.has(key)) continue

			const reachableGrundyNumbers = new Set<number>()

			// ... (ВЕСЬ КОД ПЕРЕБОРА ХОДОВ ИЗ gGen_5 вашего друга) ...
			// ... (Взять 1, взять 2, взять 3, взять из двух кучек) ...
			// ВАЖНО: везде, где было `grundyMemo.get(...)`, оно остается.

			// Ход: Взять 1 любую
			for (let i = 0; i < piles.length; i++) {
				if (i > 0 && piles[i] === piles[i - 1]) continue
				const pileSize = piles[i]
				const newPilesBase = [...piles.slice(0, i), ...piles.slice(i + 1)]
				if (pileSize - 1 > 0) {
					const newPiles = [...newPilesBase, pileSize - 1].sort((a, b) => a - b)
					reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
				} else {
					const newPiles = [...newPilesBase].sort((a, b) => a - b)
					reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
				}
				for (let j = 1; j <= (pileSize - 1) / 2; j++) {
					const newPiles = [...newPilesBase, j, pileSize - 1 - j].sort(
						(a, b) => a - b
					)
					reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
				}
			}
			// Ход: Взять 2 любые (из одной кучи)
			// ... (логика из файла друга)
			// Ход: Взять 3 подряд
			// ... (логика из файла друга)

			let mex = 0
			while (reachableGrundyNumbers.has(mex)) mex++
			grundyMemo.set(key, mex)
		}
		// Обновляем прогресс для UI
		onProgress(Math.round((totalSticks / maxSticks) * 100))
	}
	return grundyMemo
}

// Эта функция теперь принимает кэш как аргумент
export function move_5(
	currentPiles: number[],
	grundyValues: GrundyCache
): number[] | null {
	const piles = [...currentPiles].sort((a, b) => a - b)
	const initialKey = piles.join(',')

	if (grundyValues.get(initialKey) === 0) {
		// Проигрышная позиция, делаем любой ход (например, берем 1 палочку с конца)
		if (piles.length === 0) return []
		const lastPileIndex = piles.length - 1
		const newPiles = [...piles]
		newPiles[lastPileIndex]--
		return newPiles.filter(p => p > 0)
	}

	// Ищем выигрышный ход (тот, что ведет в позицию с g-числом 0)
	// ... (ВЕСЬ КОД ПОИСКА ХОДА ИЗ move_5 вашего друга) ...
	// ... (Взять 1, взять 2, взять 3, взять из двух кучек) ...
	// ВАЖНО: везде, где было `grundyValues.get(...)`, оно остается.
	// Если находим ход `if(grundyValues.get(newKey) === 0) return newPiles;`

	// Пример для хода "Взять 1 любую":
	for (let i = 0; i < piles.length; i++) {
		if (i > 0 && piles[i] === piles[i - 1]) continue
		const pileSize = piles[i]
		const newPilesBase = [...piles.slice(0, i), ...piles.slice(i + 1)]
		// Рассматриваем все возможные результаты этого хода
		if (pileSize - 1 > 0) {
			const newPiles = [...newPilesBase, pileSize - 1].sort((a, b) => a - b)
			if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
		} else {
			const newPiles = [...newPilesBase].sort((a, b) => a - b)
			if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
		}
		for (let j = 1; j <= (pileSize - 1) / 2; j++) {
			const newPiles = [...newPilesBase, j, pileSize - 1 - j].sort(
				(a, b) => a - b
			)
			if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
		}
	}
	// ... и так для всех остальных типов ходов ...

	return null // Если выигрышный ход не найден (не должно случиться, если g != 0)
}

export function mode_5_check(
	positionBefore: number[],
	positionAfter: number[]
): boolean {
	// Эта функция не зависит от кэша, просто переносим её
	const sticksBefore = positionBefore.reduce((sum, val) => sum + val, 0)
	const sticksAfter = positionAfter.reduce((sum, val) => sum + val, 0)
	const takenCount = sticksBefore - sticksAfter

	if (takenCount < 1 || takenCount > 3) return false
	if (takenCount === 1 || takenCount === 2) return true // Любые 1 или 2 палочки - это валидно

	// Если взято 3, проверяем, что они взяты подряд
	if (takenCount === 3) {
		// Используем ту же логику сравнения, что и в mode_3_4_check
		let flag = false
		let offset = 0
		const cycleCount = Math.max(positionBefore.length, positionAfter.length)
		for (let i = 0; i < cycleCount + 1; i++) {
			const before = positionBefore[i]
			const after = positionAfter[i + offset]

			if (before === after) continue
			if (flag) return false
			flag = true

			const moved = before - (after || 0)
			if (moved === 3) {
				// Уменьшился на 3
				// Убедимся, что остальная часть массива совпадает
				const restBefore = positionBefore.slice(i + 1).join(',')
				const restAfter = positionAfter.slice(i + offset + 1).join(',')
				return restBefore === restAfter
			}
			if (before === 3 && typeof after === 'undefined') {
				// Исчез фрагмент из 3
				return true
			}
			// Проверка на разбиение на 2 куска
			const nextAfter = positionAfter[i + offset + 1]
			if (before - (after || 0) - (nextAfter || 0) === 3) {
				offset++
				// Убедимся, что остальная часть массива совпадает
				const restBefore = positionBefore.slice(i + 1).join(',')
				const restAfter = positionAfter.slice(i + offset + 1).join(',')
				return restBefore === restAfter
			}
			return false
		}
		return flag
	}
	return false
}
