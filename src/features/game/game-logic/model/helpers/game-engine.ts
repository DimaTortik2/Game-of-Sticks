// // src/features/game/model/lib/game-engine.ts

// import type { IGameParams } from "../../../../../app/stores/interfaces/game-params.interface"

// // Эта переменная будет жить только внутри этого модуля.
// // Она будет кэшем для g-чисел режимов 3 и 4.
// let gNumbers: number[] = []

// // --- Функции из MathGameEngine.js, адаптированные под TS ---

// function gGen(min: number, max: number, endValue: number): number[] {
// 	const ans: number[] = []
// 	for (let i = 0; i <= endValue; i++) {
// 		const tmpGLinks = new Set<number>()
// 		for (let ii = min; ii <= max; ii++) {
// 			if (i - ii >= 0) {
// 				tmpGLinks.add(ans[i - ii])
// 				if (i - ii > 1) {
// 					for (let iii = 1; iii <= (i - ii) / 2; iii++) {
// 						tmpGLinks.add(ans[iii] ^ ans[i - ii - iii])
// 					}
// 				}
// 			} else break
// 		}
// 		let MEX = 0
// 		while (tmpGLinks.has(MEX)) MEX++
// 		ans[i] = MEX
// 	}
// 	return ans
// }

// function SticksRangeIndex(
// 	gTarget: number,
// 	stixAmount: number,
// 	min: number,
// 	max: number,
// 	deepSearch = 0
// ): [number, number] {
// 	for (let i = stixAmount - min; i >= 0 && i >= stixAmount - max; i--) {
// 		if (gNumbers[i] === gTarget) {
// 			return [stixAmount - i, 0]
// 		}
// 	}
// 	if (deepSearch) {
// 		for (let i = min; i <= max; i++) {
// 			for (let ii = 1; ii <= (stixAmount - i) / 2; ii++) {
// 				if ((gNumbers[ii] ^ gNumbers[stixAmount - i - ii]) === gTarget)
// 					return [i, ii]
// 			}
// 		}
// 	}
// 	return [-1, -1]
// }

// function positionNimSum(arg: number[]): number {
// 	let ans = 0
// 	arg.forEach(element => {
// 		ans = ans ^ gNumbers[element]
// 	})
// 	return ans
// }

// export function move_1_2(
// 	position: number[],
// 	min: number,
// 	max: number
// ): number[] {
// 	let sum = 0
// 	for (const element of position) sum += element
// 	if (sum < min) return position
// 	if (sum <= max) return [] // Возвращаем пустой массив, если можно забрать все

// 	const rest = sum % (min + max)
// 	let move = 0

// 	if (rest >= min && rest <= max) {
// 		move = rest
// 	} else {
// 		// Если остаток 0 или меньше min, то позиция проигрышная для оппонента,
// 		// делаем любой корректный ход (например, минимальный)
// 		move = min
// 	}

// 	const newPosition = [...position]
// 	let takenCount = 0
// 	while (takenCount < move) {
// 		const lastGroup = newPosition.length - 1
// 		if (lastGroup < 0) break

// 		const canTake = move - takenCount
// 		if (newPosition[lastGroup] > canTake) {
// 			newPosition[lastGroup] -= canTake
// 			takenCount = move
// 		} else {
// 			takenCount += newPosition[lastGroup]
// 			newPosition.pop()
// 		}
// 	}

// 	return newPosition.filter(count => count > 0)
// }

// export function move_3_4(
// 	position: number[],
// 	min: number,
// 	max: number
// ): number[] {
// 	// Главное изменение: gNumbers генерируются при первом вызове и кэшируются
// 	if (gNumbers.length === 0) {
// 		const maxStickCount = Math.max(...position, 50)
// 		gNumbers = gGen(min, max, maxStickCount)
// 	}

// 	const nimSum = positionNimSum(position)

// 	// Если позиция выигрышная, ищем выигрышный ход
// 	if (nimSum !== 0) {
// 		// Сначала ищем ход без разбиения
// 		for (let i = 0; i < position.length; i++) {
// 			const gTarget = nimSum ^ gNumbers[position[i]]
// 			const bestMove = SticksRangeIndex(gTarget, position[i], min, max)
// 			if (bestMove[1] !== -1) {
// 				const ansPos = [...position]
// 				if (position[i] - bestMove[0] > 0) {
// 					ansPos.splice(i, 1, position[i] - bestMove[0])
// 				} else {
// 					ansPos.splice(i, 1)
// 				}
// 				return ansPos
// 			}
// 		}
// 		// Если не нашли, ищем с разбиением
// 		for (let i = 0; i < position.length; i++) {
// 			const gTarget = nimSum ^ gNumbers[position[i]]
// 			const bestMove = SticksRangeIndex(gTarget, position[i], min, max, 1)
// 			if (bestMove[1] !== -1) {
// 				const ansPos = [...position]
// 				ansPos.splice(
// 					i,
// 					1,
// 					bestMove[1],
// 					position[i] - bestMove[0] - bestMove[1]
// 				)
// 				return ansPos.filter(count => count > 0)
// 			}
// 		}
// 	}

