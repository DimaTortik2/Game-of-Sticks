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
						const first = p1 - 1,
							middle = p2 - p1 - 1,
							last = pileSize - p2
						if (first > 0) newPiles.push(first)
						if (middle > 0) newPiles.push(middle)
						if (last > 0) newPiles.push(last)
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
					if (pileSize - 3 > 0) {
						const newPiles = [...basePiles, pileSize - 3].sort((a, b) => a - b)
						reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
					} else {
						const newPiles = [...basePiles].sort((a, b) => a - b)
						reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
					}
					for (let j = 1; j <= (pileSize - 3) / 2; j++) {
						const newPiles = [...basePiles, j, pileSize - 3 - j].sort(
							(a, b) => a - b
						)
						reachableGrundyNumbers.add(grundyMemo.get(newPiles.join(','))!)
					}
				}
			}

			let mex = 0
			while (reachableGrundyNumbers.has(mex)) mex++
			grundyMemo.set(key, mex)
		}
		onProgress(Math.round((totalSticks / maxSticks) * 100))
	}
	return grundyMemo
}

/**
 * ФИНАЛЬНАЯ, НАДЕЖНАЯ ВЕРСИЯ.
 * Гарантированно возвращает ход, если он возможен.
 */
export function move_5(
	currentPiles: number[],
	grundyValues: GrundyCache
): number[] | null {
	const piles = [...currentPiles].sort((a, b) => a - b)
	const initialKey = piles.join(',')
	const currentGrundy = grundyValues.get(initialKey)

	console.log(`%c[AI Brain M5] Запущена move_5`, 'color: #FFA500', {
		position: piles,
		gValue: currentGrundy,
	})

	// --- ПЛАН А: Поиск идеального выигрышного хода (приводящего к g=0) ---
	if (currentGrundy !== 0) {
		console.log(
			`%c[AI Brain M5] Позиция выигрышная. Ищу ход в g=0...`,
			'color: #FFA500'
		)
		// Поиск хода 1: Взять 1 любую палочку
		for (let i = 0; i < piles.length; i++) {
			const pileSize = piles[i]
			const basePiles = [...piles.slice(0, i), ...piles.slice(i + 1)]
			if (pileSize - 1 >= 0) {
				const tempPiles = [...basePiles]
				if (pileSize - 1 > 0) tempPiles.push(pileSize - 1)
				tempPiles.sort((a, b) => a - b)
				if (grundyValues.get(tempPiles.join(',')) === 0) {
					console.log(
						`%c[AI Brain M5] РЕШЕНИЕ (взять 1): ${JSON.stringify(tempPiles)}`,
						'color: #3498DB; font-weight: bold;'
					)
					return tempPiles
				}
			}
			for (let j = 1; j <= (pileSize - 1) / 2; j++) {
				const tempPiles = [...basePiles, j, pileSize - 1 - j].sort(
					(a, b) => a - b
				)
				if (grundyValues.get(tempPiles.join(',')) === 0) {
					console.log(
						`%c[AI Brain M5] РЕШЕНИЕ (взять 1, разделив): ${JSON.stringify(
							tempPiles
						)}`,
						'color: #3498DB; font-weight: bold;'
					)
					return tempPiles
				}
			}
		}

		// Поиск хода 2: Взять 2 палочки из одной группы
		for (let i = 0; i < piles.length; i++) {
			const pileSize = piles[i]
			if (pileSize < 2) continue
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
					if (grundyValues.get(newPiles.join(',')) === 0) {
						console.log(
							`%c[AI Brain M5] РЕШЕНИЕ (взять 2): ${JSON.stringify(newPiles)}`,
							'color: #3498DB; font-weight: bold;'
						)
						return newPiles
					}
				}
			}
		}

		// Поиск хода 3: Взять 3 палочки подряд
		for (let i = 0; i < piles.length; i++) {
			const pileSize = piles[i]
			if (pileSize >= 3) {
				const basePiles = [...piles.slice(0, i), ...piles.slice(i + 1)]
				const tempPiles1 = [...basePiles]
				if (pileSize - 3 > 0) tempPiles1.push(pileSize - 3)
				tempPiles1.sort((a, b) => a - b)
				if (grundyValues.get(tempPiles1.join(',')) === 0) {
					console.log(
						`%c[AI Brain M5] РЕШЕНИЕ (взять 3 подряд): ${JSON.stringify(
							tempPiles1
						)}`,
						'color: #3498DB; font-weight: bold;'
					)
					return tempPiles1
				}
				for (let j = 1; j <= (pileSize - 3) / 2; j++) {
					const tempPiles2 = [...basePiles, j, pileSize - 3 - j].sort(
						(a, b) => a - b
					)
					if (grundyValues.get(tempPiles2.join(',')) === 0) {
						console.log(
							`%c[AI Brain M5] РЕШЕНИЕ (взять 3 подряд, разделив): ${JSON.stringify(
								tempPiles2
							)}`,
							'color: #3498DB; font-weight: bold;'
						)
						return tempPiles2
					}
				}
			}
		}
	}

	// --- ПЛАН Б: Если позиция проигрышная (g=0) или идеальный ход не найден ---
	console.warn(
		`%c[AI Brain M5] Позиция проигрышная (g=0) или идеальный ход не найден. Делаю любой корректный ход...`,
		'color: #F39C12'
	)
	if (piles.length > 0) {
		const newPiles = [...piles]
		const largestGroupIndex = newPiles.reduce(
			(maxIndex, currentVal, currentIndex, arr) =>
				currentVal > arr[maxIndex] ? currentIndex : maxIndex,
			0
		)
		newPiles[largestGroupIndex]--
		const finalPos = newPiles.filter(p => p > 0)
		console.log(
			`%c[AI Brain M5] РЕШЕНИЕ (План Б): ${JSON.stringify(finalPos)}`,
			'color: #3498DB; font-weight: bold;'
		)
		return finalPos
	}

	console.error(
		`%c[AI Brain M5] Не удалось найти ни одного хода!`,
		'color: #E74C3C'
	)
	return null // Возвращаем null только если палочек ВООБЩЕ нет
}
export function mode_5_check(
	positionBefore: number[],
	positionAfter: number[]
): boolean {
	const sticksBefore = positionBefore.reduce((sum, val) => sum + val, 0)
	const sticksAfter = positionAfter.reduce((sum, val) => sum + val, 0)
	const takenCount = sticksBefore - sticksAfter

	if (takenCount === 1 || takenCount === 2) {
		return true
	}

	if (takenCount === 3) {
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

		if (beforeMiddle.length === 1) {
			return true
		}

		return false
	}

	return false
}
