// Тип для нашего кэша
type GrundyCache = Map<string, number>

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

			// === НАЧАЛО ПОЛНОЙ ЛОГИКИ ПЕРЕБОРА ХОДОВ ===

			// Ход 1: Взять 1 любую палочку
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

			// Ход 2: Взять 2 палочки из одной группы
			for (let i = 0; i < piles.length; i++) {
				const pileSize = piles[i]
				if (pileSize < 2) continue
				if (i > 0 && piles[i] === piles[i - 1]) continue
				const basePiles = [...piles.slice(0, i), ...piles.slice(i + 1)]
				for (let p1 = 1; p1 <= pileSize; p1++) {
					for (let p2 = p1 + 1; p2 <= pileSize; p2++) {
						const newPiles = [...basePiles]
						const firstSegmentSize = p1 - 1
						const middleSegmentSize = p2 - p1 - 1
						const lastSegmentSize = pileSize - p2
						if (firstSegmentSize > 0) newPiles.push(firstSegmentSize)
						if (middleSegmentSize > 0) newPiles.push(middleSegmentSize)
						if (lastSegmentSize > 0) newPiles.push(lastSegmentSize)
						newPiles.sort((a, b) => a - b)
						reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
					}
				}
			}

			// Ход 3: Взять 3 палочки подряд
			for (let i = 0; i < piles.length; i++) {
				if (i > 0 && piles[i] === piles[i - 1]) continue
				const pileSize = piles[i]
				if (pileSize >= 3) {
					const basePiles = [...piles.slice(0, i), ...piles.slice(i + 1)]
					// Взять с края
					if (pileSize - 3 > 0) {
						const newPiles = [...basePiles, pileSize - 3].sort((a, b) => a - b)
						reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
					} else {
						const newPiles = [...basePiles].sort((a, b) => a - b)
						reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
					}
					// Взять из середины
					for (let j = 1; j <= (pileSize - 3) / 2; j++) {
						const newPiles = [...basePiles, j, pileSize - 3 - j].sort(
							(a, b) => a - b
						)
						reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
					}
				}
			}

			// === КОНЕЦ ПОЛНОЙ ЛОГИКИ ПЕРЕБОРА ХОДОВ ===

			let mex = 0
			while (reachableGrundyNumbers.has(mex)) mex++
			grundyMemo.set(key, mex)
		}
		onProgress(Math.round((totalSticks / maxSticks) * 100))
	}
	return grundyMemo
}