// 	// Если позиция проигрышная (nimSum === 0), делаем любой минимальный ход
// 	for (let i = 0; i < position.length; i++) {
// 		if (position[i] >= min) {
// 			const ansPos = [...position]
// 			ansPos[i] -= min
// 			return ansPos.filter(count => count > 0)
// 		}
// 	}

// 	return position // Если ход невозможен
// }

// export function mode_1_2_check(
// 	positionBefore: number[],
// 	positionAfter: number[],
// 	min: number,
// 	max: number
// ): boolean {
// 	const startSum = positionBefore.reduce((sum, val) => sum + val, 0)
// 	const endSum = positionAfter.reduce((sum, val) => sum + val, 0)
// 	const movedSticks = startSum - endSum
// 	return movedSticks >= min && movedSticks <= max
// }

// export function mode_3_4_check(
// 	positionBefore: number[],
// 	positionAfter: number[],
// 	min: number,
// 	max: number
// ): boolean {
// 	// Эта логика сложна и специфична, переносим её как есть
// 	let flag = false
// 	let offset = 0
// 	const cycleCount = Math.max(positionBefore.length, positionAfter.length)

// 	for (let i = 0; i < cycleCount + 1; i++) {
// 		// +1 to handle edge cases
// 		const before = positionBefore[i]
// 		const after = positionAfter[i + offset]

// 		if (before === after) continue
// 		if (flag) return false // Уже было изменение, второе недопустимо

// 		flag = true
// 		const nextBefore = positionBefore[i + 1]
// 		const nextAfter = positionAfter[i + offset + 1]

// 		if (nextBefore === after) {
// 			// Удален целый фрагмент
// 			if (before < min || before > max) return false
// 			offset -= 1
// 		} else if (nextBefore === nextAfter) {
// 			// Фрагмент уменьшился
// 			if (typeof before === 'undefined' || typeof after === 'undefined')
// 				return false
// 			const movedSticks = before - after
// 			if (movedSticks < min || movedSticks > max) return false
// 		} else if (positionBefore[i + 1] === positionAfter[i + offset + 2]) {
// 			// Фрагмент разбили на два
// 			if (
// 				typeof before === 'undefined' ||
// 				typeof after === 'undefined' ||
// 				typeof nextAfter === 'undefined'
// 			)
// 				return false
// 			const movedSticks = before - after - nextAfter
// 			if (movedSticks < min || movedSticks > max) return false
// 			offset += 1
// 		} else {
// 			return false
// 		}
// 	}
// 	return flag // Ход считается валидным, если было ровно одно изменение
// }

// export function canAnyoneMove(
// 	position: number[],
// 	gameParams: IGameParams,
// 	modeNum: number
// ): boolean {
// 	// Если палочек нет, ходить нельзя
// 	if (position.length === 0) {
// 		return false
// 	}

// 	switch (modeNum) {
// 		case 1: // Стандартный
// 		case 2: // Интервальный
// 			const totalSticks = position.reduce((sum, val) => sum + val, 0)
// 			const minTake = modeNum === 1 ? 1 : gameParams.sticksRange?.[0] || 1
// 			return totalSticks >= minTake

// 		case 3: // Подряд
// 		case 4: // Подряд и интервально
// 			const largestGroup = Math.max(0, ...position)
// 			const minConsecutiveTake =
// 				modeNum === 3 ? 1 : gameParams.sticksRangeStreak?.[0] || 1
// 			return largestGroup >= minConsecutiveTake

// 		case 5: // Особый
// 			// В особом режиме всегда можно взять 1 палочку, если она есть
// 			return position.reduce((sum, val) => sum + val, 0) > 0

// 		default:
// 			return false // На всякий случай
// 	}
// }

import type { IGameParams } from '../../../../../app/stores/interfaces/game-params.interface'

export function gGen(min: number, max: number, endValue: number): number[] {
	const ans: number[] = []
	for (let i = 0; i <= endValue; i++) {
		const tmpGLinks = new Set<number>()
		for (let ii = min; ii <= max; ii++) {
			if (i - ii >= 0) {
				tmpGLinks.add(ans[i - ii])
				if (i - ii > 1) {
					for (let iii = 1; iii <= (i - ii) / 2; iii++) {
						tmpGLinks.add(ans[iii] ^ ans[i - ii - iii])
					}
				}
			} else break
		}
		let MEX = 0
		while (tmpGLinks.has(MEX)) MEX++
		ans[i] = MEX
	}
	return ans
}