export function move_5(
	currentPiles: number[],
	grundyValues: GrundyCache
): number[] | null {
	const piles = [...currentPiles].sort((a, b) => a - b)
	const initialKey = piles.join(',')

	if (grundyValues.get(initialKey) === 0) {
		if (piles.length === 0) return []
		const lastPileIndex = piles.length - 1
		const newPiles = [...piles]
		newPiles[lastPileIndex]--
		return newPiles.filter(p => p > 0)
	}

	// === НАЧАЛО ПОЛНОЙ ЛОГИКИ ПОИСКА ВЫИГРЫШНОГО ХОДА ===

	// Поиск хода 1: Взять 1 любую палочку
	for (let i = 0; i < piles.length; i++) {
		if (i > 0 && piles[i] === piles[i - 1]) continue
		const pileSize = piles[i]
		const basePiles = [...piles.slice(0, i), ...piles.slice(i + 1)]
		// Взять и оставить одну кучу
		if (pileSize - 1 > 0) {
			const newPiles = [...basePiles, pileSize - 1].sort((a, b) => a - b)
			if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
		} else {
			// Взять и оставить 0 куч (если была 1 палочка)
			const newPiles = [...basePiles].sort((a, b) => a - b)
			if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
		}
		// Взять и оставить две кучи
		for (let j = 1; j <= (pileSize - 1) / 2; j++) {
			const newPiles = [...basePiles, j, pileSize - 1 - j].sort((a, b) => a - b)
			if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
		}
	}

	// Поиск хода 2: Взять 2 палочки из одной группы
	for (let i = 0; i < piles.length; i++) {
		const pileSize = piles[i]
		if (pileSize < 2) continue
		if (i > 0 && piles[i] === piles[i - 1]) continue
		const basePiles = [...piles.slice(0, i), ...piles.slice(i + 1)]
		for (let p1 = 1; p1 <= pileSize; p1++) {
			for (let p2 = p1 + 1; p2 <= pileSize; p2++) {
				const newPiles = [...basePiles]
				const first = p1 - 1,
					middle = p2 - p1 - 1,
					last = pileSize - p2
				if (first > 0) newPiles.push(first)
				if (middle > 0) newPiles.push(middle)
				if (last > 0) newPiles.push(last)
				newPiles.sort((a, b) => a - b)
				if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
			}
		}
	}

	// Поиск хода 3: Взять 3 палочки подряд
	for (let i = 0; i < piles.length; i++) {
		if (i > 0 && piles[i] === piles[i - 1]) continue
		const pileSize = piles[i]
		if (pileSize >= 3) {
			const basePiles = [...piles.slice(0, i), ...piles.slice(i + 1)]
			// Взять с края
			if (pileSize - 3 > 0) {
				const newPiles = [...basePiles, pileSize - 3].sort((a, b) => a - b)
				if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
			} else {
				const newPiles = [...basePiles].sort((a, b) => a - b)
				if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
			}
			// Взять из середины
			for (let j = 1; j <= (pileSize - 3) / 2; j++) {
				const newPiles = [...basePiles, j, pileSize - 3 - j].sort(
					(a, b) => a - b
				)
				if (grundyValues.get(newPiles.join(',')) === 0) return newPiles
			}
		}
	}

	// === КОНЕЦ ПОЛНОЙ ЛОГИКИ ПОИСКА ВЫИГРЫШНОГО ХОДА ===

	return null // Если выигрышный ход не найден (не должно случиться)
}

/**
 * ФИНАЛЬНАЯ, ЗАВЕРШЕННАЯ И ИСПРАВЛЕННАЯ ВЕРСИЯ ПРОВЕРКИ ДЛЯ РЕЖИМА 5.
 */
export function mode_5_check(
	positionBefore: number[],
	positionAfter: number[]
): boolean {
	const sticksBefore = positionBefore.reduce((sum, val) => sum + val, 0)
	const sticksAfter = positionAfter.reduce((sum, val) => sum + val, 0)
	const takenCount = sticksBefore - sticksAfter

	// Правило 1 и 2: Можно взять 1 или 2 любые палочки.
	if (takenCount === 1 || takenCount === 2) {
		return true
	}

	// Правило 3: Можно взять 3 подряд идущие палочки.
	if (takenCount === 3) {
		// Проверка на "подряд" для 3-х палочек эквивалентна проверке для режимов 3 и 4:
		// игрок должен воздействовать только на одну группу.

		let prefixLength = 0
		while (
			prefixLength < positionBefore.length &&
			prefixLength < positionAfter.length &&
			positionBefore[prefixLength] === positionAfter[prefixLength]
		) {
			prefixLength++
		}
		let suffixLength = 0
		while (
			suffixLength < positionBefore.length - prefixLength &&
			suffixLength < positionAfter.length - prefixLength &&
			positionBefore[positionBefore.length - 1 - suffixLength] ===
				positionAfter[positionAfter.length - 1 - suffixLength]
		) {
			suffixLength++
		}

		const beforeMiddle = positionBefore.slice(
			prefixLength,
			positionBefore.length - suffixLength
		)

		// Если изменилась ровно одна группа, значит ход был "подряд" внутри этой группы.
		if (beforeMiddle.length === 1) {
			return true
		}

		// Если изменилось 0 или больше 1 группы, ход неверный.
		return false
	}

	// Если взято не 1, 2, или 3 палочки, ход неверный.
	return false
}