// Эта функция теперь тоже чистая и принимает gNumbers как аргумент
function SticksRangeIndex(
	gNumbers: number[],
	gTarget: number,
	stixAmount: number,
	min: number,
	max: number,
	deepSearch = 0
): [number, number] {
	for (let i = stixAmount - min; i >= 0 && i >= stixAmount - max; i--) {
		if (gNumbers[i] === gTarget) {
			return [stixAmount - i, 0]
		}
	}
	if (deepSearch) {
		for (let i = min; i <= max; i++) {
			for (let ii = 1; ii <= (stixAmount - i) / 2; ii++) {
				if ((gNumbers[ii] ^ gNumbers[stixAmount - i - ii]) === gTarget)
					return [i, ii]
			}
		}
	}
	return [-1, -1]
}

// Эта функция теперь тоже чистая
function positionNimSum(gNumbers: number[], arg: number[]): number {
	let ans = 0
	arg.forEach(element => {
		if (gNumbers[element] !== undefined) {
			ans = ans ^ gNumbers[element]
		}
	})
	return ans
}

export function move_1_2(
	position: number[],
	min: number,
	max: number
): number[] {
	let sum = position.reduce((a, b) => a + b, 0)
	if (sum < min) return position
	if (sum <= max) return []

	const rest = sum % (min + max)
	let move = rest >= min && rest <= max ? rest : min

	const newPosition = [...position]
	let takenCount = 0
	while (takenCount < move) {
		const lastGroup = newPosition.length - 1
		if (lastGroup < 0) break
		const canTake = move - takenCount
		if (newPosition[lastGroup] > canTake) {
			newPosition[lastGroup] -= canTake
			takenCount = move
		} else {
			takenCount += newPosition[lastGroup]
			newPosition.pop()
		}
	}
	return newPosition.filter(count => count > 0)
}

// ГЛАВНОЕ ИЗМЕНЕНИЕ: move_3_4 теперь требует gNumbers как четвертый аргумент
export function move_3_4(
	position: number[],
	min: number,
	max: number,
	gNumbers: number[]
): number[] | null {
	if (!gNumbers || gNumbers.length === 0) {
		console.error('AI knowledge (gNumbers) is missing for move_3_4')
		return null // Возвращаем null если знаний нет
	}
	const nimSum = positionNimSum(gNumbers, position)

	if (nimSum !== 0) {
		for (let i = 0; i < position.length; i++) {
			const gTarget = nimSum ^ gNumbers[position[i]]
			const bestMove = SticksRangeIndex(
				gNumbers,
				gTarget,
				position[i],
				min,
				max
			)
			if (bestMove[1] !== -1) {
				const ansPos = [...position]
				if (position[i] - bestMove[0] > 0) {
					ansPos.splice(i, 1, position[i] - bestMove[0])
				} else {
					ansPos.splice(i, 1)
				}
				return ansPos
			}
		}
		for (let i = 0; i < position.length; i++) {
			const gTarget = nimSum ^ gNumbers[position[i]]
			const bestMove = SticksRangeIndex(
				gNumbers,
				gTarget,
				position[i],
				min,
				max,
				1
			)
			if (bestMove[1] !== -1) {
				const ansPos = [...position]
				ansPos.splice(
					i,
					1,
					bestMove[1],
					position[i] - bestMove[0] - bestMove[1]
				)
				return ansPos.filter(count => count > 0)
			}
		}
	}

	// Если позиция проигрышная, делаем любой корректный ход
	for (let i = 0; i < position.length; i++) {
		if (position[i] >= min) {
			const ansPos = [...position]
			ansPos[i] -= min
			return ansPos.filter(count => count > 0)
		}
	}
	return null // Если ход невозможен, возвращаем null
}

export function mode_1_2_check(
	positionBefore: number[],
	positionAfter: number[],
	min: number,
	max: number
): boolean {
	const startSum = positionBefore.reduce((sum, val) => sum + val, 0)
	const endSum = positionAfter.reduce((sum, val) => sum + val, 0)
	const movedSticks = startSum - endSum
	return movedSticks >= min && movedSticks <= max
}

export function mode_3_4_check(
	positionBefore: number[],
	positionAfter: number[],
	min: number,
	max: number
): boolean {
	const sticksBefore = positionBefore.reduce((a, b) => a + b, 0)
	const sticksAfter = positionAfter.reduce((a, b) => a + b, 0)
	const takenCount = sticksBefore - sticksAfter
	if (takenCount < min || takenCount > max) return false
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
	return beforeMiddle.length === 1
}

export function canAnyoneMove(
	position: number[],
	gameParams: IGameParams,
	modeNum: number
): boolean {
	if (position.length === 0) return false
	switch (modeNum) {
		case 1:
		case 2:
			const totalSticks = position.reduce((sum, val) => sum + val, 0)
			const minTake = modeNum === 1 ? 1 : gameParams.sticksRange?.[0] || 1
			return totalSticks >= minTake
		case 3:
		case 4:
			const largestGroup = Math.max(0, ...position)
			const minConsecutiveTake =
				modeNum === 3 ? 1 : gameParams.sticksRangeStreak?.[0] || 1
			return largestGroup >= minConsecutiveTake
		case 5:
			return position.reduce((sum, val) => sum + val, 0) > 0
		default:
			return false
	}
}